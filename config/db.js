const mongoose = require('mongoose');

/**
 * @desc    Connect to MongoDB Cluster
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // I am not exiting the process here to allow the server to start, 
    // but you should check your MONGO_URI and Network Whitelisting in Atlas.
  }
};

module.exports = connectDB;
