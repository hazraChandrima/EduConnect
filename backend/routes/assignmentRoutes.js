const express = require("express");
const AssignmentSubmission = require("../models/AssignmentSubmission.js"); 
const Assignment = require("../models/Assignments.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();


router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { assignmentId, courseId, downloadUrl } = req.body;

    if (!assignmentId || !courseId || !downloadUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSubmission = new AssignmentSubmission({
      assignmentId,
      courseId,
      downloadUrl,
      uploader: req.user.id, // Provided by auth middleware
    });

    await newSubmission.save();

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("Firebase upload metadata save error:", error);
    res.status(500).json({ error: "Server error saving submission" });
  }
});

//for professors
router.post("/create", verifyToken, async (req, res) => {
  const { title, description, dueDate, courseId } = req.body;

  try {
    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      courseId,
      createdBy: req.user.id,
    });

    await newAssignment.save();
    console.log("Received data:", req.body);

    res.status(201).json({ message: "Assignment created!", assignment: newAssignment });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//for students
router.get("/all", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching all assignments:", error);
    res.status(500).json({ error: "Failed to fetch all assignments" });
  }
});

// GET: Assignments by course
router.get("/course/:courseId", verifyToken, async (req, res) => {
  const { courseId } = req.params;

  try {
    const assignments = await Assignment.find({ courseId });
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});




module.exports = router;
