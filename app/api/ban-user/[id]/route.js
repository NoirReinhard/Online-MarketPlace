import { User } from "@/app/models/User";
import connectDB from "@/app/lib/db";

export async function PUT(request, { params }) {
  const { id } = params;
  await connectDB();

  const user = await User.findById(id);
  if (!user) {
    return Response.json({
      success: false,
      message: "User not found",
      status: 404,
    });
  }

  if (user.role === "admin") {
    return Response.json({
      success: false,
      message: "Cannot Ban Admin",
      status: 403,
    });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  return Response.json({
    success: true,
    message: user.isBanned
      ? "User Banned Successfully"
      : "User UnBanned Successfully",
  });
}
