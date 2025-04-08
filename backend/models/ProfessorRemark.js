const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProfessorRemarkSchema = new Schema({
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
    professorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    remark: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        default: 'neutral'
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('ProfessorRemark', ProfessorRemarkSchema);