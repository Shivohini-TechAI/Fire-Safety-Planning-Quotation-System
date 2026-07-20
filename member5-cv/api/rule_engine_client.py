"""
fire-safety-cv/api/rule_engine_client.py

Calls Member 6's rule engine after YOLO detection finishes. This is the
ONLY file Member 5 needs to add to connect to Member 6 -- their existing
/detect endpoint just needs one new call added at the end (see bottom of
this file for the exact wiring).
"""

import os
import httpx

RULE_ENGINE_URL = os.getenv("RULE_ENGINE_URL", "")
print("RULE_ENGINE_URL =", RULE_ENGINE_URL)  # Member 6's Render URL + /recommend

RULE_ENGINE_API_KEY = os.getenv(
    "RULE_ENGINE_API_KEY", ""
)  # The key Member 6 shared


def build_floor_plan_payload(
    detections: list[dict],
    floor_plan_id: str,
    client_id: str,
    building_type: str,
    total_floors: int,
    total_area_sqft: float | None = None,
) -> dict:
    """
    detections: your raw YOLO output list, e.g.
        [{"id": 1, "type": "room", "confidence": 0.91, "floor": 1}, ...]

    The metadata arguments come from the upload form,
    NOT from the Computer Vision model.
    """

    return {
        "floor_plan_id": floor_plan_id,
        "client_id": client_id,
        "building_type": building_type,
        "total_floors": total_floors,
        "total_area_sqft": total_area_sqft,
        "spaces": detections,
    }


def send_to_rule_engine(payload: dict, timeout: float = 10.0) -> dict:
    """
    Sends the FloorPlanInput payload to Member 6's Rule Engine.
    """

    response = httpx.post(
        RULE_ENGINE_URL,
        json=payload,
        headers={
            "X-API-Key": RULE_ENGINE_API_KEY,
            "Content-Type": "application/json",
        },
        timeout=timeout,
    )

    response.raise_for_status()

    return response.json()
