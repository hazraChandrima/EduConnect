const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
    getMarksByCourse,
    getMarksByStudent,
    getMarksByCourseAndStudent,
    addMark,
    updateMark,
    deleteMark
} = require("../controllers/markController");


router.get("/course/:courseId", verifyToken, getMarksByCourse);
router.get("/student/:studentId", verifyToken, getMarksByStudent);
router.get("/course/:courseId/student/:studentId", verifyToken, getMarksByCourseAndStudent);

// for professor only
router.post("/", verifyToken, authorizeRoles(["professor"]), addMark);
router.put("/:id", verifyToken, authorizeRoles(["professor"]), updateMark);
router.delete("/:id", verifyToken, authorizeRoles(["professor"]), deleteMark);


module.exports = router;