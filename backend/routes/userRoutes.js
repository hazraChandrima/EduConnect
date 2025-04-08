const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
    getUserById,
    getAllUsers,
    getUsersByRole,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");


router.get("/:id", getUserById);

//for admin only
router.get("/", verifyToken, authorizeRoles(["admin"]), getAllUsers);
router.get("/role/:role", verifyToken, authorizeRoles(["admin"]), getUsersByRole);
router.post("/", verifyToken, authorizeRoles(["admin"]), createUser);
router.delete("/:id", verifyToken, authorizeRoles(["admin"]), deleteUser);

// for self or admin only
router.put("/:id", verifyToken, updateUser);


module.exports = router;