import { User } from "@/app/models/User";
import connectDB from "@/app/lib/db";

export async function GET() {
  await connectDB();
  const users = await User.find({}, "-password");
  return Response.json(users);
}
