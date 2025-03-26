require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { connectDB } = require("./config/db.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(logger("dev"));

// Connect to Database BEFORE starting the server
connectDB().then(() => {
  console.log("✅ Database connection established. Loading routes...");

  // Import Routes (AFTER database is connected)
  const authRoutes = require("./routes/authRoutes");
  const userRoutes = require("./routes/userRoutes");
  const attendanceRoutes = require("./routes/attendanceRoutes");
  const assignmentRoutes = require("./routes/assignmentRoutes");
  const courseRoutes = require("./routes/courseRoutes");

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/assignment", assignmentRoutes);

  // Start Server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
