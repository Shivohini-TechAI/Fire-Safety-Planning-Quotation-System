const express = require("express");

const router = express.Router();

console.log("authRoutes loaded");

const {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", verifyToken, getProfile);

router.put("/profile", verifyToken, updateProfile);

router.put("/change-password", verifyToken, changePassword);

// Admin Only Route
router.get("/admin", verifyToken, authorizeRole("admin"), (req, res) => {
    res.json({
        message: "Welcome Admin!",
        user: req.user
    });
});

// User Only Route
router.get("/user", verifyToken, authorizeRole("user"), (req, res) => {
    res.json({
        message: "Welcome User!",
        user: req.user
    });
});

module.exports = router;