import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('👉 TIP 1: This is likely a DNS issue. Try changing your DNS to 8.8.8.8 in Windows Settings.');
    } else if (error.message.includes('IP that isn\'t whitelisted') || error.message.includes('IP Access List') || error.message.includes('Could not connect to any servers')) {
      console.error('👉 TIP 2: Your current IP is not whitelisted or is blocked by a firewall.');
      console.error('   1. Log in to MongoDB Atlas UI -> Network Access.');
      console.error('   2. Delete any existing entries and click "Add IP Address".');
      console.error('   3. Select "Allow Access From Anywhere" (0.0.0.0/0) to test if it works.');
      console.error('   4. If you are on a corporate/school WiFi, try using a mobile hotspot.');
    }
    process.exit(1);
  }
};

export default connectDB;
