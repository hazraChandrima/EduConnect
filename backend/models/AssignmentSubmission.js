const mongoose = require("mongoose");

const AssignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  downloadUrl: {
    type: String,
    required: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Adjust if your user model is named differently
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema);
