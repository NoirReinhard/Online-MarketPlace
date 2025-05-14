import { getSession } from "../lib/getSession";
import { redirect } from "next/navigation";
import LoginForm from "@/app/components/LoginForm";

const Login = async () => {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    if (user.role === "admin") redirect("/Dashboard");
    else if (user.role === "seller") redirect("/seller");
    else if (user.role === "buyer") redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="hidden lg:block lg:w-[1/2] relative">
          <div className="absolute bg-black rounded-r-full py-[10px] px-[5px] top-[80px] font-bold w-[200px] left-0 text-white text-2xl">
            <p>Welcome Back</p>
          </div>
          <img
            src="/assets/Amagi_Park.png"
            alt="Login"
            className="h-[540px] w-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-4xl font-extrabold text-center mb-2">
            Log<span className="text-green-600">In</span>
          </h1>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Welcome back, please login to continue!
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
