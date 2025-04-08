const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const {
    getCurriculumByCourse,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum
} = require("../controllers/curriculumController");


router.get("/course/:courseId", verifyToken, getCurriculumByCourse);

// for professor only
router.post("/", verifyToken, authorizeRoles(["professor"]), createCurriculum);
router.put("/:id", verifyToken, authorizeRoles(["professor"]), updateCurriculum);
router.delete("/:id", verifyToken, authorizeRoles(["professor"]), deleteCurriculum);


module.exports = router;