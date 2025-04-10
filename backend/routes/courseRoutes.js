const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllCourses,
  getCourseById,
  getCoursesByProfessor,
  getCoursesByStudent,
  createCourse,
  updateCourse,
  deleteCourse,
  addStudentToCourse,
  removeStudentFromCourse
} = require("../controllers/courseController");


router.get("/", verifyToken, getAllCourses);
router.get("/:id", verifyToken, getCourseById);
router.get("/professor/:professorId", verifyToken, getCoursesByProfessor);

router.get("/student/:studentId", verifyToken, (req, res, next) => {
  if (req.user.id !== req.params.studentId) {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
}, getCoursesByStudent);


// for admin only
router.post("/", verifyToken, authorizeRoles(["admin"]), createCourse);
router.put("/:id", verifyToken, authorizeRoles(["admin"]), updateCourse);
router.post("/enroll", verifyToken, authorizeRoles(["admin"]), addStudentToCourse);
router.post("/unenroll", verifyToken, authorizeRoles(["admin"]), removeStudentFromCourse);
router.delete("/:id", verifyToken, authorizeRoles(["admin"]), deleteCourse);


module.exports = router;