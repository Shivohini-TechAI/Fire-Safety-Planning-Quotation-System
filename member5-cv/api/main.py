from fastapi import FastAPI, UploadFile, File
from preprocessing.preprocess import preprocess_from_bytes
from detection.inference import run_inference

app = FastAPI(
    title="Fire Safety CV API"
)

@app.get("/")
def home():
    return {"status": "running"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    img_bytes = await file.read()

    img = preprocess_from_bytes(img_bytes)

    detections = run_inference(img)

    return {
    "floor_plan_id": "FP001",
    "client_id": "CLIENT001",
    "building_type": "office",
    "total_floors": 1,
    "total_area_sqft": None,
    "spaces": [
        {
            "id": d["id"],
            "type": d["type"],
            "area_sqft": None,
            "length_ft": None,
            "width_ft": None,
            "floor": d["floor"],
            "confidence": d["confidence"]
        }
        for d in detections
    ]
}