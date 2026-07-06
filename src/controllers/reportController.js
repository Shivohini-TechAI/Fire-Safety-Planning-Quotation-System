const prisma = require("../config/prisma");

async function getReports(req, res) {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
}

async function createReport(req, res) {
  try {
    const { reportName, description, quotationId } = req.body;

    if (!reportName || typeof reportName !== "string" || reportName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "reportName is required",
      });
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "description is required",
      });
    }

    const normalizedQuotationId = quotationId ? Number(quotationId) : null;

    if (quotationId !== undefined && quotationId !== null && quotationId !== "" && !Number.isInteger(normalizedQuotationId)) {
      return res.status(400).json({
        success: false,
        message: "quotationId must be a valid integer",
      });
    }

    const report = await prisma.report.create({
      data: {
        reportName,
        description,
        ...(normalizedQuotationId
          ? {
              quotation: {
                connect: {
                  id: normalizedQuotationId,
                },
              },
            }
          : {}),
      },
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create report",
      error: error.message,
    });
  }
}

module.exports = {
  createReport,
  getReports,
};
