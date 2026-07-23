const pool = require("../config/db");

// Create Floor
const createFloor = async (req, res) => {
    try {

        const {
            building_id,
            floor_name,
            floor_number,
            area,
            occupancy_type
        } = req.body;

        const result = await pool.query(
            `INSERT INTO floors
            (building_id, floor_name, floor_number, area, occupancy_type)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                building_id,
                floor_name,
                floor_number,
                area,
                occupancy_type
            ]
        );

        res.status(201).json({
            message: "Floor created successfully",
            floor: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Floors
const getFloors = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM floors ORDER BY id ASC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Floor By ID
const getFloorById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM floors WHERE id=$1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Floor not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Floor
const updateFloor = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            floor_name,
            floor_number,
            area,
            occupancy_type
        } = req.body;

        const result = await pool.query(
            `UPDATE floors
             SET floor_name=$1,
                 floor_number=$2,
                 area=$3,
                 occupancy_type=$4
             WHERE id=$5
             RETURNING *`,
            [
                floor_name,
                floor_number,
                area,
                occupancy_type,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Floor not found"
            });
        }

        res.status(200).json({
            message: "Floor updated successfully",
            floor: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Floor
const deleteFloor = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM floors WHERE id=$1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Floor not found"
            });
        }

        res.status(200).json({
            message: "Floor deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createFloor,
    getFloors,
    getFloorById,
    updateFloor,
    deleteFloor
};