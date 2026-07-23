"""
Computes building-level and per-floor metrics from the list of spaces
detected by Member 5's computer-vision pipeline.

Pure functions only — no I/O, no API calls — which makes this trivial to
unit test and safe to reuse from the API, the sample-pipeline script, or
a future batch-processing job.
"""
from collections import defaultdict


def calculate_summary(floor_plan: dict) -> dict:
    """
    floor_plan is a dict shaped like FloorPlanInput.model_dump() — i.e.
    it has 'spaces', 'building_type', 'total_floors', etc.

    Returns a flat dict of metrics that the rule engine and the API
    response both consume.
    """
    spaces = floor_plan.get("spaces", [])
    building_type = floor_plan.get("building_type")
    num_floors = floor_plan.get("total_floors", 0) or 0

    total_area = 0.0
    area_by_floor: dict[int, float] = defaultdict(float)
    space_type_counts: dict[str, int] = defaultdict(int)
    hallway_length_total = 0.0

    for space in spaces:
        space_type = space.get("type")
        space_type_counts[space_type] += 1

        area = space.get("area_sqft")
        floor = space.get("floor")
        if area is not None:
            total_area += area
            if floor is not None:
                area_by_floor[floor] += area

        if space_type == "hallway":
            hallway_length_total += space.get("length_ft") or 0

    return {
        "client_id": floor_plan.get("client_id"),
        "building_type": building_type,
        "num_floors": num_floors,
        "is_high_rise": num_floors > 4,
        "total_area_sqft": round(total_area, 2),
        "declared_area_sqft": floor_plan.get("total_area_sqft"),
        "area_by_floor": {k: round(v, 2) for k, v in area_by_floor.items()},
        "space_type_counts": dict(space_type_counts),
        "num_rooms": space_type_counts.get("room", 0),
        "has_staircase": space_type_counts.get("staircase", 0) > 0,
        "hallway_total_ft": round(hallway_length_total, 2),
    }
