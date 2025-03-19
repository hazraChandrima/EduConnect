const Attendance = require("../models/Attendance");

const markAttendance = async (req, res) => {
    try {
        const { studentId, date, status } = req.body;
        const attendance = new Attendance({ studentId, date, status });
        await attendance.save();
        res.status(201).json({ message: "Attendance marked successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error marking attendance." });
    }
};

const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ studentId: req.params.studentId });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance records." });
    }
};

module.exports = { markAttendance, getAttendance };
