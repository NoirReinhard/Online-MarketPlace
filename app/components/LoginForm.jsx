"use client";

import { useRouter } from "next/navigation";
import { login } from "@/action/user";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);

    if (!res.success) {
      toast.error(res.message || "Login failed");
    } else {
      toast.success("Login successful!");
      router.push(res.redirect || "/");
    }
  };

  const handleGoogleLogin = async () => {
    // if needed, Google login logic can go here
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            className="border-black border rounded-full px-2 py-2 h-[30px] w-full"
            type="text"
            name="username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            className="border-black rounded-full px-2 py-2 h-[30px] border w-full"
            type="email"
            name="email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            className="border-black rounded-full px-2 py-2 h-[30px] border w-full"
            type="password"
            name="password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <form
        // action={async () => {
        //   "use server";
        //   await signIn("google");
        // }}
      >
        <button type="submit" className="p-2 w-[200px] mt-10 shadow-md">
          Google
        </button>
      </form>

      <p className="mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600">
          Register
        </a>
      </p>
    </>
  );
}
