// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const UserContext = require("../models/UserContext");
// const { calculateRiskScore } = require("../utils/calculateRisk");
// const {
// 	sendVerificationCode,
// 	sendWelcomeEmail,
// 	sendAlertOnLogin,
// 	sendAccountSuspensionAlert,
// 	sendResetPasswordEmail
// } = require('../middleware/email');



// // generate JWT token
// const generateToken = (id, role) => {
// 	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
// };




// // register new user
// // exports.registerUser = async (req, res) => {
// // 	const { name, email, password, role } = req.body;

// // 	try {
// // 		if (!email || !password || !name) {
// // 			return res.status(400).json({ success: false, message: "All fields are required" });
// // 		}

// // 		const existingUser = await User.findOne({ email });
// // 		if (existingUser) {
// // 			return res.status(400).json({ success: false, message: "User already exists. Please login." });
// // 		}

// // 		const hashedPassword = await bcrypt.hash(password, 10);
// // 		const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
// // 		const user = new User({ name, email, password: hashedPassword, role, verificationCode, isVerified: false });

// // 		await user.save();
// 		// sendVerificationCode(user.email, verificationCode);

// 		// const token = generateToken(user._id, user.role);

// // 		res.status(201).json({
// // 			message: "User registered successfully! Please verify your email.",
// // 			userId: user._id,
// // 			token,
// // 			role: user.role
// // 		});

// // 	} catch (error) {
// // 		res.status(500).json({ error: error.message });
// // 	}
// // };





// // verify email with OTP
// exports.verifyEmail = async (req, res) => {
// 	try {
// 		const { code } = req.body;
// 		const user = await User.findOne({ verificationCode: code });

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired code" });
// 		}

// 		user.isVerified = true;
// 		user.verificationCode = undefined;
// 		await user.save();

// 		res.status(200).json({ message: "Email verified successfully!" });
// 		sendWelcomeEmail(user.email, user.name);

// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };





// // Update password 
// exports.updatePassword = async (req, res) => {
// 	const { email, password, contextData } = req.body;
// 	try {
// 		if (!email || !password) {
// 			return res.status(400).json({ success: false, message: "Email and password are required" });
// 		}

// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(404).json({ success: false, message: "User not found" });
// 		}

// 		if (user.isVerified) {
// 			console.log("User already verified, but updating password and saving context");
// 		}

// 		const hashedPassword = await bcrypt.hash(password, 10);
// 		user.password = hashedPassword;
// 		user.isVerified = true;
// 		await user.save();

// 		if (contextData && contextData.deviceId && contextData.location) {
// 			let userContext = await UserContext.findOne({ userId: user._id });

// 			if (!userContext) {
// 				userContext = new UserContext({
// 					userId: user._id,
// 					knownDevices: [contextData.deviceId],
// 					knownLocations: [{
// 						latitude: contextData.location.latitude,
// 						longitude: contextData.location.longitude,
// 						radius: 5,
// 					}],
// 					loginHistory: [{
// 						timestamp: new Date(),
// 						location: contextData.location,
// 						deviceId: contextData.deviceId,
// 					}]
// 				});
// 				await userContext.save();
// 				console.log("UserContext created for", user.email);
// 			} else {
// 				// If already exists, just update if necessary
// 				if (!userContext.knownDevices.includes(contextData.deviceId)) {
// 					userContext.knownDevices.push(contextData.deviceId);
// 				}

// 				const locationExists = userContext.knownLocations.some(loc =>
// 					loc.latitude === contextData.location.latitude &&
// 					loc.longitude === contextData.location.longitude
// 				);

// 				if (!locationExists) {
// 					userContext.knownLocations.push({
// 						latitude: contextData.location.latitude,
// 						longitude: contextData.location.longitude,
// 						radius: 5,
// 					});
// 				}
// 				userContext.loginHistory.push({
// 					timestamp: new Date(),
// 					location: contextData.location,
// 					deviceId: contextData.deviceId,
// 				});
// 				await userContext.save();
// 				console.log("UserContext updated for", user.email);
// 			}
// 		} else {
// 			console.warn("No contextData provided during updatePassword");
// 		}
// 		res.status(200).json({ success: true, message: "Password updated and account verified!" });

