const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/authorizeRole");

const {
    createFloor,
    getFloors,
    getFloorById,
    updateFloor,
    deleteFloor
} = require("../controllers/floorController");

router.use(verifyToken);

router.post("/", authorizeRole("admin"), createFloor);

router.get("/", getFloors);

router.get("/:id", getFloorById);

router.put("/:id", authorizeRole("admin"), updateFloor);

router.delete("/:id", authorizeRole("admin"), deleteFloor);

module.exports = router;