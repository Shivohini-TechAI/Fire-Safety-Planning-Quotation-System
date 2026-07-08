"""
HTTP routes exposed to Member 3's Node.js backend.
"""
from fastapi import APIRouter

from app.core.area_calculator import calculate_summary
from app.core.deduplicator import deduplicate
from app.core.response_builder import build_response
from app.core.rule_engine import run_rule_engine
from app.core.rule_loader import load_rules
from app.core.validator import validate_spaces
from app.models.schemas import FloorPlanInput, RecommendationResponse, RulesInfo
from app.utils.logger import log_review_flags
from config.settings import settings

router = APIRouter()

# Loaded once at import time; POST /rules/reload refreshes it without a restart.
_rule_set = load_rules(settings.RULES_CONFIG_PATH)


def _rules_info() -> RulesInfo:
    return RulesInfo(
        standard=_rule_set.standard,
        is_template=_rule_set.is_template,
        version=_rule_set.version,
        equipment_catalog=_rule_set.equipment_catalog,
        rule_count=len(_rule_set.rules),
    )


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/rules", response_model=RulesInfo)
def get_rules():
    """Lets the frontend (or Member 3) show whether real rules are active
    or the engine is still running on the template."""
    return _rules_info()


@router.post("/rules/reload", response_model=RulesInfo)
def reload_rules():
    """Reload config/rules_template.json from disk without restarting the
    server — call this right after editing the rules file."""
    global _rule_set
    _rule_set = load_rules(settings.RULES_CONFIG_PATH)
    return _rules_info()


@router.post("/recommend", response_model=RecommendationResponse)
def recommend(floor_plan: FloorPlanInput):
    floor_plan_dict = floor_plan.model_dump()

    clean_spaces, review_flags = validate_spaces(floor_plan_dict)
    log_review_flags(floor_plan.client_id, floor_plan.floor_plan_id, review_flags)

    if not clean_spaces:
        return build_response(
            client_id=floor_plan.client_id,
            building_type=floor_plan.building_type,
            standard=_rule_set.standard,
            rules_configured=_rule_set.is_configured,
            equipment=[],
            review_flags=review_flags,
            skipped_rules=[],
        )

    building_summary = calculate_summary({**floor_plan_dict, "spaces": clean_spaces})
    raw_recs, skipped = run_rule_engine(clean_spaces, building_summary, _rule_set.rules)
    equipment = deduplicate(raw_recs)

    return build_response(
        client_id=floor_plan.client_id,
        building_type=floor_plan.building_type,
        standard=_rule_set.standard,
        rules_configured=_rule_set.is_configured,
        equipment=equipment,
        review_flags=review_flags,
        skipped_rules=skipped,
    )