// 	} catch (error) {
// 		console.error("Error in updatePassword:", error.message);
// 		res.status(500).json({ success: false, error: error.message });
// 	}
// };





// // generate and send login OTP
// exports.requestLoginOTP = async (req, res) => {
// 	const { email } = req.body;

// 	try {
// 		if (!email) {
// 			return res.status(400).json({ success: false, message: "Email is required" });
// 		}

// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(404).json({ success: false, message: "User not found" });
// 		}

// 		const loginOTP = Math.floor(100000 + Math.random() * 900000).toString();

// 		// Save the OTP to the user document with an expiry time (10 minutes)
// 		user.loginOTP = loginOTP;
// 		user.loginOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
// 		await user.save();

// 		sendVerificationCode(user.email, loginOTP);

// 		res.status(200).json({
// 			success: true,
// 			message: "Verification code sent to your email",
// 		});
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };





// // verify login OTP
// exports.verifyLoginOTP = async (req, res) => {
// 	const { email, code } = req.body;

// 	try {
// 		if (!email || !code) {
// 			return res.status(400).json({ success: false, message: "Email and verification code are required" });
// 		}

// 		const user = await User.findOne({
// 			email,
// 			loginOTP: code,
// 			loginOTPExpires: { $gt: Date.now() },
// 		});

// 		if (!user) {
// 			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
// 		}

// 		user.loginOTP = undefined;
// 		user.loginOTPExpires = undefined;
// 		await user.save();

// 		res.status(200).json({
// 			success: true,
// 			message: "OTP verified successfully",
// 		});

// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };






// // Context Aware Adaptive Authentication during login, so any sus user trying to log in from another device/ far location is suspended for 1 day
// // exports.loginUser = async (req, res) => {
// // 	const { email, password, contextData, otpVerified } = req.body;

// // 	try {
// // 		console.log("Login request received for:", email);
// // 		console.log("Context Data:", contextData);
// // 		console.log("OTP Verified:", otpVerified);

// // 		if (!contextData || !contextData.deviceId || !contextData.location) {
// // 			return res.status(400).json({ success: false, message: "Missing context data" });
// // 		}

// // 		const user = await User.findOne({ email });
// // 		if (!user) {
// // 			console.log("User not found");
// // 			return res.status(400).json({ message: "User not found" });
// // 		}

// // 		if (!user.isVerified) {
// // 			console.log("Email not verified for user:", user.email);
// // 			return res.status(403).json({ message: "Email not verified. Please check your email." });
// // 		}

// // 		if (!otpVerified) {
// // 			console.log("OTP not verified for user:", user.email);
// // 			return res.status(403).json({ message: "Email verification required" });
// // 		}

// // 		if (user.suspendedUntil && new Date() < user.suspendedUntil) {
// // 			console.log(`User ${user.email} is suspended until ${user.suspendedUntil}`);
// // 			return res.status(403).json({
// // 				success: false,
// // 				forceLogout: true,
// // 				message: `Account suspended until ${user.suspendedUntil.toLocaleString()}`,
// // 			});
// // 		}

// // 		console.log("Checking password for:", email);
// // 		const isMatch = await bcrypt.compare(password, user.password);

// // 		if (!isMatch) {
// // 			console.log("Invalid password for:", email);
// // 			return res.status(400).json({ message: "Invalid credentials" });
// // 		}

// // 		let userContext = await UserContext.findOne({ userId: user._id });
// // 		if (!userContext) {
// // 			console.log("Creating new user context for:", email);
// // 			userContext = new UserContext({
// // 				userId: user._id,
// // 				knownDevices: [],
// // 				knownLocations: [],
// // 				loginHistory: [],
// // 			});
// // 		}
// // 		const riskScore = await calculateRiskScore(contextData, userContext);
// // 		console.log("Risk score for login:", riskScore);

// // 		if (riskScore >= 8) {
// // 			const suspensionTime = new Date();
// // 			suspensionTime.setHours(suspensionTime.getHours() + 24);
// // 			user.isSuspended = true;
// // 			user.suspendedUntil = suspensionTime;
// // 			await user.save();
// // 			console.log(`Suspended user ${user.email} due to high risk:`, riskScore);

// // 			const verificationToken = crypto.randomBytes(32).toString('hex');
// // 			user.verificationToken = verificationToken;
// // 			user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours suspension
// // 			await user.save();

