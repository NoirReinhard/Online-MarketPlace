"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register } from "@/action/user";

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
      <form onSubmit={handleRegister} className="w-full">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username:
          </label>
          <input
            className="border border-gray-300 rounded-md w-full px-3 py-2"
            type="text"
            name="username"
            id="username"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password:
          </label>
          <input
            className="border border-gray-300 rounded-md w-full px-3 py-2"
            type="password"
            name="password"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role:
          </label>
          <select
            className="border border-gray-300 rounded-md w-full px-3 py-2"
            name="role"
            id="role"
            required
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
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
    </>
  );
}
