const pool = require("../config/db");

// Create Building
const createBuilding = async (req, res) => {
    try {
        const {
            project_id,
            building_name,
            building_type,
            total_area,
            number_of_floors,
            risk_level
        } = req.body;

        const result = await pool.query(
            `INSERT INTO buildings
            (project_id, building_name, building_type, total_area, number_of_floors, risk_level)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                project_id,
                building_name,
                building_type,
                total_area,
                number_of_floors,
                risk_level
            ]
        );

        res.status(201).json({
            message: "Building created successfully",
            building: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Buildings
const getBuildings = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM buildings ORDER BY id ASC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Building By ID
const getBuildingById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM buildings WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Building not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Building
const updateBuilding = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            building_name,
            building_type,
            total_area,
            number_of_floors,
            risk_level
        } = req.body;

        const result = await pool.query(
            `UPDATE buildings
             SET building_name=$1,
                 building_type=$2,
                 total_area=$3,
                 number_of_floors=$4,
                 risk_level=$5
             WHERE id=$6
             RETURNING *`,
            [
                building_name,
                building_type,
                total_area,
                number_of_floors,
                risk_level,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Building not found"
            });
        }

        res.status(200).json({
            message: "Building updated successfully",
            building: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Building
const deleteBuilding = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM buildings WHERE id=$1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Building not found"
            });
        }

        res.status(200).json({
            message: "Building deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createBuilding,
    getBuildings,
    getBuildingById,
    updateBuilding,
    deleteBuilding
};