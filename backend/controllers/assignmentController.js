// const multer = require("multer");
// const { ObjectId } = require("mongodb");
// const gridFSService = require("../config/gridfs")

// class AssignmentController {
//     #upload;

//     constructor() {
//         this.#upload = multer();
//     }
   
//     async upload(req, res) {
//         try {
//             const bucket = gridFSService.bucket(); 
//             if (!bucket) {
//                 console.error("GridFSBucket not initialized!");
//                 return res.status(500).json({ error: "Database not ready. Try again later." });
//             }

//             if (!req.file) {
//                 return res.status(400).json({ error: "No file uploaded" });
//             }

//             const metadata = {
//                 uploadedBy: req.user ? new ObjectId(req.user._id) : null,
//                 createdDate: new Date(),
//             };

//             const stream = bucket.openUploadStream(req.file.originalname, {
//                 metadata,
//                 contentType: req.file.mimetype,
//             });

//             stream.end(req.file.buffer);

//             stream.on("finish", (file) => {
//                 console.log(`File uploaded: ${file.filename}`);
//                 res.json({ document: file.filename, fileId: file._id });
//             });

//             stream.on("error", (err) => {
//                 console.error("Upload error:", err);
//                 res.status(500).json({ error: "File upload failed" });
//             });
//         } catch (error) {
//             console.error("Upload process error:", error);
//             res.status(500).json({ error: "File upload failed" });
//         }
//     }

// }

// module.exports = new AssignmentController();