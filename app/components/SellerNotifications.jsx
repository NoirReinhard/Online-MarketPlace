"use client";

import React from "react";

const SellerNotifications = ({ orders }) => {
  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Sales Notifications
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[45vh] gap-2">
          <img
            src="/assets/wagaguri1.png"
            height="180px"
            width="180px"
            alt="No Orders Found"
          />
          <p className="font-semibold text-gray-500 text-lg">
            No Orders Found!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg shadow-md p-4 sm:p-6 bg-white"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-blue-700">
                  Order ID: <span className="text-gray-700">{order._id}</span>
                </h2>
                {/* <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                  {order.createdAt}
                </span> */}
              </div>

              {/* Buyer Info */}
              <div className="text-sm text-gray-700 mb-4">
                <p className="font-medium">Shipping Address:</p>
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.state}
                </p>
                <p>Phone: {order.phoneNumber}</p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800">
                  Purchased Items:
                </h3>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center border p-3 rounded-md shadow-sm"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productname}
                      className="w-20 h-20 object-cover rounded-md mr-0 sm:mr-4 mb-2 sm:mb-0"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {item.productname}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right text-green-600 font-semibold mt-2 sm:mt-0">
                      ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="text-right font-bold text-lg text-black pt-4 border-t mt-4">
                Total: ₹{order.totalAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerNotifications;
