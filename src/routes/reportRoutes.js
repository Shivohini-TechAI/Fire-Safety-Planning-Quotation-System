const express = require("express");
const {
  createReport,
  getReports,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", getReports);
router.post("/", createReport);

module.exports = router;
