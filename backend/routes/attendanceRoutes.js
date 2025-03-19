const express = require("express");
const { markAttendance, getAttendance } = require("../controllers/attendanceController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");  

const router = express.Router();

router.post("/mark", verifyToken, authorizeRoles(["professor"]), markAttendance);
router.get("/:studentId", verifyToken, authorizeRoles(["student", "professor", "admin"]), getAttendance);

module.exports = router;
