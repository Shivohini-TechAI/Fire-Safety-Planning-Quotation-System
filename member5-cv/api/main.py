from pathlib import Path
from dotenv import load_dotenv

# Load .env BEFORE importing rule_engine_client
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI, UploadFile, File
from preprocessing.preprocess import preprocess_from_bytes
from detection.inference import run_inference
from api.rule_engine_client import (
    build_floor_plan_payload,
    send_to_rule_engine,
)

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

    payload = build_floor_plan_payload(
        detections=detections,
        floor_plan_id="FP001",
        client_id="CLIENT001",
        building_type="office",
        total_floors=1,
        total_area_sqft=None,
    )

    print("Payload being sent:")
    print(payload)

    recommendation = send_to_rule_engine(payload)

    print("Recommendation received:")
    print(recommendation)

    return recommendation