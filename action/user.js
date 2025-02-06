"use server";

import connectDB from "@/app/lib/db";
import { User } from "@/app/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcrypt";
import { signIn } from "@/auth";

const login = async (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  console.log("Type:",typeof email);
  const findRole = await User.findOne({ email });
  console.log(findRole.role);

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  } catch (error) {
    const someError = error;
    return someError.cause;
  }
  if (findRole.role == "admin") redirect("/Dashboard");
  else if (findRole.role == "seller") redirect("/seller");
  else if (findRole.role == "buyer") redirect("/");
};
const register = async (formData) => {
  const username = formData.get("username");
  const password = formData.get("password");
  const email = formData.get("email");
  const role = formData.get("role");
  console.log(username);
  if (!username || !password || !email) throw new Error("Fill All the Fields");
  await connectDB();

  const existinguser = await User.findOne({ email });
  if (existinguser) throw new Error("User Already Exists");
  const hashedPwd = await hash(password, 12);
  await User.create({ username, email, password: hashedPwd, role });
  console.log(hashedPwd);
  console.log("User Created Successfully");
  redirect("/Login");
};
export { register, login };
