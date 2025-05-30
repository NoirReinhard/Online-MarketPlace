export const runtime = 'nodejs'
import { Order } from "../models/Order";
import { getSession } from "../lib/getSession";
import Button from "../elements/Button";

const Page = async () => {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("User session not found. Please log in.");
  }

  const userId = session.user.id;
  const orders = await Order.find({ buyer: userId })
    .sort({ dateobj: -1, _id: -1 })
    .populate("items.sellerId")
    .lean();
  const serializedOrders = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    buyer: order.buyer.toString(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      ...item,
      _id: item._id?.toString() || "",
      productId: item.productId?.toString() || "",
      sellerId: item.sellerId?._id?.toString() || "",
      sellerUsername: item.sellerId?.username || "",
      sellerEmail: item.sellerId?.email || "",
    })),
  }));

  return (
    <div className="max-w-4xl mx-auto px-3 py-6">
      {serializedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-[-50px] relative">
          <img
            src="/assets/wagaguri2.png"
            height="220px"
            width="220px"
            alt="Not Found"
            className="absolute top-[90px]"
          />
          <p className="font-semibold text-gray-500 text-lg">
            No Orders Found!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {serializedOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 shadow-sm rounded-xl p-4 bg-white"
            >
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-800">
                  Order ID: {order._id}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {order.phoneNumber}
                </p>
                <p className="text-sm text-gray-600">
                  {order.address}, {order.city}, {order.state}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-gray-200 p-5 bg-gray-50"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productname}
                      className="h-36 object-contain rounded-md mb-3"
                    />
                    <div className="text-base font-semibold truncate">
                      {item.productname}
                    </div>
                    <div className="text-sm text-gray-700">
                      Qty: {item.quantity} | ₹{item.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      Seller: {item.sellerUsername}
                    </div>
                    <div className="text-sm text-gray-500">
                      Email: {item.sellerEmail}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                <div className="text-gray-700 font-medium">
                  Total: ₹{order.totalAmount}
                </div>
                <div className="text-gray-500">
                  Status: <span className="font-semibold">{order.status}</span>{" "}
                  | Payment:{" "}
                  <span className="font-semibold">{order.paymentStatus}</span>
                </div>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                  label="Cancel"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
