const Course = require("../models/Course");
const User = require("../models/User");



// fetch all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("professor", "name");
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// fetch course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("professor", "name email")
            .populate("students", "name email");

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.json(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// fetch courses by professor
exports.getCoursesByProfessor = async (req, res) => {
    try {
        const { professorId } = req.params;
        const courses = await Course.find({ professor: professorId });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching professor courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// fetch courses by student
exports.getCoursesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const courses = await Course.find({ students: studentId })
            .populate("professor", "name");
        res.json(courses);
    } catch (error) {
        console.error("Error fetching student courses:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// create new course
exports.createCourse = async (req, res) => {
    try {
        const { code, title, description, professorId, department, credits, color, icon } = req.body;

        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(400).json({ error: "Course code already exists" });
        }

        const professor = await User.findById(professorId);
        if (!professor || professor.role !== "professor") {
            return res.status(400).json({ error: "Invalid professor ID" });
        }

        const course = new Course({
            code,
            title,
            description,
            professor: professorId,
            department,
            credits,
            color,
            icon,
            students: []
        });

        await course.save();
        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// update a course
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const course = await Course.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json({ message: "Course updated successfully", course });

    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// delete course
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// add a student to course
exports.addStudentToCourse = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        if (course.students.includes(studentId)) {
            return res.status(400).json({ error: "Student already enrolled in this course" });
        }

        course.students.push(studentId);
        await course.save();
        res.json({ message: "Student added to course successfully", course });

    } catch (error) {
        console.error("Error adding student to course:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// remove a student from course
exports.removeStudentFromCourse = async (req, res) => {
    try {
        const { courseId, studentId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (!course.students.includes(studentId)) {
            return res.status(400).json({ error: "Student not enrolled in this course" });
        }

        course.students = course.students.filter(id => id.toString() !== studentId);
        await course.save();
        res.json({ message: "Student removed from course successfully", course });

    } catch (error) {
        console.error("Error removing student from course:", error);
        res.status(500).json({ error: "Server error" });
    }
};