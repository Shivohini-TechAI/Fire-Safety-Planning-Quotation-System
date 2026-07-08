"""
Pydantic schemas — the strict contract between:

    Member 5 (Computer Vision)  -->  FloorPlanInput
    This service                 -->  RecommendationResponse
    Member 4 (Pricing Engine)   <--  RecommendationResponse

Keeping every field explicit here means Member 5 and Member 4 can both
build against this file without needing to read the rest of the codebase.
"""
from typing import Optional

from pydantic import BaseModel, Field


class Space(BaseModel):
    """One detected room/door/staircase/etc. from Member 5's CV pipeline."""

    id: int
    type: str  # e.g. "room", "hallway", "staircase", "exit", "door", "toilet"
    area_sqft: Optional[float] = None
    length_ft: Optional[float] = None
    width_ft: Optional[float] = None
    floor: Optional[int] = None
    confidence: Optional[float] = Field(default=None, ge=0, le=1)


class FloorPlanInput(BaseModel):
    """The full payload Member 5's API sends for one client's floor plan."""

    floor_plan_id: str
    client_id: str
    building_type: str  # "school" | "flat" | "house" | "office" | ... (free text, not an enum on purpose)
    total_floors: int
    spaces: list[Space]
    total_area_sqft: Optional[float] = None


class EquipmentRecommendation(BaseModel):
    item: str
    qty: int
    zone: str
    rule_refs: list[str] = []


class ReviewFlag(BaseModel):
    space_id: Optional[int] = None
    reason: str
    severity: str  # "low" | "medium" | "high" | "critical"


class RecommendationResponse(BaseModel):
    """What Member 4's pricing engine receives."""

    client_id: str
    building_type: str
    compliance_standard: str
    rules_configured: bool
    equipment_recommendations: list[EquipmentRecommendation]
    review_flags: list[ReviewFlag]
    skipped_rule_ids: list[str] = []
    compliance_score: str  # RULES_NOT_CONFIGURED | NOT_VALIDATED | MINOR_GAPS | FULLY_COMPLIANT


class RulesInfo(BaseModel):
    """Lightweight summary returned by GET /rules — lets the frontend show
    whether real rules are active or it's still running on the template."""

    standard: str
    is_template: bool
    version: str
    equipment_catalog: list[str]
    rule_count: int
