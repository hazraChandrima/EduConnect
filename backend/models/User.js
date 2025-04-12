const mongoose = require("mongoose")
const Schema = mongoose.Schema
const xss = require('xss');

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
})


// Pre-save hook to sanitize all string fields
UserSchema.pre('save', function (next) {
  for (let key in this._doc) {
    if (typeof this[key] === 'string') {
      this[key] = xss(this[key]);
    }
  }
  next();
});

module.exports = mongoose.model("User", UserSchema)

