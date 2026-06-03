from ultralytics import YOLO

MODEL_PATH = "models/best.pt"

_model = None

def get_model():
    global _model

    if _model is None:
        _model = YOLO(MODEL_PATH)

    return _model

def run_inference(img, floor_number=1):

    model = get_model()

    results = model.predict(
        img,
        conf=0.5,
        verbose=False
    )

    detections = []

    for r in results:

        for i, box in enumerate(r.boxes):

            cls_id = int(box.cls[0])

            detections.append({
                "id": i + 1,
                "type": model.names[cls_id],
                "confidence": float(box.conf[0]),
                "floor": floor_number
            })

    return detections
