// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const {connectDB} = require('./config/db');
// const bodyParser = require("body-parser");
// const logger = require("morgan");


// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const attendanceRoutes = require("./routes/attendanceRoutes");
// const assignmentRoutes = require("./routes/assignmentRoutes");
// const courseRoutes = require("./routes/courseRoutes");


// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());
// app.use(logger("dev"));


// try{
//     connectDB();

//     // Routes
//     app.use("/api/auth", authRoutes);
//     app.use("/api/user", userRoutes);
//     app.use("/api/attendance", attendanceRoutes);
//     app.use("/api/courses", courseRoutes);
//     app.use("/api/assignment", assignmentRoutes);

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// } catch(err) {
//     console.error("Failed to start server:", err);
//     process.exit(1);    
// }



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
    const attendanceRoutes = require("./routes/attendanceRoutes");
    const assignmentRoutes = require("./routes/assignmentRoutes");
    const courseRoutes = require("./routes/courseRoutes");

    console.log("Routes Loaded: ", {
        authRoutes: !!authRoutes,
        userRoutes: !!userRoutes,
        attendanceRoutes: !!attendanceRoutes,
        assignmentRoutes: !!assignmentRoutes,
        courseRoutes: !!courseRoutes
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/attendance", attendanceRoutes);
    app.use("/api/courses", courseRoutes);
    app.use("/api/assignment", assignmentRoutes);

    console.log("All routes registered successfully!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
