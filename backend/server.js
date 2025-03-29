require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { connectDB } = require("./config/db.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(logger("dev"));


connectDB().then(() => {
    console.log("Database connection established. Loading routes...");

    const authRoutes = require("./routes/authRoutes");
    const userRoutes = require("./routes/userRoutes");
    const attendanceRoutes = require("./routes/attendanceRoutes");
    const assignmentRoutes = require("./routes/assignmentRoutes");
    const courseRoutes = require("./routes/courseRoutes");

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/attendance", attendanceRoutes);
    app.use("/api/courses", courseRoutes);
    app.use("/api/assignment", assignmentRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});