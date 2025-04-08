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
router.get("/student/:studentId", verifyToken, getCoursesByStudent);

// for professor or admin only
router.post("/", verifyToken, authorizeRoles(["professor", "admin"]), createCourse);
router.put("/:id", verifyToken, authorizeRoles(["professor", "admin"]), updateCourse);
router.post("/enroll", verifyToken, authorizeRoles(["professor", "admin"]), addStudentToCourse);
router.post("/unenroll", verifyToken, authorizeRoles(["professor", "admin"]), removeStudentFromCourse);

//for admin only
router.delete("/:id", verifyToken, authorizeRoles(["admin"]), deleteCourse);


module.exports = router;