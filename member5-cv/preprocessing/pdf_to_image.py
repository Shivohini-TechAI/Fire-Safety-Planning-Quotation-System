from pdf2image import convert_from_path
import os

# Input PDF
pdf_path = "member5-cv/data/raw/floorplan_001.pdf"

# Output folder
output_folder = "member5-cv/data/processed"

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Path to Poppler installed by Homebrew
poppler_path = "/opt/homebrew/bin"

# Convert PDF to images
images = convert_from_path(
    pdf_path,
    dpi=300,
    poppler_path=poppler_path
)

# Save each page
for i, image in enumerate(images):
    output_path = os.path.join(output_folder, f"floorplan_page_{i+1}.png")
    image.save(output_path, "PNG")
    print(f"Saved: {output_path}")

print("✅ Conversion completed!")