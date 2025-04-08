const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AssignmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'graded', 'late'],
        default: 'pending'
    }
});


module.exports = mongoose.model('Assignment', AssignmentSchema);