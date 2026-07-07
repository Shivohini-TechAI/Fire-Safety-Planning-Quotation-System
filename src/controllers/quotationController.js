const PDFDocument = require("pdfkit");
const prisma = require("../config/prisma");
const { calculateQuotation } = require("../services/pricingService");
const { parseBreakdownFromDescription, writeQuotationPdf } = require("../services/pdfService");
const { buildReportDescription } = require("../services/reportService");
const { parseIdParam, validateItems } = require("../utils/validation");

async function calculateQuotationPreview(req, res) {
  try {
    const { projectName, items } = req.body;

    if (!projectName || typeof projectName !== "string" || projectName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "projectName is required",
      });
    }

    const validationError = validateItems(items);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const quotation = await calculateQuotation(items);

    res.json({
      success: true,
      data: {
        projectName,
        ...quotation,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function createQuotation(req, res) {
  try {
    const { projectName, items } = req.body;

    if (!projectName || typeof projectName !== "string" || projectName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "projectName is required",
      });
    }

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
        breakdown: totals.breakdown,
      },
    });

    const report = await prisma.report.create({
      data: {
        reportName: `Quotation Report - ${projectName}`,
        description: buildReportDescription({
          ...quotation,
          breakdown: totals.breakdown,
        }),
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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getQuotations(req, res) {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: quotations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quotations",
      error: error.message,
    });
  }
}

async function getQuotationById(req, res) {
  try {
    const quotationId = parseIdParam(req.params.id);

    if (!quotationId) {
      return res.status(400).json({
        success: false,
        message: "Valid quotation id is required",
      });
    }

    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    res.json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quotation",
      error: error.message,
    });
  }
}

async function downloadQuotationPdf(req, res) {
  try {
    const quotationId = parseIdParam(req.params.id);

    if (!quotationId) {
      return res.status(400).json({
        success: false,
        message: "Valid quotation id is required",
      });
    }

    const quotation = await prisma.quotation.findUnique({
      where: {
        id: quotationId,
      },
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    const downloadTimestamp = Date.now();

    const report = await prisma.report.findFirst({
      where: {
        quotationId,
      },
    });

    const breakdown = Array.isArray(quotation.breakdown) && quotation.breakdown.length > 0
      ? quotation.breakdown
      : report?.description
        ? parseBreakdownFromDescription(report.description)
        : [];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=quotation-${quotation.id}-${downloadTimestamp}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    writeQuotationPdf(doc, {
      ...quotation,
      breakdown,
    });
    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
}

module.exports = {
  calculateQuotationPreview,
  createQuotation,
  downloadQuotationPdf,
  getQuotationById,
  getQuotations,
};
