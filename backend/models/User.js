const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["student", "professor", "admin"],
		default: "student",
	},
	department: {
		type: String,
		default: "",
	},
	program: {
		type: String,
		default: "",
	},
	year: {
		type: Number,
		default: 1,
	},
	gpa: [{
		value: {
			type: Number,
			default: 0.0,
		},
		date: {
			type: Date,
			default: Date.now,
		}
	}],
	gradeCount: {
		A: { type: Number, default: 0 },
		B: { type: Number, default: 0 },
		C: { type: Number, default: 0 },
		D: { type: Number, default: 0 },
		F: { type: Number, default: 0 },
	},
	joinDate: {
		type: Date,
		default: Date.now,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationCode: {
		type: String,
	},
	loginOTP: {
		type: String,
	},
	loginOTPExpires: {
		type: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	isSuspended: {
		type: Boolean,
		default: false,
	},
	suspendedUntil: {
		type: Date,
		default: null,
	},
	hasAccess: {
		type: Boolean,
		default: false,
	}, 
	accessExpiresAt: {
		type: Date,
		default: null,
	},
});


module.exports = mongoose.model("User", UserSchema);