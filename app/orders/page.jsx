import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import { Order } from "../models/Order";
import { getSession } from "../lib/getSession";

const Page = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("User session not found. Please log in.");
  }
  const email = session.user.email;
  const order = await Order.find({ email });
  return (
    <>
      <div className="min-h-[85vh] bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4">Product</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {order.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.productname}
                      className="w-15 rounded-lg h-12"
                    />
                    <span>{item.productname}</span>
                  </td>

                  <td className="p-4">
                    <p className="">{item.quantity}</p>
                  </td>
                  <td className="p-4 text-gray-600">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <button className="text-red-500 bg-white hover:text-red-700 border-red-500 border-2 rounded-lg px-2 py-1 flex items-center gap-2">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Page;
