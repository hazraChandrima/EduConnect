const ProfessorRemark = require("../models/ProfessorRemark");
const Course = require("../models/Course");
const User = require("../models/User");



// get remarks by course
exports.getRemarksByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const remarks = await ProfessorRemark.find({ courseId })
            .populate("studentId", "name email")
            .populate("professorId", "name email");

        res.json(remarks);
    } catch (error) {
        console.error("Error fetching course remarks:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// get remarks by student
exports.getRemarksByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const remarks = await ProfessorRemark.find({ studentId })
            .populate("courseId", "title code color")
            .populate("professorId", "name email");

        res.json(remarks);
    } catch (error) {
        console.error("Error fetching student remarks:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// get remarks by course and student
exports.getRemarksByCourseAndStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const remarks = await ProfessorRemark.find({ courseId, studentId })
            .populate("professorId", "name email");

        res.json(remarks);
    } catch (error) {
        console.error("Error fetching remarks:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// add remark
exports.addRemark = async (req, res) => {
    try {
        const { courseId, studentId, remark, type } = req.body;
        const professorId = req.user.id; 

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to add remarks for this course" });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        if (!course.students.includes(studentId)) {
            return res.status(400).json({ error: "Student not enrolled in this course" });
        }

        const newRemark = new ProfessorRemark({
            courseId,
            studentId,
            professorId,
            remark,
            type
        });

        await newRemark.save();
        res.status(201).json({ message: "Remark added successfully", remark: newRemark });

    } catch (error) {
        console.error("Error adding remark:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// update remark
exports.updateRemark = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const professorId = req.user.id; 

        const remark = await ProfessorRemark.findById(id);
        if (!remark) {
            return res.status(404).json({ error: "Remark not found" });
        }

        if (remark.professorId.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to update this remark" });
        }

        Object.assign(remark, updates);
        await remark.save();
        res.json({ message: "Remark updated successfully", remark });

    } catch (error) {
        console.error("Error updating remark:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// delete remark
exports.deleteRemark = async (req, res) => {
    try {
        const { id } = req.params;
        const professorId = req.user.id; 

        const remark = await ProfessorRemark.findById(id);
        if (!remark) {
            return res.status(404).json({ error: "Remark not found" });
        }

        if (remark.professorId.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to delete this remark" });
        }

        await ProfessorRemark.findByIdAndDelete(id);
        res.json({ message: "Remark deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting remark:", error);
        res.status(500).json({ error: "Server error" });
    }
};