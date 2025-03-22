const express = require("express");
// const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware"); // ✅ Correct import

const router = express.Router();

// // ✅ Use `verifyToken` first, then `authorizeRoles`
// router.get("/student-dashboard", verifyToken, authorizeRoles(["student"]), (req, res) => {
//   res.json({ message: "Welcome to Student Dashboard!" });
// });

// router.get("/professor-dashboard", verifyToken, authorizeRoles(["professor"]), (req, res) => {
//   res.json({ message: "Welcome to Professor Dashboard!" });
// });

// router.get("/admin-dashboard", verifyToken, authorizeRoles(["admin"]), (req, res) => {
//   res.json({ message: "Welcome to Admin Dashboard!" });
// });


const { getUserById } = require("../controllers/userController");

router.get("/:id", getUserById); // Route to fetch user by ID

module.exports = router;
