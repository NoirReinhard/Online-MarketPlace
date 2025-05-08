"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register } from "@/action/user";
import { FcGoogle } from "react-icons/fc";

export default function RegisterForm() {
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await register(formData);

    if (!res.success) {
      toast.error(res.message || "Registration failed");
    } else {
      toast.success("Registered successfully!");
      router.push(res.redirect || "/login");
    }
  };

  return (
    <>
      <form
        onSubmit={handleRegister}
        className="w-full flex flex-col gap-4 text-sm"
      >
        <div>
          <label htmlFor="username" className="block font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="block font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            id="role"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-500 text-sm mt-3">
          Already have an account?{" "}
          <a href="/Login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </>
  );
}
