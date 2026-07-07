const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/authorizeRole");

const {
    createBuilding,
    getBuildings,
    getBuildingById,
    updateBuilding,
    deleteBuilding
} = require("../controllers/buildingController");

router.use(verifyToken);

router.post("/", authorizeRole("admin"), createBuilding);

router.get("/", getBuildings);

router.get("/:id", getBuildingById);

router.put("/:id", authorizeRole("admin"), updateBuilding);

router.delete("/:id", authorizeRole("admin"), deleteBuilding);

module.exports = router;