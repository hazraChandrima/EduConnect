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
    console.log("Connecting to MongoDB...");
    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    dbConnection = connection.connection;
    console.log("MongoDB Connected Successfully!");

    if (dbConnection.readyState === 1) {
      bucket = new GridFSBucket(dbConnection.db, { bucketName: "assignments" });
      console.log("GridFSBucket Initialized Successfully!");
    } else {
      dbConnection.once("open", () => {
        bucket = new GridFSBucket(dbConnection.db, { bucketName: "assignments" });
        console.log("GridFSBucket Initialized Successfully (After Open Event)!");
      });
    }

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