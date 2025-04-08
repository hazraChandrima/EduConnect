const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
    getRemarksByCourse,
    getRemarksByStudent,
    getRemarksByCourseAndStudent,
    addRemark,
    updateRemark,
    deleteRemark
} = require("../controllers/remarkController");


router.get("/course/:courseId", verifyToken, getRemarksByCourse);
router.get("/student/:studentId", verifyToken, getRemarksByStudent);
router.get("/course/:courseId/student/:studentId", verifyToken, getRemarksByCourseAndStudent);

// for professor only
router.post("/", verifyToken, authorizeRoles(["professor"]), addRemark);
router.put("/:id", verifyToken, authorizeRoles(["professor"]), updateRemark);
router.delete("/:id", verifyToken, authorizeRoles(["professor"]), deleteRemark);


module.exports = router;