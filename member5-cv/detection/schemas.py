from pydantic import BaseModel
from typing import Optional

class BBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class SpaceDetection(BaseModel):
    id: int
    type: str
    confidence: float
    floor: int
    bbox: BBox

    area_sqft: Optional[float] = None
    length_ft: Optional[float] = None
    width_ft: Optional[float] = None

class FloorPlanResponse(BaseModel):
    floor_plan_id: str
    building_type: str
    total_floors: int
    spaces: list[SpaceDetection]
    total_area_sqft: float
