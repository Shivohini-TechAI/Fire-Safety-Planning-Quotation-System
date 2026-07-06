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
    const { reportName, description } = req.body;

    if (!reportName || !description) {
      return res.status(400).json({
        success: false,
        message: "reportName and description are required",
      });
    }

    const report = await prisma.report.create({
      data: {
        reportName,
        description,
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
