import mongoose from 'mongoose';
import dns from 'dns';

// Fix for querySrv ECONNREFUSED from local ISP DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.error("DNS Error: ", e);
}

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
