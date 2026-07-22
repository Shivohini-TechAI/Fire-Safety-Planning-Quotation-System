const pool = require("../config/db");

// Create Project
const createProject = async (req, res) => {
    try {
        const {
            project_name,
            client_name,
            building_name,
            location,
            description,
            status,
            user_id
        } = req.body;
        
        // Validate required fields
if (
    !project_name ||
    !client_name ||
    !building_name ||
    !user_id
) {
    return res.status(400).json({
        message: "Project name, client name, building name and user ID are required"
    });
}

        const query = `
            INSERT INTO projects
            (project_name, client_name, building_name, location, description, status, user_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *;
        `;

        const values = [
            project_name,
            client_name,
            building_name,
            location,
            description,
            status,
            user_id
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Project created successfully",
            project: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Projects
const getProjects = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Get Project By ID
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM projects WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
  // Update Project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            project_name,
            client_name,
            building_name,
            location,
            description,
            status
        } = req.body;

        // Validate required fields
if (
    !project_name ||
    !client_name ||
    !building_name
) {
    return res.status(400).json({
        message: "Project name, client name and building name are required"
    });
}

        const query = `
            UPDATE projects
            SET
                project_name = $1,
                client_name = $2,
                building_name = $3,
                location = $4,
                description = $5,
                status = $6
            WHERE id = $7
            RETURNING *;
        `;

        const values = [
            project_name,
            client_name,
            building_name,
            location,
            description,
            status,
            id
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project updated successfully",
            project: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
 // Delete Project
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};