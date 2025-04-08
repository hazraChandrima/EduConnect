//for the assignments that professors create
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  courseId: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
