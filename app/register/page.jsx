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
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="p-6 bg-white shadow-black shadow-md w-[25%] z-50 rounded-md flex flex-col items-center py-5">
        <h1 className="text-4xl pb-4 font-bold">
          Sign<span className="text-green-600">Up</span>
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
