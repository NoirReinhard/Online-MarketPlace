import React from "react";
import Link from "next/link";
import connectDB from "@/app/lib/db";
import { login } from "@/action/user";
import { signIn } from "@/auth";
import { getSession } from "../lib/getSession";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) {
    if (user.role == "admin") redirect("/Dashboard");
    else if (user.role == "seller") redirect("/seller");
    else if (user.role == "buyer") redirect("/");
  }
  await connectDB();
  return (
    <div className="flex justify-center items-center h-screen flex-col ">
      <div className="p-6 bg-white shadow-black shadow-md w-[25%] z-50 rounded-md flex flex-col items-center py-5">
        <h1 className="text-4xl pb-4 font-bold">
          Log<span className="text-green-600 ">In</span>
        </h1>
        <form className="" action={login}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor=""
            >
              UserName:
            </label>
            <input
              className="border-black border rounded-full px-2 py-2 h-[30px]"
              type="text"
              name="username"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor=""
            >
              Email:
            </label>
            <input
              className="border-black rounded-full px-2 py-2 h-[30px] border"
              type="email"
              name="email"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor=""
            >
              Password:
            </label>
            <input
              className="border-black rounded-full px-2 py-2 h-[30px] border"
              type="password"
              name="password"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" >
            Login
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit" className="p-2 w-[200px] mt-10 shadow-md">
            Google
          </button>
        </form>

        <p>
          Don't have an account{"? "}
          <Link href="/register" className="text-blue-600">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
