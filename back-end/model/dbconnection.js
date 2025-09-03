const mongoose = require('mongoose');

const dbconnection = async () => {
  try {
    // Read connection string from environment variable
    const MONGO_URI = process.env.MONGO_URI 
      || "mongodb://127.0.0.1:27017/Budget-Tracker-App"; // fallback to local

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` Connected to MongoDB: ${MONGO_URI}`);
  } catch (err) {
    console.error(" Error while connecting to DB:", err.message);
  }
};

dbconnection();
