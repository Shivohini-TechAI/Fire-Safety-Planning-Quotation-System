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
        "status": "success",
        "detections": detections
    }
