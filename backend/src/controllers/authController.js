const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");

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

        // Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Check if user exists
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User with this email does not exist"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Token expires in 15 minutes
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        // Save token and expiry
        await pool.query(
            `UPDATE users
             SET reset_token = $1,
                 reset_token_expiry = $2
             WHERE email = $3`,
            [resetToken, expiry, email]
        );

        // Reset link
        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Email body
        const html = `
            <h2>Password Reset</h2>

            <p>Hello,</p>

            <p>You requested to reset your password.</p>

            <p>
                <a href="${resetUrl}">
                    Click here to reset your password
                </a>
            </p>

            <p>This link expires in 15 minutes.</p>

            <p>If you didn't request this, ignore this email.</p>
        `;

        await sendEmail(
            email,
            "Password Reset",
            html
        );

        res.status(200).json({
            message: "Password reset email sent successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

        // Reset Password
const resetPassword = async (req, res) => {
    try {

        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: "Token and new password are required"
            });
        }

        // Find user using reset token
        const result = await pool.query(
            `SELECT * FROM users
             WHERE reset_token = $1`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid reset token"
            });
        }

        const user = result.rows[0];

        // Check token expiry
        if (new Date() > user.reset_token_expiry) {
            return res.status(400).json({
                message: "Reset token has expired"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear token
        await pool.query(
            `UPDATE users
             SET password = $1,
                 reset_token = NULL,
                 reset_token_expiry = NULL
             WHERE id = $2`,
            [hashedPassword, user.id]
        );

        res.status(200).json({
            message: "Password reset successfully"
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
    changePassword,
    forgotPassword,
    resetPassword
};