const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { getBucket } = require("../config/db");

const router = express.Router();

const MONGO_URI = process.env.MONGODB_URI;

// Configure GridFS Storage
const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return {
      bucketName: "assignments",
      filename: file.originalname,
      metadata: { uploadedBy: req.user ? req.user._id : "unknown" },
    };
  },
});

const upload = multer({ storage });

// Upload Assignment Route
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    console.log("File uploaded:", req.file);
    res.status(201).json({ message: "File uploaded successfully!", file: req.file });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

// Download Assignment Route
router.get("/download/:filename", async (req, res) => {
  try {
    const bucket = getBucket();
    const { filename } = req.params;

    const downloadStream = bucket.openDownloadStreamByName(filename);
    res.set("Content-Disposition", `attachment; filename=${filename}`);

    downloadStream.pipe(res).on("error", (err) => {
      console.error("Download Error:", err);
      res.status(500).json({ error: "Error downloading file" });
    });
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ error: "Error downloading file" });
  }
});

// List All Uploaded Assignments
router.get("/files", async (req, res) => {
  try {
    const bucket = getBucket();
    const files = await bucket.find().toArray();

    res.json(files);
  } catch (error) {
    console.error("Error Fetching Files:", error);
    res.status(500).json({ error: "Error fetching files" });
  }
});

// Delete Assignment by ID
// have to create a button in UI to implement :(
router.delete("/delete/:id", async (req, res) => {
  try {
    const bucket = getBucket();
    const fileId = req.params.id;

    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
});

module.exports = router;
