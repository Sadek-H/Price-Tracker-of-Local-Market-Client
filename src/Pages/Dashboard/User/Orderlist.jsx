import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const { theme } = useOutletContext();

  useEffect(() => {
    if (!user?.email || !token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    axios
      .get("https://price-tracker-of-market-server.onrender.com/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userOrders = res.data.filter(
          (order) => order.userEmail === user.email
        );
        setOrders(userOrders);
      })
      .catch(() => toast.error("Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, [token, user]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return theme === "dark"
          ? "bg-yellow-600 text-black"
          : "bg-yellow-200 text-yellow-800";
      case "shipped":
        return theme === "dark"
          ? "bg-blue-600 text-white"
          : "bg-blue-200 text-blue-800";
      case "delivered":
        return theme === "dark"
          ? "bg-green-600 text-white"
          : "bg-green-200 text-green-800";
      case "cancelled":
        return theme === "dark"
          ? "bg-red-600 text-white"
          : "bg-red-200 text-red-800";
      default:
        return theme === "dark"
          ? "bg-gray-700 text-white"
          : "bg-gray-200 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Loading orders...
        </span>
      </div>
    );

  if (!orders.length)
    return (
      <p
        className={`text-center mt-8 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        No orders found.
      </p>
    );

  return (
    <div
      className={`max-w-6xl mx-auto p-6 space-y-6 ${
        theme === "dark" ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <h2 className="text-3xl font-bold mb-4">🛒 My Orders</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg">
        <table
          className={`w-full border-collapse ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <thead
            className={`${
              theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
            }`}
          >
            <tr>
              <th className="px-6 py-3 text-left font-medium">Product</th>
              <th className="px-6 py-3 text-left font-medium">Market</th>
              <th className="px-6 py-3 text-left font-medium">Price</th>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-center font-medium">Status</th>
              <th className="px-6 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order._id}
                className={`transition-colors duration-200 ${
                  theme === "dark"
                    ? idx % 2 === 0
                      ? "bg-gray-900 hover:bg-gray-800"
                      : "bg-gray-800 hover:bg-gray-700"
                    : idx % 2 === 0
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <td className="px-6 py-4">{order.productName}</td>
                <td className="px-6 py-4">{order.marketName || "-"}</td>
                <td className="px-6 py-4 font-semibold">৳{order.amount || "N/A"}</td>
                <td className="px-6 py-4">
                  {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => navigate(`/details/${order.productId}`)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    🔍 View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className={`p-4 rounded-2xl shadow-lg border transition ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{order.productName}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status || "Unknown"}
              </span>
            </div>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Market: {order.marketName || "-"}
            </p>
            <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
              Price: ৳{order.amount || "N/A"}
            </p>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}>
              Ordered: {order.date ? new Date(order.date).toLocaleDateString() : "-"}
            </p>
            <button
              onClick={() => navigate(`/details/${order.productId}`)}
              className={`w-full px-4 py-2 rounded-xl font-medium transition ${
                theme === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              🔍 View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
