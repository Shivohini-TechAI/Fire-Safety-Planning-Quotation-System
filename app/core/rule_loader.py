"""
Loads the rule configuration file from disk and exposes a small, typed
accessor (RuleSet). Keeping this separate from rule_engine.py means the
engine itself never needs to know *where* rules come from — disk today,
maybe a database or an admin UI later.
"""
import json
import logging
from pathlib import Path

logger = logging.getLogger("rule_loader")


class RuleSet:
    def __init__(self, raw: dict):
        self.raw = raw
        self.standard: str = raw.get("standard", "PENDING_CONFIRMATION")
        self.is_template: bool = raw.get("is_template", True)
        self.version: str = raw.get("version", "0.0.0")
        self.equipment_catalog: list[str] = raw.get("equipment_catalog", [])
        self.rules: list[dict] = raw.get("rules", [])

    @property
    def is_configured(self) -> bool:
        """True only once a real fire-code standard has been loaded —
        i.e. someone has replaced the template and confirmed the region."""
        return not self.is_template and self.standard != "PENDING_CONFIRMATION"


def load_rules(path: Path) -> RuleSet:
    if not path.exists():
        logger.warning("Rules file not found at %s — running with zero rules.", path)
        return RuleSet({"standard": "PENDING_CONFIRMATION", "is_template": True, "rules": []})

    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)

    rule_set = RuleSet(raw)

    if rule_set.is_template:
        logger.warning(
            "Loaded TEMPLATE rules (standard=%s). No real fire-code values are "
            "active yet — every /recommend call will return zero equipment "
            "recommendations and compliance_score='RULES_NOT_CONFIGURED' until "
            "config/rules_template.json is replaced with the confirmed standard "
            "for this client's region.",
            rule_set.standard,
        )

    return rule_set
