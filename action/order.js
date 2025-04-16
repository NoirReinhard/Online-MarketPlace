"use server";
import { Order } from "@/app/models/Order";
import { getSession } from "@/app/lib/getSession";
import connectDB from "@/app/lib/db";
import Product from "@/app/models/Products";

const order = async (formData, cart) => {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("User session not found. Please log in.");
  }

  const { address, city, state, postCode } = formData;

  await connectDB();

  for (const item of cart) {
    const { _id, name, imageUrl, price, quantity } = item;

    const product = await Product.findById(_id);
    if (!product) {
      return {
        success: false,
        message: `Product with ID ${_id} not found.`,
      };
    }

    if (product.stock > 0) {
      if (quantity <= product.stock) {
        product.stock -= quantity;

        if (product.stock === 0) {
          product.isAvailable = false;
        }

        await product.save();
        const sub_tot = price * quantity;
        const delivery = sub_tot * 0.05;
        const total = sub_tot + delivery;
        await Order.create({
          address,
          city,
          state,
          phoneNumber: postCode,
          buyer: session.user.username,
          productname: name,
          imageUrl,
          price: total,
          quantity,
          productId: _id,
          email: session.user.email,
        });
      } else {
        return {
          success: false,
          message: `Only ${product.stock} items left in stock for ${product.name}.`,
        };
      }
    } else {
      return {
        success: false,
        message: `${product.name} is out of stock.`,
      };
    }
  }

  return {
    success: true,
    message: "Your Order has been Successfully Placed!",
  };
};

export default order;
