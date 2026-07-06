import cv2
import os

input_image = "member5-cv/data/processed/floorplan_page_1.png"
output_image = "member5-cv/data/processed/floorplan_clean.png"

image = cv2.imread(input_image)

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

blur = cv2.GaussianBlur(gray, (3,3), 0)

thresh = cv2.adaptiveThreshold(
    blur,
    255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY,
    11,
    2
)

cv2.imwrite(output_image, thresh)

print("✅ Clean image saved!")