const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at;
        `;

        const values = [name, email, hashedPassword];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const login = async (req, res) => {
    try {
        const { email } = req.body;

        const storedEmail = "gokul@gmail.com";

        if (email !== storedEmail) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        const token = jwt.sign(
            { email: storedEmail },
            "mysecretkey",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { signup, login };