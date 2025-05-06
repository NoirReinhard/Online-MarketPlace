"use server";

import connectDB from "@/app/lib/db";
import { User } from "@/app/models/User";
import { hash } from "bcrypt";
import { signIn } from "@/auth";

const login = async (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (user.isBanned) {
    return { success: false, message: "You are banned" };
  }

  try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res || res.error) {
      return { success: false, message: "Invalid Credentials" };
    }

    let redirectTo = "/";
    if (user.role === "admin") redirectTo = "/Dashboard";
    else if (user.role === "seller") redirectTo = "/seller";

    return { success: true, redirect: redirectTo };
  } catch (error) {
    return { success: false, message: "Login failed" };
  }
};

const register = async (formData) => {
  const username = formData.get("username");
  const password = formData.get("password");
  const email = formData.get("email")?.toLowerCase();
  const role = formData.get("role");

  if (!username || !password || !email || !role) {
    return { success: false, message: "Fill all the fields" };
  }

  await connectDB();
  const existinguser = await User.findOne({ email });

  if (existinguser) {
    return { success: false, message: "User already exists" };
  }

  const hashedPwd = await hash(password, 12);
  await User.create({ username, email, password: hashedPwd, role });

  return { success: true, redirect: "/Login" };
};

export { register, login };
