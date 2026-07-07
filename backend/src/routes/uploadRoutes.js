const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { uploadFile } = require("../controllers/uploadController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

// Upload Route
router.post(
    "/",
    verifyToken,
    authorizeRole("admin"),
    upload.single("file"),
    uploadFile
);

module.exports = router;