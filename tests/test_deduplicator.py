from app.core.deduplicator import deduplicate


def test_merges_same_item_same_zone():
    raw = [
        {"item": "smoke_detector", "qty": 1, "zone": "Floor 1", "rule_ref": "R1"},
        {"item": "smoke_detector", "qty": 2, "zone": "Floor 1", "rule_ref": "R2"},
    ]
    result = deduplicate(raw)
    assert len(result) == 1
    assert result[0]["qty"] == 3
    assert set(result[0]["rule_refs"]) == {"R1", "R2"}


def test_keeps_different_zones_separate():
    raw = [
        {"item": "smoke_detector", "qty": 1, "zone": "Floor 1", "rule_ref": "R1"},
        {"item": "smoke_detector", "qty": 1, "zone": "Floor 2", "rule_ref": "R1"},
    ]
    result = deduplicate(raw)
    assert len(result) == 2


def test_never_returns_zero_quantity():
    raw = [{"item": "exit_sign", "qty": 0, "zone": "Floor 1", "rule_ref": "R1"}]
    result = deduplicate(raw)
    assert result[0]["qty"] == 1
