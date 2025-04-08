const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
    getAttendanceByCourse,
    getAttendanceByStudent,
    getAttendanceByCourseAndStudent,
    recordAttendance,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");


router.get("/course/:courseId", verifyToken, getAttendanceByCourse);
router.get("/student/:studentId", verifyToken, getAttendanceByStudent);
router.get("/course/:courseId/student/:studentId", verifyToken, getAttendanceByCourseAndStudent);
router.post("/record", verifyToken, authorizeRoles(["professor"]), recordAttendance);

// for professor only
router.put("/:id", verifyToken, authorizeRoles(["professor"]), updateAttendance);
router.delete("/:id", verifyToken, authorizeRoles(["professor"]), deleteAttendance);


module.exports = router;