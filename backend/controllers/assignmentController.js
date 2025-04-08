const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const AssignmentSubmission = require("../models/AssignmentSubmission");



// fetch all assignments
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate("courseId", "title code color");
        res.json(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// fetch assignment by ID
exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("courseId", "title code color");

        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        res.json(assignment);
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// fetch assignments by course
exports.getAssignmentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await Assignment.find({ courseId });
        res.json(assignments);
    } catch (error) {
        console.error("Error fetching course assignments:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// fetch assignments for student
exports.getAssignmentsForStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find all courses the student is enrolled in
        const courses = await Course.find({ students: studentId });
        const courseIds = courses.map(course => course._id);

        // Find all assignments for these courses
        const assignments = await Assignment.find({ courseId: { $in: courseIds } })
            .populate("courseId", "title code color");

        // For each assignment, check if the student has submitted it
        const assignmentsWithStatus = await Promise.all(assignments.map(async (assignment) => {
            const submission = await AssignmentSubmission.findOne({
                assignmentId: assignment._id,
                uploader: studentId
            });

            let status = 'pending';
            if (submission) {
                status = submission.status;
            } else if (new Date(assignment.dueDate) < new Date()) {
                status = 'late';
            }

            return {
                ...assignment.toObject(),
                status
            };
        }));

        res.json(assignmentsWithStatus);
    } catch (error) {
        console.error("Error fetching student assignments:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// create new assignment
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, courseId, dueDate } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const assignment = new Assignment({
            title,
            description,
            courseId,
            dueDate
        });

        await assignment.save();
        res.status(201).json({ message: "Assignment created successfully", assignment });

    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// update assignment
exports.updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const assignment = await Assignment.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        res.json({ message: "Assignment updated successfully", assignment });
    } catch (error) {
        console.error("Error updating assignment:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// delete assignment
exports.deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await Assignment.findByIdAndDelete(id);

        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        await AssignmentSubmission.deleteMany({ assignmentId: id });

        res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// submit assignment
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId, courseId, downloadUrl } = req.body;
        const userId = req.user.id; 
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        const existingSubmission = await AssignmentSubmission.findOne({
            assignmentId,
            uploader: userId
        });

        if (existingSubmission) {
            return res.status(400).json({ error: "You have already submitted this assignment" });
        }

        const submission = new AssignmentSubmission({
            assignmentId,
            courseId,
            downloadUrl,
            uploader: userId
        });

        await submission.save();
        res.status(201).json({ message: "Assignment submitted successfully", submission });
    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// get submissions for assignment
exports.getSubmissionsForAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const submissions = await AssignmentSubmission.find({ assignmentId })
            .populate("uploader", "name email");

        res.json(submissions);
    } catch (error) {
        console.error("Error fetching assignment submissions:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// grade a submission
exports.gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;

        const submission = await AssignmentSubmission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'graded';

        await submission.save();
        res.json({ message: "Submission graded successfully", submission });
    } catch (error) {
        console.error("Error grading submission:", error);
        res.status(500).json({ error: "Server error" });
    }
};