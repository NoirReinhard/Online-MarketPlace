"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Button from "../elements/Button";
import { admincategories, filter } from "../constants";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [lb, setLb] = useState("All");

  useEffect(() => {
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
      });
  }, []);

  const handleFilter = (label) => {
    console.log("Filter label:", label);
    console.log("All Orders:", orders);
    setLb(label);
    if (label === "All") {
      setOrders(allOrders);
      return;
    }
    const filteredOrders = allOrders.filter((order) => {
      console.log("Order Status:", order.status);
      return order.status === label;
    });

    console.log("Filtered:", filteredOrders);
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
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">All Orders</h2>
      <div className="flex gap-5 justify-center">
        {admincategories.map((category) => (
          <Button
            key={category.status}
            label={category.status}
            border={"border-gray-300"}
            rounded={true}
            onClick={() => handleFilter(category.status)}
            className={`${
              lb == category.status
                ? "bg-button_color text-white"
                : "text-blue-950 bg-white"
            } mx-2 mb-4`}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.length == 0 ? (
          <div className="flex h-[50vh] font-bold w-[78%] absolute justify-center items-center">
            <h1>No Orders Found</h1>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-2 border"
            >
              <img
                src={order.imageUrl}
                alt={order.productname}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="font-semibold text-lg">{order.productname}</div>
              <div className="text-sm text-gray-500">
                Buyer: {order.buyer} <br />
                Email: {order.email}
              </div>
              <div className="text-sm text-gray-600">
                Qty: {order.quantity} | Price: ₹{order.price}
              </div>
              <div className="text-sm text-gray-600">
                Address: {order.address}, {order.city}, {order.state}
              </div>
              <div className="flex items-center mt-2 justify-between">
                <select
                  value={statusMap[order._id] || order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <Button
                  onClick={() => updateStatus(order._id)}
                  className="ml-auto px-3 py-1 text-sm"
                  label="Update Status"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
