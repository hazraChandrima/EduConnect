const Curriculum = require("../models/Curriculum");
const Course = require("../models/Course");


// fetch curriculum by course
exports.getCurriculumByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const curriculum = await Curriculum.find({ courseId });

        res.json(curriculum);
    } catch (error) {
        console.error("Error fetching curriculum:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// create curriculum
exports.createCurriculum = async (req, res) => {
    try {
        const { courseId, title, description, units } = req.body;
        const professorId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to create curriculum for this course" });
        }

        const curriculum = new Curriculum({
            courseId,
            title,
            description,
            units
        });

        await curriculum.save();
        res.status(201).json({ message: "Curriculum created successfully", curriculum });

    } catch (error) {
        console.error("Error creating curriculum:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// update curriculum
exports.updateCurriculum = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const professorId = req.user.id; 

        const curriculum = await Curriculum.findById(id);
        if (!curriculum) {
            return res.status(404).json({ error: "Curriculum not found" });
        }

        const course = await Course.findById(curriculum.courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to update curriculum for this course" });
        }

        Object.assign(curriculum, updates);
        await curriculum.save();
        res.json({ message: "Curriculum updated successfully", curriculum });

    } catch (error) {
        console.error("Error updating curriculum:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// delete curriculum
exports.deleteCurriculum = async (req, res) => {
    try {
        const { id } = req.params;
        const professorId = req.user.id; 

        const curriculum = await Curriculum.findById(id);
        if (!curriculum) {
            return res.status(404).json({ error: "Curriculum not found" });
        }

        const course = await Course.findById(curriculum.courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.professor.toString() !== professorId) {
            return res.status(403).json({ error: "You are not authorized to delete curriculum for this course" });
        }

        await Curriculum.findByIdAndDelete(id);

        res.json({ message: "Curriculum deleted successfully" });
    } catch (error) {
        console.error("Error deleting curriculum:", error);
        res.status(500).json({ error: "Server error" });
    }
};