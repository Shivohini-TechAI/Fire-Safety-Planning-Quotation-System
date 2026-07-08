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

/**
 * @swagger
 * /api/buildings:
 *   post:
 *     summary: Create a new building
 *     tags: [Buildings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Building created successfully
 */

router.post("/", authorizeRole("admin"), createBuilding);

/**
 * @swagger
 * /api/buildings:
 *   get:
 *     summary: Get all buildings
 *     tags: [Buildings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of buildings
 */

router.get("/", getBuildings);

/**
 * @swagger
 * /api/buildings/{id}:
 *   get:
 *     summary: Get building by ID
 *     tags: [Buildings]
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
 *         description: Building found
 *       404:
 *         description: Building not found
 */

router.get("/:id", getBuildingById);

/**
 * @swagger
 * /api/buildings/{id}:
 *   put:
 *     summary: Update a building
 *     tags: [Buildings]
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
 *         description: Building updated successfully
 */

router.put("/:id", authorizeRole("admin"), updateBuilding);

/**
 * @swagger
 * /api/buildings/{id}:
 *   delete:
 *     summary: Delete a building
 *     tags: [Buildings]
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
 *         description: Building deleted successfully
 */

router.delete("/:id", authorizeRole("admin"), deleteBuilding);

module.exports = router;