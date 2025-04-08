const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware.js");
const assignmentController = require("../controllers/assignmentController");


router.post("/submit", verifyToken, assignmentController.submitAssignment);
router.get("/", verifyToken, assignmentController.getAllAssignments);
router.get("/:id", verifyToken, assignmentController.getAssignmentById);
router.get("/course/:courseId", verifyToken, assignmentController.getAssignmentsByCourse);
router.get("/student/:studentId", verifyToken, assignmentController.getStudentAssignments);

// for professor only
router.post("/", verifyToken, authorizeRoles(["professor"]), assignmentController.createAssignment);
router.put("/:id", verifyToken, authorizeRoles(["professor"]), assignmentController.updateAssignment);
router.delete("/:id", verifyToken, authorizeRoles(["professor"]), assignmentController.deleteAssignment);
router.get("/:assignmentId/submissions", verifyToken, authorizeRoles(["professor"]), assignmentController.getAssignmentSubmissions);
router.post("/submissions/:submissionId/grade", verifyToken, authorizeRoles(["professor"]), assignmentController.gradeSubmission);


module.exports = router;