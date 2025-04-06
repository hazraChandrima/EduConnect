// const express = require("express");
// const multer = require("multer");
// const { GridFSBucket } = require("mongodb");
// const mongoose = require("mongoose");
// const fs = require("fs");

// const router = express.Router();


// // Use multer to temporarily store files in "uploads/" before moving them to GridFS
// const upload = multer({ dest: "uploads/" });

// router.post("/submit", upload.single("file"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded!" });
//         }

//         console.log("Received File:", req.file);

//         const db = mongoose.connection.db;
//         const bucket = new GridFSBucket(db, { bucketName: "assignments" });

//         const stream = fs.createReadStream(req.file.path);
//         const uploadStream = bucket.openUploadStream(req.file.originalname);

//         stream.pipe(uploadStream)
//             .on("error", (err) => {
//                 console.error("Upload Error:", err);
//                 res.status(500).json({ error: "Error uploading file" });
//             })
//             .on("finish", () => {
//                 console.log("File uploaded successfully!");
//                 fs.unlinkSync(req.file.path); // Remove temp file
//                 res.status(201).json({ message: "File uploaded successfully!" });
//             });
//     } catch (error) {
//         console.error("Upload Error:", error);
//         res.status(500).json({ error: "Error uploading file" });
//     }
// });




// // Download a file by filename
// router.get("/download/:filename", async (req, res) => {
//     try {
//         const db = mongoose.connection.db;
//         const bucket = new GridFSBucket(db, { bucketName: "assignments" });
//         const { filename } = req.params;

//         const downloadStream = bucket.openDownloadStreamByName(filename);
//         res.set("Content-Disposition", `attachment; filename=${filename}`);

//         downloadStream.pipe(res).on("error", (err) => {
//             console.error("Download Error:", err);
//             res.status(500).json({ error: "Error downloading file" });
//         });
//     } catch (error) {
//         console.error("Download Error:", error);
//         res.status(500).json({ error: "Error downloading file" });
//     }
// });




// // Fetch all files
// router.get("/files", async (req, res) => {
//     try {
//         const db = mongoose.connection.db;
//         const bucket = new GridFSBucket(db, { bucketName: "assignments" });

//         const files = await bucket.find().toArray();
//         res.json(files);
//     } catch (error) {
//         console.error("Error Fetching Files:", error);
//         res.status(500).json({ error: "Error fetching files" });
//     }
// });



// // Delete a file by ID
// router.delete("/delete/:id", async (req, res) => {
//     try {
//         const db = mongoose.connection.db;
//         const bucket = new GridFSBucket(db, { bucketName: "assignments" });
//         const fileId = new mongoose.Types.ObjectId(req.params.id);

//         await bucket.delete(fileId);
//         res.json({ message: "File deleted successfully" });
//     } catch (error) {
//         console.error("Delete Error:", error);
//         res.status(500).json({ error: "Error deleting file" });
//     }
// });


// module.exports = router;

const express = require("express");
const AssignmentSubmission = require("../models/AssignmentSubmission.js"); // you'll create this model
const { verifyToken } = require("../middleware/authMiddleware.js"); // JWT middleware

const router = express.Router();


router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { assignmentId, courseId, downloadUrl } = req.body;

    if (!assignmentId || !courseId || !downloadUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSubmission = new AssignmentSubmission({
      assignmentId,
      courseId,
      downloadUrl,
      uploader: req.user.id, // Provided by auth middleware
    });

    await newSubmission.save();

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("Firebase upload metadata save error:", error);
    res.status(500).json({ error: "Server error saving submission" });
  }
});

module.exports = router;
