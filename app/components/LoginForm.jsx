"use client";

import { useRouter } from "next/navigation";
import { login } from "@/action/user";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);

    if (res.success) {
      window.location.href = res.redirect;
      toast.success(res.message || "Logged in successfully!");
    } else {
      toast.error(res.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            className="border border-gray-300 rounded-md w-full px-3 py-2"
            type="text"
            name="username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            className="border border-gray-300 rounded-md w-full px-3 py-2"
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
            className="border border-gray-300 rounded-md w-full px-3 py-2"
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

      <div className="mt-6 flex flex-col items-center">
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </>
  );
}
