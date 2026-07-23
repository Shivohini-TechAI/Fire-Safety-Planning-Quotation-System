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

/**
 * @swagger
 * /api/floors:
 *   post:
 *     summary: Create a new floor
 *     tags: [Floors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Floor created successfully
 */

router.post("/", authorizeRole("admin"), createFloor);

/**
 * @swagger
 * /api/floors:
 *   get:
 *     summary: Get all floors
 *     tags: [Floors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of floors
 */

router.get("/", getFloors);

/**
 * @swagger
 * /api/floors/{id}:
 *   get:
 *     summary: Get floor by ID
 *     tags: [Floors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Floor found
 *       404:
 *         description: Floor not found
 */

router.get("/:id", getFloorById);

/**
 * @swagger
 * /api/floors/{id}:
 *   put:
 *     summary: Update a floor
 *     tags: [Floors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Floor updated successfully
 */

router.put("/:id", authorizeRole("admin"), updateFloor);

/**
 * @swagger
 * /api/floors/{id}:
 *   delete:
 *     summary: Delete a floor
 *     tags: [Floors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Floor deleted successfully
 */

router.delete("/:id", authorizeRole("admin"), deleteFloor);

module.exports = router;