// // 			const verificationLink = `${process.env.FRONTEND_URL}/verify-device/${verificationToken}`;

// // 			const locationInfo = contextData.location.city ?
// // 				`${contextData.location.city}, ${contextData.location.country}` :
// // 				'Unknown location';

// // 			await sendAccountSuspensionAlert(
// // 				user.email,
// // 				user.name,
// // 				contextData.deviceInfo || 'Unknown device',
// // 				locationInfo,
// // 				contextData.ipAddress || 'Unknown IP',
// // 				verificationLink
// // 			);

// // 			return res.status(403).json({
// // 				success: false,
// // 				message: `Unusual activity detected! Your account is suspended until ${suspensionTime.toLocaleString()}`,
// // 			});
// // 		}

// // 		user.suspendedUntil = null;
// // 		await user.save();
// // 		if (!userContext.knownDevices.includes(contextData.deviceId)) {
// // 			userContext.knownDevices.push(contextData.deviceId);
// // 		}

// // 		const locationExists = userContext.knownLocations.some(loc =>
// // 			loc.latitude === contextData.location.latitude &&
// // 			loc.longitude === contextData.location.longitude
// // 		);

// // 		if (!locationExists) {
// // 			userContext.knownLocations.push({
// // 				latitude: contextData.location.latitude,
// // 				longitude: contextData.location.longitude,
// // 				radius: 5,
// // 			});
// // 		}

// // 		userContext.loginHistory.push({
// // 			timestamp: new Date(),
// // 			location: contextData.location,
// // 			deviceId: contextData.deviceId,
// // 		});

// // 		await userContext.save();
// // 		const token = generateToken(user._id, user.role);
// // 		res.json({
// // 			success: true,
// // 			userId: user._id,
// // 			token,
// // 			role: user.role,
// // 		});
// // 		sendAlertOnLogin(user.email, user.name);

// // 	} catch (error) {
// // 		console.error("Login error:", error.message);
// // 		res.status(500).json({ error: error.message });
// // 	}
// // };







// exports.loginUser = async (req, res) => {
// 	const { email, password, contextData, otpVerified } = req.body;

// 	try {
// 		console.log("Login request received for:", email);
// 		console.log("Context Data:", contextData);
// 		console.log("OTP Verified:", otpVerified);

// 		if (!contextData || !contextData.deviceId || !contextData.location) {
// 			return res.status(400).json({ success: false, message: "Missing context data" });
// 		}

// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			console.log("User not found");
// 			return res.status(400).json({ message: "User not found" });
// 		}

// 		if (!user.isVerified) {
// 			console.log("Email not verified for user:", user.email);
// 			return res.status(403).json({ message: "Email not verified. Please check your email." });
// 		}

// 		if (!otpVerified) {
// 			console.log("OTP not verified for user:", user.email);
// 			return res.status(403).json({ message: "Email verification required" });
// 		}

// 		if (user.suspendedUntil && new Date() < user.suspendedUntil) {
// 			console.log(`User ${user.email} is suspended until ${user.suspendedUntil}`);
// 			return res.status(403).json({
// 				success: false,
// 				forceLogout: true,
// 				message: `Account suspended until ${user.suspendedUntil.toLocaleString()}`,
// 			});
// 		}

// 		console.log("Checking password for:", email);
// 		const isMatch = await bcrypt.compare(password, user.password);

// 		if (!isMatch) {
// 			console.log("Invalid password for:", email);
// 			return res.status(400).json({ message: "Invalid credentials" });
// 		}

// 		// Find or create user context
// 		let userContext = await UserContext.findOne({ userId: user._id });
// 		let isFirstLogin = false;

// 		if (!userContext) {
// 			console.log("First login detected for:", email);
// 			isFirstLogin = true;

// 			// Create new user context for first-time login
// 			userContext = new UserContext({
// 				userId: user._id,
// 				knownDevices: [contextData.deviceId],
// 				knownLocations: [{
// 					latitude: contextData.location.latitude,
// 					longitude: contextData.location.longitude,
// 					radius: 5,
// 				}],
// 				loginHistory: [],
// 			});
// 		} else {
// 			// Not first login, calculate risk score
// 			const riskScore = await calculateRiskScore(contextData, userContext);
// 			console.log("Risk score for login:", riskScore);
// 			if (riskScore >= 8) {
// 				const suspensionTime = new Date();
// 				suspensionTime.setHours(suspensionTime.getHours() + 24);
// 				user.isSuspended = true;
// 				user.suspendedUntil = suspensionTime;
// 				await user.save();
// 				console.log(`Suspended user ${user.email} due to high risk:`, riskScore);

