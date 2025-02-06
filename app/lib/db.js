import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Succesfully connected to mongoDB");
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};
export default connectDB;