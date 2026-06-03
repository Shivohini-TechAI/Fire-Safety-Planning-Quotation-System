from ultralytics import YOLO

def evaluate():

    model = YOLO("models/best.pt")

    results = model.val()

    print(results)

if __name__ == "__main__":
    evaluate()
