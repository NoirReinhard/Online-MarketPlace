import { getSession } from "@/app/lib/getSession";
import { User } from "@/app/models/User";
import connectDB from "@/app/lib/db";
export async function PUT(req, { params }) {
  try {
    const session = await getSession();
    const { username } = await req.json();
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { username });
    return Response.json({ success: true, message: "Username updated." });
  } catch (error) {
    console.log("Error updating username:", error);
    return Response.json(
      { success: false, message: "Failed to update username." },
      { status: 500 }
    );
  }
}
