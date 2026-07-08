"""
Generic, standard-agnostic rule engine.

Changes from v0.1 → v0.2:
  - apply_rules_to_space now receives building_type so rules can declare
    applies_to_building_types (e.g. only sprinkler at 130 sqft/head for
    offices, 200 sqft/head for schools).
  - _compute_qty supports a new "equals_field" type — reads a numeric
    field from the same record dict and returns it as the quantity.
    Used by UAE rules such as "1 zone control valve per floor"
    (qty_rule: {"type": "equals_field", "field": "num_floors"}).

Still zero eval(), zero hardcoded fire-code numbers.
"""
import logging
import math

logger = logging.getLogger("rule_engine")

_OPERATORS = {
    ">=": lambda a, b: a >= b,
    ">":  lambda a, b: a > b,
    "<=": lambda a, b: a <= b,
    "<":  lambda a, b: a < b,
    "==": lambda a, b: a == b,
}


def _condition_met(record: dict, condition: dict) -> bool:
    field    = condition.get("field")
    operator = condition.get("operator")
    value    = condition.get("value")

    if value is None or field is None or operator not in _OPERATORS:
        return False          # incomplete / template rule — never fires

    actual = record.get(field)
    if actual is None:
        return False

    try:
        return _OPERATORS[operator](actual, value)
    except TypeError:
        return False           # type mismatch — fail safe


def _building_type_matches(rule: dict, building_type: str | None) -> bool:
    """Return True when the rule has no building-type restriction, or
    when building_type is in the rule's allow-list."""
    allowed = rule.get("applies_to_building_types")
    if not allowed:           # None or [] → applies to everything
        return True
    if building_type is None:
        return False
    return building_type.lower() in [b.lower() for b in allowed]


def _compute_qty(record: dict, qty_rule: dict) -> int | None:
    rule_type = qty_rule.get("type")

    if rule_type == "fixed":
        value = qty_rule.get("value")
        return int(value) if value is not None else None

    if rule_type == "per_area_sqft":
        divisor = qty_rule.get("divisor")
        area    = record.get("area_sqft")
        if not divisor or area is None:
            return None
        return max(1, math.ceil(area / divisor))

    if rule_type == "per_length_ft":
        divisor = qty_rule.get("divisor")
        length  = record.get("length_ft")
        if not divisor or length is None:
            return None
        return max(1, math.ceil(length / divisor))

    if rule_type == "equals_field":
        # Return the value of a numeric field from record as the quantity.
        # Example: {"type": "equals_field", "field": "num_floors"} → qty = num_floors.
        field = qty_rule.get("field")
        if not field:
            return None
        value = record.get(field)
        if value is None:
            return None
        return max(1, int(math.ceil(value)))

    return None


def apply_rules_to_space(
    space: dict,
    rules: list[dict],
    building_type: str | None = None,
) -> tuple[list[dict], list[str]]:
    """Apply every rule whose applies_to_space_type matches this space's type
    and whose applies_to_building_types (if set) includes building_type."""
    recommendations: list[dict] = []
    skipped: list[str] = []

    for rule in rules:
        if rule.get("applies_to_space_type") != space.get("type"):
            continue

        if not _building_type_matches(rule, building_type):
            continue

        condition = rule.get("condition", {})
        if condition.get("value") is None:
            skipped.append(rule.get("rule_id", "UNKNOWN"))
            continue

        if not _condition_met(space, condition):
            continue

        action = rule.get("action", {})
        qty    = _compute_qty(space, action.get("qty_rule", {}))
        if qty is None or qty <= 0:
            skipped.append(rule.get("rule_id", "UNKNOWN"))
            continue

        recommendations.append({
            "item":               action.get("equipment"),
            "qty":                qty,
            "space_id":           space.get("id"),
            "zone":               f"Floor {space.get('floor')}" if space.get("floor") is not None else "Unknown",
            "rule_ref":           rule.get("rule_id"),
            "standard_reference": rule.get("standard_reference", "TBD"),
        })

    return recommendations, skipped


def apply_building_level_rules(
    building_summary: dict,
    rules: list[dict],
) -> tuple[list[dict], list[str]]:
    """Apply rules that act on the whole building (applies_to_space_type
    == '__building__').  The record passed to condition checks is
    building_summary itself, so fields like num_floors and is_high_rise
    are available directly."""
    recommendations: list[dict] = []
    skipped: list[str] = []
    building_type = building_summary.get("building_type")

    for rule in rules:
        if rule.get("applies_to_space_type") != "__building__":
            continue

        if not _building_type_matches(rule, building_type):
            continue

        condition = rule.get("condition", {})
        if condition.get("value") is None:
            skipped.append(rule.get("rule_id", "UNKNOWN"))
            continue

        if not _condition_met(building_summary, condition):
            continue

        action = rule.get("action", {})
        qty    = _compute_qty(building_summary, action.get("qty_rule", {}))
        if qty is None or qty <= 0:
            skipped.append(rule.get("rule_id", "UNKNOWN"))
            continue

        recommendations.append({
            "item":               action.get("equipment"),
            "qty":                qty,
            "space_id":           None,
            "zone":               "Whole Building",
            "rule_ref":           rule.get("rule_id"),
            "standard_reference": rule.get("standard_reference", "TBD"),
        })

    return recommendations, skipped


def run_rule_engine(
    spaces: list[dict],
    building_summary: dict,
    rules: list[dict],
) -> tuple[list[dict], list[str]]:
    """Entry point — runs all per-space and building-level rules."""
    all_recs:    list[dict] = []
    all_skipped: list[str]  = []
    building_type = building_summary.get("building_type")

    for space in spaces:
        recs, skipped = apply_rules_to_space(space, rules, building_type)
        all_recs.extend(recs)
        all_skipped.extend(skipped)

    b_recs, b_skipped = apply_building_level_rules(building_summary, rules)
    all_recs.extend(b_recs)
    all_skipped.extend(b_skipped)

    unique_skipped = sorted(set(all_skipped))
    if unique_skipped:
        logger.info(
            "Skipped %d rule(s) (template/null values or building-type mismatch): %s",
            len(unique_skipped), unique_skipped,
        )

    return all_recs, unique_skipped
