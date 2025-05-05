import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  imgURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dpk7ntarg/image/upload/v1746411877/e48089c4-7a32-48ee-b879-0c8a69bbdbe4.png",
  },
  imgPublicId: {
    type: String,
    default: "/upload/v1746411877/e48089c4-7a32-48ee-b879-0c8a69bbdbe4.png",
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    default: "buyer",
  },
  isBanned: { type: Boolean, default: false },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
