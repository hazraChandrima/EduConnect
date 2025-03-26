// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB Connected successfully!");
//   } catch (error) {
//     console.error(" MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const MONGO_URI = process.env.MONGODB_URI;

let bucket;
let dbConnection;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    dbConnection = connection.connection;

    console.log("MongoDB Connected");

    dbConnection.once("open", () => {
      bucket = new GridFSBucket(dbConnection.db, { bucketName: "assignments" });
      console.log("GridFSBucket initialized successfully!");
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const getBucket = () => {
  if (!bucket) {
    console.error("GridFSBucket not initialized!");
    throw new Error("GridFSBucket not initialized. Call connectDB() first.");
  }
  return bucket;
};

module.exports = { connectDB, getBucket };
