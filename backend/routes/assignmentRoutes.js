const express = require("express");
const { uploadAssignment, getAssignments } = require("../controllers/assignmentController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", verifyToken, authorizeRoles(["student"]), uploadAssignment);
router.get("/:studentId", verifyToken, authorizeRoles(["student", "professor"]), getAssignments);

module.exports = router;
