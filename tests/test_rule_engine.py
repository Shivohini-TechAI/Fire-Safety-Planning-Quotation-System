"""Tests for the rule engine — covers both generic mechanism tests
(using the tiny test fixtures from conftest) and UAE-specific behaviour."""
import json
from pathlib import Path

import pytest

from app.core.area_calculator import calculate_summary
from app.core.rule_engine import (
    apply_building_level_rules,
    apply_rules_to_space,
    run_rule_engine,
)


# ── helpers ──────────────────────────────────────────────────────────────
def _load_uae_rules() -> list[dict]:
    path = Path(__file__).resolve().parent.parent / "config" / "rules_uae.json"
    with open(path) as f:
        return json.load(f)["rules"]


# ── generic mechanism tests (use conftest fixtures) ────────────────────

def test_room_and_hallway_rules_fire(sample_floor_plan, sample_rules):
    summary = calculate_summary(sample_floor_plan)
    recs, _ = run_rule_engine(sample_floor_plan["spaces"], summary, sample_rules)
    items = [r["item"] for r in recs]
    assert "smoke_detector" in items
    assert "fire_alarm_panel" in items


def test_building_level_rule_has_no_space_id(sample_floor_plan, sample_rules):
    summary = calculate_summary(sample_floor_plan)
    recs, _ = run_rule_engine(sample_floor_plan["spaces"], summary, sample_rules)
    panel = next(r for r in recs if r["item"] == "fire_alarm_panel")
    assert panel["space_id"] is None
    assert panel["zone"] == "Whole Building"


def test_template_rule_with_null_value_is_skipped(sample_floor_plan, sample_rules):
    summary = calculate_summary(sample_floor_plan)
    _, skipped = run_rule_engine(sample_floor_plan["spaces"], summary, sample_rules)
    assert "TEMPLATE-INCOMPLETE" in skipped


def test_empty_rules_returns_empty_safely(sample_floor_plan):
    summary = calculate_summary(sample_floor_plan)
    recs, skipped = run_rule_engine(sample_floor_plan["spaces"], summary, [])
    assert recs == []
    assert skipped == []


# ── equals_field qty rule ──────────────────────────────────────────────

def test_equals_field_qty_rule_returns_num_floors():
    rule = {
        "rule_id": "TEST-ZCV",
        "applies_to_space_type": "__building__",
        "applies_to_building_types": None,
        "condition": {"field": "num_floors", "operator": ">=", "value": 1},
        "action": {
            "equipment": "zone_control_valve",
            "qty_rule": {"type": "equals_field", "field": "num_floors"},
        },
        "standard_reference": "TEST",
    }
    summary = {
        "num_floors": 5,
        "total_area_sqft": 5000,
        "is_high_rise": True,
        "building_type": "office",
    }
    recs, _ = apply_building_level_rules(summary, [rule])
    assert len(recs) == 1
    assert recs[0]["qty"] == 5


# ── building_type filter ───────────────────────────────────────────────

def test_building_type_filter_applies_matching_type():
    """Rule scoped to office should fire for building_type='office'."""
    rule = {
        "rule_id": "TEST-FILTER-OK",
        "applies_to_space_type": "room",
        "applies_to_building_types": ["office"],
        "condition": {"field": "area_sqft", "operator": ">=", "value": 100},
        "action": {
            "equipment": "sprinkler_pendant_concealed",
            "qty_rule": {"type": "per_area_sqft", "divisor": 130},
        },
        "standard_reference": "TEST",
    }
    space = {"id": 1, "type": "room", "area_sqft": 390, "floor": 1}
    recs, _ = apply_rules_to_space(space, [rule], building_type="office")
    assert len(recs) == 1
    assert recs[0]["qty"] == 3   # ceil(390/130)


def test_building_type_filter_skips_non_matching_type():
    """Same rule should NOT fire for building_type='house'."""
    rule = {
        "rule_id": "TEST-FILTER-SKIP",
        "applies_to_space_type": "room",
        "applies_to_building_types": ["office"],
        "condition": {"field": "area_sqft", "operator": ">=", "value": 100},
        "action": {
            "equipment": "sprinkler_pendant_concealed",
            "qty_rule": {"type": "per_area_sqft", "divisor": 130},
        },
        "standard_reference": "TEST",
    }
    space = {"id": 1, "type": "room", "area_sqft": 390, "floor": 1}
    recs, _ = apply_rules_to_space(space, [rule], building_type="house")
    assert recs == []


def test_null_building_type_filter_applies_to_all():
    """applies_to_building_types=null must fire for any building type."""
    rule = {
        "rule_id": "TEST-FILTER-NULL",
        "applies_to_space_type": "room",
        "applies_to_building_types": None,
        "condition": {"field": "area_sqft", "operator": ">=", "value": 100},
        "action": {
            "equipment": "smoke_detector",
            "qty_rule": {"type": "per_area_sqft", "divisor": 900},
        },
        "standard_reference": "TEST",
    }
    space = {"id": 1, "type": "room", "area_sqft": 300, "floor": 1}
    for bt in ["office", "school", "house", "warehouse", None]:
        recs, _ = apply_rules_to_space(space, [rule], building_type=bt)
        assert len(recs) == 1, f"Expected 1 rec for building_type={bt!r}"


