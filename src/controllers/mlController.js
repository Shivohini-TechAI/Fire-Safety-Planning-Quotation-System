const prisma = require("../config/prisma");
const { calculateQuotation } = require("../services/pricingService");
const { buildReportDescription } = require("../services/reportService");
const { validateItems } = require("../utils/validation");

async function processMlResult(req, res) {
  try {
    const { projectName, recommendedEquipment } = req.body;

    if (!projectName || typeof projectName !== "string" || projectName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "projectName is required",
      });
    }

    if (
      !Array.isArray(recommendedEquipment) ||
      recommendedEquipment.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "recommendedEquipment must be a non-empty array",
      });
    }

    const hasValidItems = recommendedEquipment.every((item) => item && typeof item === "object" && typeof item.equipmentName === "string" && item.equipmentName.trim() !== "" && Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0);

    if (!hasValidItems) {
      return res.status(400).json({
        success: false,
        message: "Each recommended equipment item must have a valid equipmentName and positive quantity",
      });
    }

    const equipmentNames = recommendedEquipment.map((item) => item.equipmentName);

    const equipmentList = await prisma.equipment.findMany({
      where: {
        name: {
          in: equipmentNames,
        },
      },
    });

    if (equipmentList.length !== equipmentNames.length) {
      const foundNames = new Set(equipmentList.map((equipment) => equipment.name));
      const missingNames = equipmentNames.filter((name) => !foundNames.has(name));

      return res.status(400).json({
        success: false,
        message: `Equipment not found: ${missingNames.join(", ")}`,
      });
    }

    const items = recommendedEquipment.map((item) => {
      const equipment = equipmentList.find(
        (entry) => entry.name === item.equipmentName
      );

      return {
        equipmentId: equipment.id,
        quantity: Number(item.quantity),
      };
    });

    const validationError = validateItems(items);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const totals = await calculateQuotation(items);

    const quotation = await prisma.quotation.create({
      data: {
        projectName,
        equipmentCost: totals.equipmentCost,
        installationCost: totals.installationCost,
        gst: totals.gst,
        maintenanceCost: totals.maintenanceCost,
        totalCost: totals.totalCost,
      },
    });

    const report = await prisma.report.create({
      data: {
        reportName: `ML Fire Safety Report - ${projectName}`,
        description: buildReportDescription(quotation),
        quotation: {
          connect: {
            id: quotation.id,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        quotation,
        report,
        breakdown: totals.breakdown,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process ML result",
      error: error.message,
    });
  }
}

module.exports = {
  processMlResult,
};
