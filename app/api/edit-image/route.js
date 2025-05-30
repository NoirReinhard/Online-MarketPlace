export const runtime = 'nodejs'
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/getSession";
import { User } from "@/app/models/User";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const fileToBuffer = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "profile",
        allowed_formats: ["jpg", "png", "jpeg"],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

export async function POST(req) {
  try {
    const { user } = await getSession();
    const userId = user.id;

    const formData = await req.formData();
    const image = formData.get("image");

    const buffer = await fileToBuffer(image);

    const result = await uploadImageToCloudinary(buffer);

    await connectDB();

    const userDoc = await User.findById(userId);
    if (userDoc.imgPublicId) {
      await cloudinary.uploader.destroy(userDoc.imgPublicId);
    }

    // Update with new image
    userDoc.imgURL = result.secure_url;
    userDoc.imgPublicId = result.public_id;
    await userDoc.save();

    return NextResponse.json({
      success: true,
      message: "Profile Image Changed successfully!",
      imgURL:userDoc.imgURL
    });
  } catch (error) {
    console.error("Error Changing Profile Image:", error);
    return NextResponse.json(
      {
        error: "Failed to Change Profile Image",
        details: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
