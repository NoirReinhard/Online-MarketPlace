import { getSession } from "../lib/getSession";
import { redirect } from "next/navigation";
import RegisterForm from "@/app/components/RegisterForm";

const Register = async () => {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    if (user.role === "admin") redirect("/Dashboard");
    else if (user.role === "seller") redirect("/seller");
    else if (user.role === "buyer") redirect("/");
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}

        {/* Form Section */}
        <div className="w-full lg:w-1/2 px-8 py-4 ">
          <h1 className="text-4xl font-extrabold text-center mb-2">
            Sign<span className="text-green-600">Up</span>
          </h1>
          <p className="text-center text-gray-500 mb-4 text-sm">
            Create your account to start shopping or selling!
          </p>
          <RegisterForm />
        </div>
        <div className="hidden lg:flex lg:w-1/2  items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
          <img src="/assets/signu4.jpg" alt="Register" className="h-[520px] w-[520px] object-fit-contain" />
        </div>
      </div>
    </div>
  );
};

export default Register;
