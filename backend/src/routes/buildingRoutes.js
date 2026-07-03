const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createBuilding,
    getBuildings,
    getBuildingById,
    updateBuilding,
    deleteBuilding
} = require("../controllers/buildingController");

router.use(verifyToken);

router.post("/", createBuilding);

router.get("/", getBuildings);

router.get("/:id", getBuildingById);

router.put("/:id", updateBuilding);

router.delete("/:id", deleteBuilding);

module.exports = router;