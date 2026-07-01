const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                name,
                email,
                password: hashedPassword
            }
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