// 				const verificationToken = crypto.randomBytes(32).toString('hex');
// 				user.verificationToken = verificationToken;
// 				user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours suspension
// 				await user.save();

// 				const verificationLink = `${process.env.FRONTEND_URL}/verify-device/${verificationToken}`;

// 				const locationInfo = contextData.location.city ?
// 					`${contextData.location.city}, ${contextData.location.country}` :
// 					'Unknown location';

// 				await sendAccountSuspensionAlert(
// 					user.email,
// 					user.name,
// 					contextData.deviceInfo || 'Unknown device',
// 					locationInfo,
// 					contextData.ipAddress || 'Unknown IP',
// 					verificationLink
// 				);

// 				return res.status(403).json({
// 					success: false,
// 					message: `Unusual activity detected! Your account is suspended until ${suspensionTime.toLocaleString()}`,
// 				});
// 			}
// 		}

// 		user.suspendedUntil = null;
// 		await user.save();

// 		// Add device to known devices if it's new
// 		if (!userContext.knownDevices.includes(contextData.deviceId)) {
// 			userContext.knownDevices.push(contextData.deviceId);
// 		}

// 		// Check if location exists in known locations
// 		const locationExists = userContext.knownLocations.some(loc =>
// 			loc.latitude === contextData.location.latitude &&
// 			loc.longitude === contextData.location.longitude
// 		);

// 		// Add location to known locations if it's new
// 		if (!locationExists) {
// 			userContext.knownLocations.push({
// 				latitude: contextData.location.latitude,
// 				longitude: contextData.location.longitude,
// 				radius: 5,
// 			});
// 		}

// 		userContext.loginHistory.push({
// 			timestamp: new Date(),
// 			location: contextData.location,
// 			deviceId: contextData.deviceId,
// 		});

// 		await userContext.save();
// 		const token = generateToken(user._id, user.role);
// 		res.json({
// 			success: true,
// 			userId: user._id,
// 			token,
// 			role: user.role,
// 			isFirstLogin: isFirstLogin
// 		});

// 		sendAlertOnLogin(user.email, user.name);

// 	} catch (error) {
// 		console.error("Login error:", error.message);
// 		res.status(500).json({ error: error.message });
// 	}
// };






// // send password reset link via email
// exports.forgotPassword = async (req, res) => {
// 	const { email } = req.body;

// 	try {
// 		const user = await User.findOne({ email });

// 		if (!user) {
// 			return res.status(404).json({ message: 'User not found' });
// 		}

// 		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
// 		const resetLink = `http://${process.env.IP_ADDRESS}:8081/resetPassword?token=${token}`;

// 		await sendResetPasswordEmail(email, resetLink);

// 		res.json({ message: 'Reset link sent to your email.' });

// 	} catch (error) {
// 		console.error('Error sending reset email:', error);
// 		res.status(500).json({ message: 'Error sending reset email.' });
// 	}
// };





// // reset password
// exports.resetPassword = async (req, res) => {
// 	const { token, newPassword } = req.body;

// 	try {
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);
// 		const user = await User.findById(decoded.id);

// 		if (!user) {
// 			return res.status(404).json({ message: 'User not found' });
// 		}

// 		const salt = await bcrypt.genSalt(10);
// 		user.password = await bcrypt.hash(newPassword, salt);
// 		await user.save();

// 		res.json({ message: 'Password reset successfully' });

// 	} catch (error) {
// 		console.error('Error resetting password:', error);
// 		res.status(400).json({ message: 'Invalid or expired token' });
// 	}
// };





const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserContext = require("../models/UserContext");
const { calculateRiskScore } = require("../utils/calculateRisk");
const {
	sendVerificationCode,
	sendWelcomeEmail,
	sendAlertOnLogin,
	sendAccountSuspensionAlert,
	sendResetPasswordEmail
} = require('../middleware/email');

// generate JWT token
const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};




