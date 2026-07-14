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

            # Bounding box coordinates (x1, y1, x2, y2)
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "id": i + 1,
                "type": model.names[cls_id],
                "confidence": float(box.conf[0]),
                "floor": floor_number,
                "bbox": [
                    int(x1),
                    int(y1),
                    int(x2),
                    int(y2)
                ]
            })

    return detections