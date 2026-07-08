from app.core.validator import validate_spaces


def test_drops_implausibly_tiny_space(sample_floor_plan):
    clean, flags = validate_spaces(sample_floor_plan)
    ids = [s["id"] for s in clean]
    assert 4 not in ids  # area_sqft=5, below MIN_VALID_AREA_SQFT
    assert any(f["space_id"] == 4 and f["severity"] == "high" for f in flags)


def test_low_confidence_is_flagged_but_not_dropped(sample_floor_plan):
    plan = dict(sample_floor_plan)
    plan["spaces"] = plan["spaces"] + [
        {"id": 5, "type": "room", "area_sqft": 60, "floor": 1, "confidence": 0.2}
    ]
    clean, flags = validate_spaces(plan)
    ids = [s["id"] for s in clean]
    assert 5 in ids  # decent area -> kept, just flagged
    assert any(f["space_id"] == 5 and f["severity"] == "medium" for f in flags)


def test_empty_spaces_triggers_critical_flag():
    clean, flags = validate_spaces({"spaces": [], "total_area_sqft": 100})
    assert clean == []
    assert any(f["severity"] == "critical" for f in flags)


def test_area_overshoot_triggers_review_flag():
    plan = {
        "total_area_sqft": 100,
        "spaces": [
            {"id": 1, "type": "room", "area_sqft": 150, "floor": 1, "confidence": 0.9},
            {"id": 2, "type": "room", "area_sqft": 150, "floor": 1, "confidence": 0.9},
        ],
    }
    clean, flags = validate_spaces(plan)
    assert any("more than" in f["reason"] for f in flags)
