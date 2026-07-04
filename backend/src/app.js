const express = require("express");
require("./config/db");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const floorRoutes = require("./routes/floorRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/floors", floorRoutes);
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});