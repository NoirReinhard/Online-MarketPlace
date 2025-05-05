import React from "react";
import { Order } from "@/app/models/Order";
import { getSession } from "@/app/lib/getSession";
import { redirect } from "next/navigation";
import SellerNotifications from "@/app/components/SellerNotifications";

const Orders = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const orders = await Order.find().populate("items.sellerId").lean();
  console.log(orders, "Ordersssssssssssssssihfufu");

  const filteredOrders = orders.filter((order) =>
    order.items.some(
      (item) => item.sellerId?._id?.toString() === user.id.toString()
    )
  );
  const serializedOrders = filteredOrders.map((order) => ({
    _id: order._id.toString(),
    buyer: order.buyer.toString(),
    phoneNumber: order.phoneNumber,
    address: order.address,
    city: order.city,
    state: order.state,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      _id: item._id?.toString() || "",
      productId: item.productId?.toString() || "",
      productname: item.productname,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: item.quantity,
      sellerId: {
        _id: item.sellerId?._id?.toString() || "",
        name: item.sellerId?.name || "",
        email: item.sellerId?.email || "",
      },
    })),
  }));

  console.log(filteredOrders, "Filtered Orders");

  return (
    <div>
      <SellerNotifications orders={serializedOrders} />
    </div>
  );
};

export default Orders;