# ── UAE real rules ─────────────────────────────────────────────────────

def test_uae_office_sprinkler_uses_130_sqft_divisor():
    """Ordinary Hazard Gr 1: 130 sqft/head for offices (NFPA 13)."""
    rules = _load_uae_rules()
    space = {"id": 1, "type": "room", "area_sqft": 390, "floor": 1}
    recs, _ = apply_rules_to_space(space, rules, building_type="office")
    spr = [r for r in recs if r["item"] == "sprinkler_pendant_concealed"]
    assert spr, "Office room should get sprinklers"
    assert spr[0]["qty"] == 3           # ceil(390/130)


def test_uae_school_sprinkler_uses_200_sqft_divisor():
    """Light Hazard: 200 sqft/head for schools (NFPA 13)."""
    rules = _load_uae_rules()
    space = {"id": 1, "type": "room", "area_sqft": 400, "floor": 1}
    recs, _ = apply_rules_to_space(space, rules, building_type="school")
    spr = [r for r in recs if r["item"] == "sprinkler_pendant_concealed"]
    assert spr, "School room should get sprinklers"
    assert spr[0]["qty"] == 2           # ceil(400/200)


def test_uae_office_room_gets_smoke_detector_and_extinguisher():
    rules = _load_uae_rules()
    space = {"id": 1, "type": "room", "area_sqft": 400, "floor": 1}
    recs, _ = apply_rules_to_space(space, rules, building_type="office")
    items = {r["item"] for r in recs}
    assert "smoke_detector" in items
    assert "fire_extinguisher_dry_powder" in items


def test_uae_small_room_below_215sqft_gets_no_smoke_detector():
    rules = _load_uae_rules()
    space = {"id": 1, "type": "room", "area_sqft": 100, "floor": 1}
    recs, _ = apply_rules_to_space(space, rules, building_type="office")
    sd = [r for r in recs if r["item"] == "smoke_detector"]
    assert sd == []


def test_uae_hallway_gets_smoke_and_emergency_light():
    rules = _load_uae_rules()
    space = {"id": 2, "type": "hallway", "length_ft": 62, "floor": 1}
    recs, _ = apply_rules_to_space(space, rules, building_type="office")
    items = {r["item"] for r in recs}
    assert "smoke_detector" in items
    assert "emergency_light" in items


def test_uae_building_gets_fire_alarm_panel_and_zone_valves():
    rules = _load_uae_rules()
    summary = {
        "building_type": "office",
        "num_floors": 3,
        "is_high_rise": False,
        "total_area_sqft": 8000,
    }
    recs, _ = apply_building_level_rules(summary, rules)
    items = {r["item"] for r in recs}
    assert "fire_alarm_panel" in items
    assert "zone_control_valve" in items


def test_uae_zone_control_valve_qty_equals_num_floors():
    rules = _load_uae_rules()
    summary = {
        "building_type": "office",
        "num_floors": 4,
        "is_high_rise": False,
        "total_area_sqft": 12000,
    }
    recs, _ = apply_building_level_rules(summary, rules)
    zcv = next(r for r in recs if r["item"] == "zone_control_valve")
    assert zcv["qty"] == 4


def test_uae_fhc_not_added_to_single_house():
    """Fire hose cabinets should NOT fire for a standalone house."""
    rules = _load_uae_rules()
    summary = {
        "building_type": "house",
        "num_floors": 1,
        "is_high_rise": False,
        "total_area_sqft": 2000,
    }
    recs, _ = apply_building_level_rules(summary, rules)
    fhc = [r for r in recs if r["item"] == "fire_hose_cabinet"]
    # UAE-BLDG-FHC-001 applies_to_building_types excludes "house"
    # UAE-BLDG-FHC-HIGHRISE-001 condition is_high_rise==true which is false
    assert fhc == []


def test_uae_full_pipeline_office_floor_plan(sample_floor_plan):
    """Run the entire pipeline with UAE rules on the sample floor plan
    and assert the response has real equipment (not empty template output)."""
    rules = _load_uae_rules()
    # Make sample plan an office
    plan = dict(sample_floor_plan)
    plan["building_type"] = "office"
    plan["total_area_sqft"] = 1000

    summary = calculate_summary(plan)
    recs, skipped = run_rule_engine(plan["spaces"], summary, rules)

    assert recs, "UAE rules should produce real recommendations"
    assert skipped == [], "No template rules should be skipped with UAE rules"
    items = {r["item"] for r in recs}
    assert "smoke_detector" in items
    assert "sprinkler_pendant_concealed" in items
    assert "fire_extinguisher_dry_powder" in items
    assert "fire_alarm_panel" in items
