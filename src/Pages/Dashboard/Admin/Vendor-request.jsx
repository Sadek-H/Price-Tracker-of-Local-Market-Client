import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { useOutletContext } from "react-router";

const AllOrder = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://price-tracker-for-local-markets-ser.vercel.app/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("❌ Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <span className="ml-3 text-lg font-semibold text-blue-600">
          Loading orders...
        </span>
      </div>
    );

  if (!orders.length)
    return (
      <div className="text-center text-gray-400 text-xl mt-10">
        ❌ No orders found
      </div>
    );

  return (
    <div
      className={`pt-6 max-w-7xl mx-auto px-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">
        🛒 All Orders
      </h2>

      {/* Table view for md+ */}
      <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
        <table
          className={`w-full border-collapse rounded-lg overflow-hidden ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order._id}
                className={`transition hover:scale-[1.01] ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <td className="px-6 py-3">{idx + 1}</td>
                <td className="px-6 py-3">{order.userName || "N/A"}</td>
                <td className="px-6 py-3">{order.productName}</td>
                <td className="px-6 py-3 font-medium text-blue-600">
                  ${(order.amount / 100).toFixed(2)}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {orders.map((order, idx) => (
          <div
            key={order._id}
            className={`rounded-xl shadow-md p-4 transition hover:scale-[1.02] ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Order #{idx + 1}</h3>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm">
              <span className="font-medium">Customer:</span> {order.userName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Product:</span> {order.productName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Price:</span>{" "}
              ${(order.amount / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrder;
