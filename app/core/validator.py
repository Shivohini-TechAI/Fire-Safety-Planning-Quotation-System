"""
Flags spaces that look like false detections from Member 5's CV model,
instead of silently feeding bad data into the rule engine — and instead
of crashing the whole request because of one bad detection.
"""
import logging

from config.settings import settings

logger = logging.getLogger("validator")


def validate_spaces(floor_plan: dict) -> tuple[list[dict], list[dict]]:
    """
    Returns (clean_spaces, review_flags).

    - Spaces with implausibly small area are dropped (not passed to the
      rule engine) and flagged as 'high' severity.
    - Spaces with low confidence are kept but flagged as 'medium' severity
      so a human can sanity-check them later — low confidence alone isn't
      reason enough to silently drop a real room.
    - If the total detected area wildly exceeds the declared floor area,
      the whole floor plan is flagged for manual review.
    - If nothing survives validation, a 'critical' flag is raised so the
      caller knows not to trust an empty-but-successful-looking response.
    """
    spaces = floor_plan.get("spaces", [])
    declared_area = floor_plan.get("total_area_sqft")

    clean_spaces: list[dict] = []
    review_flags: list[dict] = []
    detected_total = 0.0

    for space in spaces:
        area = space.get("area_sqft")
        confidence = space.get("confidence")
        drop = False

        if area is not None:
            detected_total += area
            if area < settings.MIN_VALID_AREA_SQFT:
                review_flags.append({
                    "space_id": space.get("id"),
                    "reason": (
                        f"Area {area} sqft is below the minimum plausible size "
                        f"({settings.MIN_VALID_AREA_SQFT} sqft) — likely a false detection."
                    ),
                    "severity": "high",
                })
                drop = True

        if confidence is not None and confidence < settings.MIN_CONFIDENCE:
            review_flags.append({
                "space_id": space.get("id"),
                "reason": (
                    f"Detection confidence {confidence} is below threshold "
                    f"({settings.MIN_CONFIDENCE}) — treat with caution."
                ),
                "severity": "medium",
            })
            # Low confidence alone doesn't drop the space, just flags it.

        if drop:
            logger.info("Dropped space %s — area too small to be real.", space.get("id"))
        else:
            clean_spaces.append(space)

    if declared_area and detected_total > declared_area * settings.MAX_AREA_OVERSHOOT_RATIO:
        review_flags.append({
            "space_id": None,
            "reason": (
                f"Total detected area ({detected_total:.0f} sqft) is more than "
                f"{settings.MAX_AREA_OVERSHOOT_RATIO}x the declared floor area "
                f"({declared_area} sqft) — flagged for manual review."
            ),
            "severity": "high",
        })

    if not clean_spaces:
        review_flags.append({
            "space_id": None,
            "reason": "Zero usable spaces after validation — check the uploaded floor plan or CV output.",
            "severity": "critical",
        })

    return clean_spaces, review_flags
