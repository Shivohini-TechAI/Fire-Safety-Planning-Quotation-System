const express = require("express");
require("./config/db");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});