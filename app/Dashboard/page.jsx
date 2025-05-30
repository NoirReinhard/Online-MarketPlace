"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Button from "../elements/Button";
import { admincategories, filter } from "../constants";
import Loader from "@/app/components/Loader";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [lb, setLb] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/get-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setAllOrders(data);
        const initialStatus = {};
        data.forEach((order) => {
          initialStatus[order._id] = order.status;
        });
        setStatusMap(initialStatus);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (label) => {
    setLb(label);
    if (label === "All") {
      setOrders(allOrders);
      return;
    }
    const filteredOrders = allOrders.filter((order) => {
      return order.status === label;
    });

    setOrders(filteredOrders);
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusMap((prev) => ({ ...prev, [id]: newStatus }));
  };

  const updateStatus = async (id) => {
    const newStatus = statusMap[id];
    const res = await fetch(`/api/update-status/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      toast.success("Order status updated successfully.");
      const updatedOrders = orders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setAllOrders(updatedOrders);
    } else {
      toast.error("Failed to update status.");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          All Orders
        </h2>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {admincategories.map((category) => {
            const isActive = lb === category.status;
            const color = isActive
              ? "text-white"
              : "text-blue-900 font-semibold";
            const bgColor = isActive ? "bg-green-600" : "bg-white";

            return (
              <Button
                key={category.status}
                label={category.status}
                color={color}
                backColor={bgColor}
                border="border-gray-300"
                rounded
                onClick={() => handleFilter(category.status)}
                className={`${bgColor} ${color} px-4 py-2 rounded-full`}
              />
            );
          })}
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[45vh] gap-2">
            <img
              src="/assets/wagaguri1.png"
              height="180px"
              width="180px"
              alt=""
            />
            <p className="font-semibold text-gray-500 text-lg">
              No Orders Found!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-6 flex flex-col gap-4"
              >
                {/* Order Details */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-blue-700">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Buyer ID: {order.buyer}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {order.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address}, {order.city}, {order.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment:{" "}
                    <span className="font-medium capitalize">
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Ordered Items */}
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-semibold text-gray-700">Items:</h4>
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 items-center bg-gray-50 p-2 rounded-md"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.productname}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="text-sm">
                        <p className="font-semibold">{item.productname}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-gray-600">Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Update */}
                <div className="flex items-center mt-auto gap-2 pt-4 border-t">
                  <select
                    value={statusMap[order._id] || order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2 text-sm flex-1"
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                  <Button
                    onClick={() => updateStatus(order._id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
                    label="Update"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
