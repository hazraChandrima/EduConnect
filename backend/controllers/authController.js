const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};



// Register
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully!",
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