// user enters email and receives OTP
exports.initiateLogin = async (req, res) => {
	const { email } = req.body;

	try {
		if (!email) {
			return res.status(400).json({ success: false, message: "Email is required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (user.suspendedUntil && new Date() < user.suspendedUntil) {
			console.log(`User ${user.email} is suspended until ${user.suspendedUntil}`);
			return res.status(403).json({
				success: false,
				forceLogout: true,
				message: `Account suspended until ${user.suspendedUntil.toLocaleString()}`,
			});
		}

		const loginOTP = Math.floor(100000 + Math.random() * 900000).toString();
		// expiry time (10 minutes)
		user.loginOTP = loginOTP;
		user.loginOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
		await user.save();

		sendVerificationCode(user.email, loginOTP);

		res.status(200).json({
			success: true,
			message: "Verification code sent to your email",
			userId: user._id // Send the userId for the next step
		});
	} catch (error) {
		console.error("Error initiating login:", error.message);
		res.status(500).json({ success: false, error: error.message });
	}
};





// verify OTP
exports.verifyLoginOTP = async (req, res) => {
	const { email, code } = req.body;

	try {
		if (!email || !code) {
			return res.status(400).json({ success: false, message: "Email and verification code are required" });
		}

		const user = await User.findOne({
			email,
			loginOTP: code,
			loginOTPExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isOTPVerified = true;
		user.isVerified = true
		user.loginOTP = undefined;
		user.loginOTPExpires = undefined;
		await user.save();

		res.status(200).json({
			success: true,
			message: "OTP verified successfully",
			userId: user._id,
			email: user.email
		});

	} catch (error) {
		console.error("Error verifying OTP:", error.message);
		res.status(500).json({ success: false, error: error.message });
	}
};





// Complete login with password and context aware adaptive auth
exports.loginUser = async (req, res) => {
	const { email, password, contextData } = req.body;

	try {
		console.log("Login request received for:", email);
		console.log("Context Data:", contextData);

		if (!contextData || !contextData.deviceId || !contextData.location) {
			return res.status(400).json({ success: false, message: "Missing context data" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			console.log("User not found");
			return res.status(400).json({ success: false, message: "User not found" });
		}

		if (!user.isVerified) {
			console.log("Email not verified for user:", user.email);
			return res.status(403).json({ success: false, message: "Email not verified. Please check your email." });
		}

		if (user.suspendedUntil && new Date() < user.suspendedUntil) {
			console.log(`User ${user.email} is suspended until ${user.suspendedUntil}`);
			return res.status(403).json({
				success: false,
				forceLogout: true,
				message: `Account suspended until ${user.suspendedUntil.toLocaleString()}`,
			});
		}

		console.log("Checking password for:", email);
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			console.log("Invalid password for:", email);
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		let userContext = await UserContext.findOne({ userId: user._id });
		let isFirstLogin = false;

		if (!userContext) {
			console.log("First login detected for:", email);
			isFirstLogin = true;

			// Create new user context for first-time login
			userContext = new UserContext({
				userId: user._id,
				knownDevices: [contextData.deviceId],
				knownLocations: [{
					latitude: contextData.location.latitude,
					longitude: contextData.location.longitude,
					radius: 5,
				}],
				loginHistory: [],
			});
		} else {
			// Not first login, calculate risk score
			const riskScore = await calculateRiskScore(contextData, userContext);
			console.log("Risk score for login:", riskScore);
			if (riskScore >= 8) {
				const suspensionTime = new Date();
				suspensionTime.setHours(suspensionTime.getHours() + 24);
				user.isSuspended = true;
				user.suspendedUntil = suspensionTime;
				await user.save();
				console.log(`Suspended user ${user.email} due to high risk:`, riskScore);

				const verificationToken = crypto.randomBytes(32).toString('hex');
				user.verificationToken = verificationToken;
				user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours suspension
				await user.save();

				const verificationLink = `${process.env.FRONTEND_URL}/verify-device/${verificationToken}`;

				const locationInfo = contextData.location.city ?
					`${contextData.location.city}, ${contextData.location.country}` :
					'Unknown location';

				await sendAccountSuspensionAlert(
					user.email,
					user.name,
					contextData.deviceInfo || 'Unknown device',
					locationInfo,
					contextData.ipAddress || 'Unknown IP',
					verificationLink
				);

				return res.status(403).json({
					success: false,
					message: `Unusual activity detected! Your account is suspended until ${suspensionTime.toLocaleString()}`,
				});
			}
		}

		user.suspendedUntil = null;
		user.isOTPVerified = false;
		await user.save();

		// Add device to known devices if it's new
		if (!userContext.knownDevices.includes(contextData.deviceId)) {
			userContext.knownDevices.push(contextData.deviceId);
		}

		// Check if location exists in known locations
		const locationExists = userContext.knownLocations.some(loc =>
			loc.latitude === contextData.location.latitude &&
			loc.longitude === contextData.location.longitude
		);

		// Add location to known locations if it's new
		if (!locationExists) {
			userContext.knownLocations.push({
				latitude: contextData.location.latitude,
				longitude: contextData.location.longitude,
				radius: 5,
			});
		}

		userContext.loginHistory.push({
			timestamp: new Date(),
			location: contextData.location,
			deviceId: contextData.deviceId,
		});

		await userContext.save();
		const token = generateToken(user._id, user.role);
		res.json({
			success: true,
			userId: user._id,
			token,
			role: user.role,
			isFirstLogin: isFirstLogin
		});

		sendAlertOnLogin(user.email, user.name);

	} catch (error) {
		console.error("Login error:", error.message);
		res.status(500).json({ success: false, error: error.message });
	}
};






// verify email with OTP
exports.verifyEmail = async (req, res) => {
	try {
		const { code } = req.body;
		const user = await User.findOne({ verificationCode: code });

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired code" });
		}

		user.isVerified = true;
		user.verificationCode = undefined;
		await user.save();

		res.status(200).json({ message: "Email verified successfully!" });
		sendWelcomeEmail(user.email, user.name);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};





// update password
exports.updatePassword = async (req, res) => {
	const { email, password, contextData } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({ success: false, message: "Email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		if (user.isVerified) {
			console.log("User already verified, but updating password and saving context");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		user.isVerified = true;
		await user.save();

		if (contextData && contextData.deviceId && contextData.location) {
			let userContext = await UserContext.findOne({ userId: user._id });

			if (!userContext) {
				userContext = new UserContext({
					userId: user._id,
					knownDevices: [contextData.deviceId],
					knownLocations: [{
						latitude: contextData.location.latitude,
						longitude: contextData.location.longitude,
						radius: 5,
					}],
					loginHistory: [{
						timestamp: new Date(),
						location: contextData.location,
						deviceId: contextData.deviceId,
					}]
				});
				await userContext.save();
				console.log("UserContext created for", user.email);
			} else {
				// If already exists, just update if necessary
				if (!userContext.knownDevices.includes(contextData.deviceId)) {
					userContext.knownDevices.push(contextData.deviceId);
				}

				const locationExists = userContext.knownLocations.some(loc =>
					loc.latitude === contextData.location.latitude &&
					loc.longitude === contextData.location.longitude
				);

				if (!locationExists) {
					userContext.knownLocations.push({
						latitude: contextData.location.latitude,
						longitude: contextData.location.longitude,
						radius: 5,
					});
				}
				userContext.loginHistory.push({
					timestamp: new Date(),
					location: contextData.location,
					deviceId: contextData.deviceId,
				});
				await userContext.save();
				console.log("UserContext updated for", user.email);
			}
		} else {
			console.warn("No contextData provided during updatePassword");
		}
		res.status(200).json({ success: true, message: "Password updated and account verified!" });

	} catch (error) {
		console.error("Error in updatePassword:", error.message);
		res.status(500).json({ success: false, error: error.message });
	}
};





// forgot password
exports.forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
		const resetLink = `http://${process.env.IP_ADDRESS}:8081/resetPassword?token=${token}`;

		await sendResetPasswordEmail(email, resetLink);

		res.json({ message: 'Reset link sent to your email.' });

	} catch (error) {
		console.error('Error sending reset email:', error);
		res.status(500).json({ message: 'Error sending reset email.' });
	}
};





// reset password
exports.resetPassword = async (req, res) => {
	const { token, newPassword } = req.body;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);
		await user.save();

		res.json({ message: 'Password reset successfully' });

	} catch (error) {
		console.error('Error resetting password:', error);
		res.status(400).json({ message: 'Invalid or expired token' });
	}
};