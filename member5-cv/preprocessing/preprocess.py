import cv2
import numpy as np


def preprocess_from_bytes(img_bytes):
    """
    Convert uploaded image bytes into an OpenCV image.
    """

    nparr = np.frombuffer(img_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Could not decode uploaded image.")

    return image