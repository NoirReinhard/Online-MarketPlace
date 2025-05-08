import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/getSession";
import { User } from "@/app/models/User";

const UserFind = async () => {
  const { user } = await getSession();
  const em = user.email;
  await connectDB();
  const sellerId = user.id;
  const userRecord = await User.findOne({ email: em });
  const { username } = userRecord;
  return { username, email: em, sellerId };
};

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
        folder: "products",
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
    const formData = await req.formData();
    const productName = formData.get("productName");
    const price = formData.get("price");
    const description = formData.get("description");
    const quantity = formData.get("quantity");
    const unit = formData.get("unit");
    const stock = formData.get("stock");
    const address = formData.get("address");
    const image = formData.get("image");
    const category = formData.get("category");

    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(image.type)) {
      return NextResponse.json(
        { error: `Unsupported image format. Allowed formats: JPEG, PNG, JPG.` },
        { status: 400 }
      );
    }

    const buffer = await fileToBuffer(image);

    const result = await uploadImageToCloudinary(buffer);

    await connectDB();
    const user = await UserFind();

    const product = await Product.create({
      name: productName,
      price: parseFloat(price),
      description: description,
      imageUrl: result.secure_url,
      imageId: result.public_id,
      quantity: parseInt(quantity),
      unit: unit,
      stock: parseInt(stock),
      address,
      sellerId: user.sellerId,
      category: category,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });

    return NextResponse.json({
      message: "Product uploaded successfully!",
      product,
    });
  } catch (error) {
    console.error("Error uploading product:", error);
    return NextResponse.json(
      { error: "Failed to upload product", details: error.message },
      { status: 500 }
    );
  }
}
