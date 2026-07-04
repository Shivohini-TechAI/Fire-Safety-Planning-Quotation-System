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

        // Send success response
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                filePath: req.file.path,
                fileSize: req.file.size,
                fileType: req.file.mimetype,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadFile,
};