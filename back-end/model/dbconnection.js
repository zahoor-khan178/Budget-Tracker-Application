const mongoose = require('mongoose');
require('dotenv').config(); 

const dbconnection = async () => {
  const atlasURI = process.env.MONGO_URI;
  const localURI = "mongodb://127.0.0.1:27017/Budget-Tracker-App";

  try {
    if (atlasURI) {
      console.log(" Trying to connect to MongoDB Atlas...");
      await mongoose.connect(atlasURI);
      console.log(" Connected to MongoDB Atlas");
    } else {
      console.log(" No Atlas URI found, using local MongoDB...");
      await mongoose.connect(localURI);
      console.log(" Connected to local MongoDB");
    }
  } catch (err) {
    console.error(" Atlas connection failed:", err.message);
    console.log(" Falling back to local MongoDB...");
    try {
      await mongoose.connect(localURI);
      console.log(" Connected to local MongoDB");
    } catch (localErr) {
      console.error(" Local MongoDB connection failed:", localErr.message);
    }
  }
};

dbconnection();
