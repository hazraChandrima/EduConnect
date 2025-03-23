const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationCode, sendWelcomeEmail } = require('../middleware/email');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};



// Register
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({ name, email, password: hashedPassword, role, verificationCode, isVerified: false });

    await user.save();
    sendVerificationCode(user.email, verificationCode);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully! Please verify your email.",
      userId: user._id,
      token,
      role: user.role
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please check your email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.json({
      userId: user._id,
      token,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Verify Email
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




// Update Password
exports.updatePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Email not verified. Please verify your email first." });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};