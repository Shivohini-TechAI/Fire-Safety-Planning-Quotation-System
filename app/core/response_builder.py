"""
Builds the final, validated response object that Member 4's pricing
engine will consume. Keeping this in one place means the output contract
is decided exactly once, instead of being assembled ad-hoc in routes.py.
"""
from app.models.schemas import EquipmentRecommendation, RecommendationResponse, ReviewFlag


def build_response(
    client_id: str,
    building_type: str,
    standard: str,
    rules_configured: bool,
    equipment: list[dict],
    review_flags: list[dict],
    skipped_rules: list[str],
) -> RecommendationResponse:

    if not rules_configured:
        # Honest by design: we never want an empty equipment list to look
        # like a verified "fully compliant" result.
        compliance_score = "RULES_NOT_CONFIGURED"
    elif any(f["severity"] == "critical" for f in review_flags):
        compliance_score = "NOT_VALIDATED"
    elif review_flags:
        compliance_score = "MINOR_GAPS"
    else:
        compliance_score = "FULLY_COMPLIANT"

    return RecommendationResponse(
        client_id=client_id,
        building_type=building_type,
        compliance_standard=standard,
        rules_configured=rules_configured,
        equipment_recommendations=[EquipmentRecommendation(**e) for e in equipment],
        review_flags=[ReviewFlag(**f) for f in review_flags],
        skipped_rule_ids=skipped_rules,
        compliance_score=compliance_score,
    )
