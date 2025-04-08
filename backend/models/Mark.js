const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MarkSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['assignment', 'quiz', 'exam', 'project'],
        default: 'assignment'
    },
    feedback: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Mark', MarkSchema);