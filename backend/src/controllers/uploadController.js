const pool = require("../config/db");

// Upload Controller
const uploadFile = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Save uploaded file information in database
        const result = await pool.query(
            `INSERT INTO "UploadedPlan" ("fileName")
             VALUES ($1)
             RETURNING *`,
            [req.file.filename]
        );

        // Success response
        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            uploadedPlan: result.rows[0],
            file: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                filePath: req.file.path,
                fileSize: req.file.size,
                fileType: req.file.mimetype,
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadFile,
};