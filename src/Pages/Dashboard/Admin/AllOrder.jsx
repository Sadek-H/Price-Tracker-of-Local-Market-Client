import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";
import { useOutletContext } from "react-router";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const { theme } = useOutletContext();

  useEffect(() => {
    axios
      .get("https://price-tracker-for-local-markets-ser.vercel.app/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="max-w-7xl flex justify-center items-center h-64 mx-auto">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-blue-600 text-lg font-semibold ml-2">
          Loading orders...
        </span>
      </div>
    );

  if (!orders.length)
    return (
      <div className={`text-center text-xl mt-10 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        ❌ No orders found!
      </div>
    );

  return (
    <div className="pt-6 max-w-6xl mx-auto px-3">
      <h2 className={`text-3xl font-bold mb-6 text-center ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
        🛒 All Orders
      </h2>

      {/* Table View for md+ */}
      <div className={`hidden md:block overflow-x-auto rounded-xl shadow-lg border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <table className={`table-auto w-full text-sm ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
          <thead className={`${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-blue-50"}`}>
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id} className={`transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-blue-50"}`}>
                <td className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">{idx + 1}</td>
                <td className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 font-medium">{order.userName || "N/A"}</td>
                <td className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">{order.productName}</td>
                <td className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">${(order.amount / 100).toFixed(2)}</td>
                <td className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for small devices */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.map((order, idx) => (
          <div key={order._id} className={`p-4 rounded-xl shadow-md border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200"}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`font-semibold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>Order #{idx + 1}</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${order.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"}`}>
                {order.status}
              </span>
            </div>
            <p><span className="font-semibold">Customer:</span> {order.userName || "N/A"}</p>
            <p><span className="font-semibold">Product:</span> {order.productName}</p>
            <p><span className="font-semibold">Price:</span> ${(order.amount / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrder;
