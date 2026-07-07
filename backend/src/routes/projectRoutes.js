const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizeRole = require("../middleware/authorizeRole");

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

router.use(verifyToken);

router.post("/", authorizeRole("admin"), createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.put("/:id", authorizeRole("admin"), updateProject);

router.delete("/:id", authorizeRole("admin"), deleteProject);

module.exports = router;