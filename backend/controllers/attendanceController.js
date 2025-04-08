const Attendance = require("../models/Attendance");
const Course = require("../models/Course");
const User = require("../models/User");



// fetch attendance records by course
exports.getAttendanceByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const attendance = await Attendance.find({ courseId })
            .populate("studentId", "name email")
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        console.error("Error fetching course attendance:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// fetch attendance records by student
exports.getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const attendance = await Attendance.find({ studentId })
            .populate("courseId", "title code color")
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        console.error("Error fetching student attendance:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// get attendance records by course and student
exports.getAttendanceByCourseAndStudent = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const attendance = await Attendance.find({ courseId, studentId })
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// record attendance
exports.recordAttendance = async (req, res) => {
    try {
        const { courseId, date, attendanceData } = req.body;
        const professorId = req.user.id; 

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to record attendance for this course" });
        }

        const attendanceRecords = [];
        for (const [studentId, status] of Object.entries(attendanceData)) {
            const student = await User.findById(studentId);
            if (!student || student.role !== "student") {
                continue; // Skip invalid students
            }
            if (!course.students.includes(studentId)) {
                continue; 
            }

            const attendanceRecord = await Attendance.findOneAndUpdate(
                { courseId, studentId, date: new Date(date) },
                {
                    status,
                    recordedBy: professorId
                },
                { upsert: true, new: true }
            );

            attendanceRecords.push(attendanceRecord);
        }
        res.json({ message: "Attendance recorded successfully", attendanceRecords });

    } catch (error) {
        console.error("Error recording attendance:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// update attendance record
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const professorId = req.user.id; 
        const attendance = await Attendance.findById(id);
        if (!attendance) {
            return res.status(404).json({ error: "Attendance record not found" });
        }

        const course = await Course.findById(attendance.courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to update attendance for this course" });
        }

        attendance.status = status;
        await attendance.save();
        res.json({ message: "Attendance updated successfully", attendance });

    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// delete attendance record
exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const professorId = req.user.id; 

        const attendance = await Attendance.findById(id);
        if (!attendance) {
            return res.status(404).json({ error: "Attendance record not found" });
        }

        const course = await Course.findById(attendance.courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to delete attendance for this course" });
        }

        await Attendance.findByIdAndDelete(id);
        res.json({ message: "Attendance record deleted successfully" });

    } catch (error) {
        console.error("Error deleting attendance:", error);
        res.status(500).json({ error: "Server error" });
    }
};