const User = require("../models/User");



// fetch user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// fetch users by role
exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await User.find({ role }).select("-password");
        res.json(users);
    } catch (error) {
        console.error("Error fetching users by role:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// create new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, department, program, year } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = new User({
            name,
            email,
            password, // hash this password in production
            role,
            department,
            program,
            year
        });

        await user.save();
        res.status(201).json({ message: "User created successfully", user: { ...user.toObject(), password: undefined } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).select("-password"); // still exclude password from response

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Server error" });
    }
};




// delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Server error" });
    }
};