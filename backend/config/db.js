const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online_shopping', {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`[Database Notice] MongoDB connection could not be established (${error.message}).`);
    console.log(`[Database Notice] Activating resilient local JSON/File store for out-of-the-box development & testing!`);
    return false;
  }
};

const getStatus = () => isMongoConnected;

module.exports = {
  connectDB,
  getStatus
};

