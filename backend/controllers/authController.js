const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationCode, sendWelcomeEmail, sendAlertOnLogin } = require('../middleware/email');


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

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Email not verified. Please verify your email first." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




// Generate and send login OTP
exports.requestLoginOTP = async (req, res) => {
  const { email } = req.body

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Email not verified. Please verify your email first." })
    }

    const loginOTP = Math.floor(100000 + Math.random() * 900000).toString()

    // Save the OTP to the user document with an expiry time (10 minutes)
    user.loginOTP = loginOTP
    user.loginOTPExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    sendVerificationCode(user.email, loginOTP)

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}




// Verify login OTP
exports.verifyLoginOTP = async (req, res) => {
  const { email, code } = req.body

  try {
    if (!email || !code) {
      return res.status(400).json({ success: false, message: "Email and verification code are required" })
    }

    const user = await User.findOne({
      email,
      loginOTP: code,
      loginOTPExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
    }

    // Clear the OTP after successful verification
    user.loginOTP = undefined
    user.loginOTPExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}




// Modify the existing loginUser function to support 2FA
exports.loginUser = async (req, res) => {
  const { email, password, otpVerified } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "User not found" })

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please check your email." })
    }

    // Check if OTP was verified (required for 2FA login)
    if (!otpVerified) {
      return res.status(403).json({ message: "Email verification required" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    const token = generateToken(user._id, user.role)

    res.json({
      userId: user._id,
      token,
      role: user.role,
    })

    sendAlertOnLogin(user.email, user.name);

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

