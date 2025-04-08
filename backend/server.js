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

    console.log("Database connected!");
    console.log("Registering routes...");

    const authRoutes = require("./routes/authRoutes");
    const userRoutes = require("./routes/userRoutes");
    const courseRoutes = require("./routes/courseRoutes");
    const assignmentRoutes = require("./routes/assignmentRoutes");
    const attendanceRoutes = require("./routes/attendanceRoutes");
    const markRoutes = require("./routes/markRoutes");
    const curriculumRoutes = require("./routes/curriculumRoutes");
    const remarkRoutes = require("./routes/remarkRoutes");

    console.log("Routes Loaded: ", {
        authRoutes: !!authRoutes,
        userRoutes: !!userRoutes,
        courseRoutes: !!courseRoutes,
        assignmentRoutes: !!assignmentRoutes,
        attendanceRoutes: !!attendanceRoutes,
        markRoutes: !!markRoutes,
        curriculumRoutes: !!curriculumRoutes,
        remarkRoutes: !!remarkRoutes
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/courses", courseRoutes);
    app.use("/api/assignment", assignmentRoutes);
    app.use("/api/attendance", attendanceRoutes);
    app.use("/api/marks", markRoutes);
    app.use("/api/curriculum", curriculumRoutes);
    app.use("/api/remarks", remarkRoutes);

    console.log("All routes registered successfully!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    
}).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});