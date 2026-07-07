const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Signup
const signup = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query(
            `INSERT INTO users (full_name, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, full_name, email, role, created_at`,
            [
                full_name,
                email,
                hashedPassword,
                role || "user"
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Get Profile
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, full_name, email, role, created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { full_name, email } = req.body;

        // Check if email is already used by another user
        const existingUser = await pool.query(
            `SELECT id FROM users
             WHERE email = $1 AND id != $2`,
            [email, req.user.id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const result = await pool.query(
            `UPDATE users
             SET full_name = $1,
                 email = $2
             WHERE id = $3
             RETURNING id, full_name, email, role, created_at`,
            [full_name, email, req.user.id]
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
    return res.status(400).json({
        message: "Current password and new password are required"
    });
}
        // Get current user
        const result = await pool.query(
            "SELECT password FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        // Verify current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, req.user.id]
        );

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword
};