import { register } from "@/action/user";
import { signIn } from "@/auth";
import Link from "next/link";
import { getSession } from "../lib/getSession";
import { redirect } from "next/navigation";

const Register = async () => {
  const session = await getSession();
  const user = session?.user;
  if(user){
  if (user.role == "admin") redirect("/Dashboard");
  else if (user.role == "seller") redirect("/seller");
  else if (user.role == "buyer") redirect("/");
  }
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="p-6 bg-white shadow-black shadow-md w-[25%] z-50 rounded-md flex flex-col items-center py-5">
        <h1 className="text-4xl pb-4 font-bold">
          Sign<span className="text-green-600 ">Up</span>
        </h1>

        <form action={register} className="p-6 bg-white shadow-md rounded-md">
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
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
      </div>
    </div>
  );
};

export default Register;
