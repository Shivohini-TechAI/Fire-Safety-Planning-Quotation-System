const prisma = require("../config/prisma");

async function getUploadedPlans(req, res) {
  try {
    const uploadedPlans = await prisma.uploadedPlan.findMany({
      orderBy: {
        uploadedAt: "desc",
      },
    });

    res.json({
      success: true,
      data: uploadedPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch uploaded plans",
      error: error.message,
    });
  }
}

async function createUploadedPlan(req, res) {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "fileName is required",
      });
    }

    const uploadedPlan = await prisma.uploadedPlan.create({
      data: {
        fileName,
      },
    });

    res.status(201).json({
      success: true,
      data: uploadedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create uploaded plan",
      error: error.message,
    });
  }
}

module.exports = {
  createUploadedPlan,
  getUploadedPlans,
};
