const User = require("../models/User");
const bcrypt = require('bcryptjs');



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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword, // Store the hashed password
            role,
            department,
            program,
            year
        });

        await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: { ...user.toObject(), password: undefined }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Server error" });
    }
};





// temporary role escalation - granting temporary access to a student to take attendance
exports.grantTemporaryAccess = async (req, res) => {
    try {
        const { studentEmail, professorEmail, grant } = req.body;

        if (!studentEmail || !professorEmail) {
            return res.status(400).json({ message: "Missing email(s)" });
        }

        // Update hasAccess field
        const updatedUser = await User.findOneAndUpdate(
            { email: studentEmail },
            grant
                ? {
                        hasAccess: true,
                        accessExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
                  }
                : {
                        hasAccess: false,
                        accessExpiresAt: null,
                  },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Log audit
        await AccessAudit.create({
            studentEmail,
            professorEmail,
            action: grant ? "GRANTED" : "REVOKED",
            timestamp: new Date(),
        });

        res.status(200).json({ message: `Access ${grant ? "granted" : "revoked"} successfully` });
    } catch (err) {
        console.error("Grant access error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};






// update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {};

        // Handle regular field updates
        if (req.body.name) updates.name = req.body.name;
        if (req.body.email) updates.email = req.body.email;
        if (req.body.password) updates.password = req.body.password;
        if (req.body.role) updates.role = req.body.role;
        if (req.body.department) updates.department = req.body.department;
        if (req.body.program) updates.program = req.body.program;
        if (req.body.year) updates.year = req.body.year;
        if (req.body.isVerified !== undefined) updates.isVerified = req.body.isVerified;
        if (req.body.verificationCode) updates.verificationCode = req.body.verificationCode;
        if (req.body.loginOTP) updates.loginOTP = req.body.loginOTP;
        if (req.body.loginOTPExpires) updates.loginOTPExpires = req.body.loginOTPExpires;
        if (req.body.isSuspended !== undefined) updates.isSuspended = req.body.isSuspended;
        if (req.body.suspendedUntil) updates.suspendedUntil = req.body.suspendedUntil;
        if (req.body.gpa !== undefined) updates.gpa = req.body.gpa;

        // Handle gradeCount updates
        if (req.body.gradeCount) {
            updates.gradeCount = {
                A: req.body.gradeCount.A ?? 0,
                B: req.body.gradeCount.B ?? 0,
                C: req.body.gradeCount.C ?? 0,
                D: req.body.gradeCount.D ?? 0,
                F: req.body.gradeCount.F ?? 0,
            };
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
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