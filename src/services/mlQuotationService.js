const DETECTION_TO_EQUIPMENT = {
  smoke_detector: "Smoke Detector",
  fire_extinguisher: "Fire Extinguisher",
  sprinkler: "Sprinkler System",
  alarm: "Alarm System",
  hose_reel: "Hose Reel",
};

function buildRecommendedEquipmentItems(payload = {}) {
  if (Array.isArray(payload.recommendedEquipment) && payload.recommendedEquipment.length > 0) {
    return payload.recommendedEquipment.map((item) => ({
      equipmentName: item.equipmentName,
      quantity: Number(item.quantity || 1),
    }));
  }

  const detections = Array.isArray(payload.detections) ? payload.detections : [];

  const counts = new Map();

  detections.forEach((detection) => {
    const equipmentName = DETECTION_TO_EQUIPMENT[String(detection?.type || "").toLowerCase()];

    if (!equipmentName) {
      return;
    }

    counts.set(equipmentName, (counts.get(equipmentName) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([equipmentName, quantity]) => ({
    equipmentName,
    quantity,
  }));
}

module.exports = {
  buildRecommendedEquipmentItems,
};
