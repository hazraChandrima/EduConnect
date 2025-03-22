const User = require('../models/User');

// Get User Details by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from request params
        const user = await User.findById(userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
