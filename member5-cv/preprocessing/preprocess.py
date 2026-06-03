import cv2
import numpy as np

TARGET_SIZE = 640

def preprocess_from_bytes(img_bytes: bytes):
    nparr = np.frombuffer(img_bytes, np.uint8)

    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode image")

    img_resized = cv2.resize(img, (TARGET_SIZE, TARGET_SIZE))

    gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    thresh = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )

    processed = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)

    return processed
