"use server";
import { Order } from "@/app/models/Order";
import { getSession } from "@/app/lib/getSession";
import connectDB from "@/app/lib/db";

const order = async (formData, cart) => {
  const session = await getSession();

  if (!session || !session.user) {
    throw new Error("User session not found. Please log in.");
  }

  console.log(cart, "carttttttttttttttt");

  const { address, city, state, postCode } = formData;

  connectDB();

  // Loop through each cart item and create an order
  for (const item of cart) {
    const { _id, name, imageUrl, price, quantity } = item;

    await Order.create({
      address,
      city,
      state,
      postcode: postCode,
      buyer: session.user.username,
      productname: name,
      imageUrl,
      price,
      quantity,
      productId: _id,
      email: session.user.email,
    });
  }

  console.log("All orders created successfully!");
};

export default order;
