const express = require("express");

const router = express.Router();

const { signup, login } = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({
        message: "Profile accessed successfully",
        user: req.user
    });
});

module.exports = router;