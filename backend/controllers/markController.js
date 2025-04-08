const Mark = require("../models/Mark");
const Course = require("../models/Course");
const User = require("../models/User");



// fetch marks by course
exports.getMarksByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const marks = await Mark.find({ courseId })
            .populate("studentId", "name email");

        res.json(marks);
    } catch (error) {
        console.error("Error fetching course marks:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// get marks by student
exports.getMarksByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const marks = await Mark.find({ studentId })
            .populate("courseId", "title code color");

        res.json(marks);
    } catch (error) {
        console.error("Error fetching student marks:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// get marks by course and student
exports.getMarksByCourseAndStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const marks = await Mark.find({ courseId, studentId });

        res.json(marks);
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// add mark
exports.addMark = async (req, res) => {
    try {
        const { courseId, studentId, title, score, maxScore, type, feedback } = req.body;
        const professorId = req.user.id; 

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to add marks for this course" });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        if (!course.students.includes(studentId)) {
            return res.status(400).json({ error: "Student not enrolled in this course" });
        }

        const mark = new Mark({
            courseId,
            studentId,
            title,
            score,
            maxScore,
            type,
            feedback
        });

        await mark.save();
        res.status(201).json({ message: "Mark added successfully", mark });

    } catch (error) {
        console.error("Error adding mark:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// update mark
exports.updateMark = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const professorId = req.user.id; 

        const mark = await Mark.findById(id);
        if (!mark) {
            return res.status(404).json({ error: "Mark not found" });
        }

        const course = await Course.findById(mark.courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to update marks for this course" });
        }

        Object.assign(mark, updates);
        await mark.save();

        res.json({ message: "Mark updated successfully", mark });
    } catch (error) {
        console.error("Error updating mark:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// delete mark
exports.deleteMark = async (req, res) => {
    try {
        const { id } = req.params;
        const professorId = req.user.id; 
        const mark = await Mark.findById(id);
        if (!mark) {
            return res.status(404).json({ error: "Mark not found" });
        }

        const course = await Course.findById(mark.courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to delete marks for this course" });
        }

        await Mark.findByIdAndDelete(id);

        res.json({ message: "Mark deleted successfully" });
    } catch (error) {
        console.error("Error deleting mark:", error);
        res.status(500).json({ error: "Server error" });
    }
};