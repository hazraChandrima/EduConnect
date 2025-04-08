const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AssignmentSubmissionSchema = new Schema({
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    downloadUrl: {
        type: String,
        required: true,
    },
    uploader: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    grade: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['submitted', 'graded'],
        default: 'submitted'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema);