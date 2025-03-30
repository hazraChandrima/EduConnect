// const express = require("express");
// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const { getBucket } = require("../config/db");
// const { GridFSBucket } = require("mongodb");
// const mongoose = require("mongoose");

// const router = express.Router();

// const MONGO_URI = process.env.MONGODB_URI;

// // const storage = new GridFsStorage({
// //     url: MONGO_URI,
// //     file: (req, file) => {
// //         return {
// //             bucketName: "assignments",
// //             filename: `${Date.now()}-${file.originalname}`,
// //             metadata: { uploadedBy: req.user ? req.user._id : "unknown" },
// //         };
// //     },
// // });

// // const upload = multer({ storage });
  

// // const storage = multer.diskStorage({
// //     destination: "./uploads/",
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + "-" + file.originalname);
// //     }
// // });
// // const upload = multer({ storage });

// // router.post("/test-upload", upload.single("file"), async (req, res) => {
// //     console.log("File Received:", req.file);
// //     res.json({ message: "File uploaded!", file: req.file });
// // });




// // router.post("/submit", upload.single("file"), async (req, res) => {
// //     try {
// //         console.log("File Received:", req.file);
// //         console.log("User Metadata:", req.user);
// //         if (!req.file) {
// //             return res.status(400).json({ error: "No file uploaded!" });
// //         }

// //         console.log("File uploaded:", req.file);
// //         res.status(201).json({ message: "File uploaded successfully!", file: req.file });
// //     } catch (error) {
// //         console.error("Upload Error:", error);
// //         res.status(500).json({ error: "Error uploading file" });
// //     }
// // });



// const upload = multer({ dest: "uploads/" }); // Store file temporarily

// router.post("/submit", upload.single("file"), async (req, res) => {
//     try {
//         console.log("Received File:", req.file);

//         const db = mongoose.connection.db;
//         const bucket = new GridFSBucket(db, { bucketName: "assignments" });

//         const fs = require("fs");
//         const stream = fs.createReadStream(req.file.path);
//         const uploadStream = bucket.openUploadStream(req.file.originalname);

//         stream.pipe(uploadStream)
//             .on("error", (err) => {
//                 console.error("Upload Error:", err);
//                 res.status(500).json({ error: "Error uploading file" });
//             })
//             .on("finish", () => {
//                 console.log("✅ File uploaded successfully!");
//                 res.status(201).json({ message: "File uploaded successfully!" });
//             });
//     } catch (error) {
//         console.error("❌ Upload Error:", error);
//         res.status(500).json({ error: "Error uploading file" });
//     }
// });





// router.get("/download/:filename", async (req, res) => {
//     try {
//         const bucket = getBucket();
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




// router.get("/files", async (req, res) => {
//     try {
//         const bucket = getBucket();
//         const files = await bucket.find().toArray();

//         res.json(files);
//     } catch (error) {
//         console.error("Error Fetching Files:", error);
//         res.status(500).json({ error: "Error fetching files" });
//     }
// });




// // Delete Assignment by id
// // have to create a button in UI to implement :(
// router.delete("/delete/:id", async (req, res) => {
//     try {
//         const bucket = getBucket();
//         const fileId = req.params.id;

//         await bucket.delete(new mongoose.Types.ObjectId(fileId));
//         res.json({ message: "File deleted successfully" });
//     } catch (error) {
//         console.error("Delete Error:", error);
//         res.status(500).json({ error: "Error deleting file" });
//     }
// });


// module.exports = router;






const express = require("express");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
const fs = require("fs");

const router = express.Router();


// Use multer to temporarily store files in "uploads/" before moving them to GridFS
const upload = multer({ dest: "uploads/" });

router.post("/submit", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        console.log("Received File:", req.file);

        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: "assignments" });

        const stream = fs.createReadStream(req.file.path);
        const uploadStream = bucket.openUploadStream(req.file.originalname);

        stream.pipe(uploadStream)
            .on("error", (err) => {
                console.error("Upload Error:", err);
                res.status(500).json({ error: "Error uploading file" });
            })
            .on("finish", () => {
                console.log("File uploaded successfully!");
                fs.unlinkSync(req.file.path); // Remove temp file
                res.status(201).json({ message: "File uploaded successfully!" });
            });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Error uploading file" });
    }
});




// Download a file by filename
router.get("/download/:filename", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: "assignments" });
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




// Fetch all files
router.get("/files", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: "assignments" });

        const files = await bucket.find().toArray();
        res.json(files);
    } catch (error) {
        console.error("Error Fetching Files:", error);
        res.status(500).json({ error: "Error fetching files" });
    }
});



// Delete a file by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: "assignments" });
        const fileId = new mongoose.Types.ObjectId(req.params.id);

        await bucket.delete(fileId);
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Error deleting file" });
    }
});


module.exports = router;