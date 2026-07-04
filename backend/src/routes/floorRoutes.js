const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createFloor,
    getFloors,
    getFloorById,
    updateFloor,
    deleteFloor
} = require("../controllers/floorController");

router.use(verifyToken);

router.post("/", createFloor);

router.get("/", getFloors);

router.get("/:id", getFloorById);

router.put("/:id", updateFloor);

router.delete("/:id", deleteFloor);

module.exports = router;