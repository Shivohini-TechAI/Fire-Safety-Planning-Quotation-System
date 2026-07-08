import pytest


@pytest.fixture
def sample_floor_plan() -> dict:
    return {
        "floor_plan_id": "FP-TEST-01",
        "client_id": "C-TEST",
        "building_type": "office",
        "total_floors": 2,
        "total_area_sqft": 1000,
        "spaces": [
            {"id": 1, "type": "room", "area_sqft": 300, "floor": 1, "confidence": 0.9},
            {"id": 2, "type": "hallway", "length_ft": 40, "floor": 1, "confidence": 0.85},
            {"id": 3, "type": "staircase", "area_sqft": 80, "floor": 1, "confidence": 0.95},
            {"id": 4, "type": "room", "area_sqft": 5, "floor": 2, "confidence": 0.3},
        ],
    }


@pytest.fixture
def sample_rules() -> list[dict]:
    """A small, complete rule set used ONLY for testing the engine
    mechanism — these numbers are not real fire-code values."""
    return [
        {
            "rule_id": "TEST-ROOM-001",
            "applies_to_space_type": "room",
            "condition": {"field": "area_sqft", "operator": ">=", "value": 50},
            "action": {"equipment": "smoke_detector", "qty_rule": {"type": "per_area_sqft", "divisor": 100}},
            "standard_reference": "TEST-STD",
        },
        {
            "rule_id": "TEST-HALL-001",
            "applies_to_space_type": "hallway",
            "condition": {"field": "length_ft", "operator": ">=", "value": 30},
            "action": {"equipment": "smoke_detector", "qty_rule": {"type": "per_length_ft", "divisor": 20}},
            "standard_reference": "TEST-STD",
        },
        {
            "rule_id": "TEST-BUILDING-001",
            "applies_to_space_type": "__building__",
            "condition": {"field": "num_floors", "operator": ">=", "value": 1},
            "action": {"equipment": "fire_alarm_panel", "qty_rule": {"type": "fixed", "value": 1}},
            "standard_reference": "TEST-STD",
        },
        {
            "rule_id": "TEMPLATE-INCOMPLETE",
            "applies_to_space_type": "room",
            "condition": {"field": "area_sqft", "operator": ">=", "value": None},
            "action": {"equipment": "fire_extinguisher_dry_powder", "qty_rule": {"type": "fixed", "value": None}},
            "standard_reference": "TBD",
        },
    ]
