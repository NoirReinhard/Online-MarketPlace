import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return; 
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export default connectDB;
