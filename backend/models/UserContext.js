const mongoose = require("mongoose");


const userContextSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	knownDevices: [String],
	knownLocations: [
		{
			latitude: Number,
			longitude: Number,
			radius: Number,
		},
	],
	loginHistory: [
		{
			timestamp: { type: Date, default: Date.now },
			location: {
				latitude: Number,
				longitude: Number,
			},
			deviceId: String,
			status: { type: String, enum: ["success", "failed"], default: "success" },
		},
	],
});


module.exports = mongoose.model("UserContext", userContextSchema);
