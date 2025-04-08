const express = require("express");
const router = express.Router();
const { verifyToken, isProfessor } = require("../middleware/authMiddleware.js");
const assignmentController = require("../controllers/assignmentControllers");


router.post("/submit", verifyToken, assignmentController.submitAssignment);
router.get("/", verifyToken, assignmentController.getAllAssignments);
router.get("/:id", verifyToken, assignmentController.getAssignmentById);
router.get("/course/:courseId", verifyToken, assignmentController.getAssignmentsByCourse);
router.get("/student/:studentId", verifyToken, assignmentController.getStudentAssignments);

// for professor only
router.post("/", verifyToken, isProfessor, assignmentController.createAssignment);
router.put("/:id", verifyToken, isProfessor, assignmentController.updateAssignment);
router.delete("/:id", verifyToken, isProfessor, assignmentController.deleteAssignment);
router.get("/:assignmentId/submissions", verifyToken, isProfessor, assignmentController.getAssignmentSubmissions);
router.post("/submissions/:submissionId/grade", verifyToken, isProfessor, assignmentController.gradeSubmission);


module.exports = router;