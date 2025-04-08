const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CurriculumUnitSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    topics: [{
        type: String
    }],
    resources: [{
        type: String
    }]
});



const CurriculumSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    units: [CurriculumUnitSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Curriculum', CurriculumSchema);