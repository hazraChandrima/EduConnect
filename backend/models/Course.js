const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CourseSchema = new Schema({
	code: {
		type: String,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ""
	},
	professor: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	students: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	department: {
		type: String,
		required: true
	},
	credits: {
		type: Number,
		default: 3
	},
	color: {
		type: String,
		default: "#5c51f3"
	},
	icon: {
		type: String,
		default: "book"
	},
	progress: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});


module.exports = mongoose.model('Course', CourseSchema);