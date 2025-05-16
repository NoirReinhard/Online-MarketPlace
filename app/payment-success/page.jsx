import Link from "next/link";

export default function PaymentSuccess({ searchParams: { amount } }) {
  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-1">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">Your Order is Processing...</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ₹{amount}
        </div>
      </div>
      <div className="flex items-center justify-center w-full">
      <Link
        href="/orders"
        className="bg-white text-purple-500 font-semibold px-2 py-2 rounded-md hover:translate-y-[-10px] transition-all ease-in mt-10 flex items-center justify-center duration-300 w-max"
      >
        Your Orders{" "}        
      </Link>
      </div>
    </main>
  );
}
