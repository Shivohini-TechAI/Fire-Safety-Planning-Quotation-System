const express = require("express");
const {
  createUploadedPlan,
  getUploadedPlans,
} = require("../controllers/uploadedPlanController");

const router = express.Router();

router.get("/", getUploadedPlans);
router.post("/", createUploadedPlan);

module.exports = router;
