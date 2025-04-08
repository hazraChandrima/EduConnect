const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const User = require("../models/User");
const Course = require("../models/Course");



// submit an assignment
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId, courseId, downloadUrl } = req.body;
        if (!assignmentId || !courseId || !downloadUrl) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newSubmission = new AssignmentSubmission({
            assignmentId,
            courseId,
            downloadUrl,
            uploader: req.user.id,
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
};



// get all assignments
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
};



// get assignment by ID
exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }
        res.status(200).json(assignment);
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ error: "Failed to fetch assignment" });
    }
};




// get assignments by course
exports.getAssignmentsByCourse = async (req, res) => {
    try {
        const assignments = await Assignment.find({ courseId: req.params.courseId });
        res.status(200).json(assignments);
    } catch (error) {
        console.error("Error fetching course assignments:", error);
        res.status(500).json({ error: "Failed to fetch course assignments" });
    }
};




// get assignments for a student
exports.getStudentAssignments = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const courses = await Course.find({ 'students': studentId });
        const courseIds = courses.map(course => course._id);
        const assignments = await Assignment.find({ courseId: { $in: courseIds } });

        const assignmentsWithStatus = await Promise.all(assignments.map(async (assignment) => {
            const submission = await AssignmentSubmission.findOne({
                assignmentId: assignment._id,
                uploader: studentId
            });

            const course = courses.find(c => c._id.toString() === assignment.courseId.toString());

            return {
                ...assignment.toObject(),
                status: submission ? submission.status : 'pending',
                courseCode: course ? course.code : '',
                color: course ? course.color : '#5c51f3'
            };
        }));

        res.status(200).json(assignmentsWithStatus);
    } catch (error) {
        console.error("Error fetching student assignments:", error);
        res.status(500).json({ error: "Failed to fetch student assignments" });
    }
};




// create a new assignment
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, courseId, dueDate } = req.body;
        if (!title || !description || !courseId || !dueDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const newAssignment = new Assignment({
            title,
            description,
            courseId,
            dueDate,
        });

        await newAssignment.save();
        res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });

    } catch (error) {
        console.error("Error creating assignment:", error);
        res.status(500).json({ error: "Failed to create assignment" });
    }
};




// update an assignment
exports.updateAssignment = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate },
            { new: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }
        res.status(200).json({ message: "Assignment updated successfully", assignment: updatedAssignment });

    } catch (error) {
        console.error("Error updating assignment:", error);
        res.status(500).json({ error: "Failed to update assignment" });
    }
};




// delete an assignment
exports.deleteAssignment = async (req, res) => {
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);

        if (!deletedAssignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        await AssignmentSubmission.deleteMany({ assignmentId: req.params.id });
        res.status(200).json({ message: "Assignment deleted successfully" });

    } catch (error) {
        console.error("Error deleting assignment:", error);
        res.status(500).json({ error: "Failed to delete assignment" });
    }
};




// get submissions for an assignment
exports.getAssignmentSubmissions = async (req, res) => {
    try {
        const submissions = await AssignmentSubmission.find({ assignmentId: req.params.assignmentId })
            .populate('uploader', 'name email'); 

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
};




// grade a submission
exports.gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;

        if (grade === undefined || grade < 0 || grade > 100) {
            return res.status(400).json({ error: "Invalid grade" });
        }

        const submission = await AssignmentSubmission.findByIdAndUpdate(
            req.params.submissionId,
            {
                grade,
                feedback,
                status: 'graded'
            },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }
        res.status(200).json({ message: "Submission graded successfully", submission });

    } catch (error) {
        console.error("Error grading submission:", error);
        res.status(500).json({ error: "Failed to grade submission" });
    }
};