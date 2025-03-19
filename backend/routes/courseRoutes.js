const express = require("express");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware"); // ✅ Correct import
const Course = require("../models/Course");

const router = express.Router();

router.post("/", verifyToken, authorizeRoles(["professor", "admin"]), async (req, res) => {
  try {
    const { name } = req.body;
    const course = new Course({ name, professor: req.user.id });
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", verifyToken, authorizeRoles(["student", "professor", "admin"]), async (req, res) => {
  try {
    const courses = await Course.find().populate("professor", "name");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
