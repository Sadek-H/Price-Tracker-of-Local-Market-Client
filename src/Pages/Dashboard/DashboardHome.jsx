import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useOutletContext } from "react-router";
import { FaUsers, FaBoxOpen, FaBullhorn, FaShoppingCart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const StatCard = ({ icon: Icon, label, value, bgColor, theme }) => (
  <div
    className={`p-6 rounded-2xl shadow-lg backdrop-blur-md bg-opacity-80 group hover:scale-105 transition transform duration-300 ${
      theme === "dark"
        ? "bg-gray-800/70 border border-gray-700 text-gray-100"
        : "bg-white/80 border border-gray-200 text-gray-800"
    }`}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`p-4 rounded-2xl text-white text-xl shadow-md ${bgColor}`}
      >
        <Icon />
      </div>
      <div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  const { role, theme } = useOutletContext();
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]); // <-- store user orders

  useEffect(() => {
    if (role === "admin") {
      Promise.all([
        axios.get(
          "https://price-tracker-for-local-markets-ser.vercel.app/admin/total-users",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          "https://price-tracker-for-local-markets-ser.vercel.app/admin/total-products",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          "https://price-tracker-for-local-markets-ser.vercel.app/admin/total-ads",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          "https://price-tracker-for-local-markets-ser.vercel.app/admin/total-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ])
        .then(([usersRes, productsRes, adsRes, ordersRes]) => {
          setStats({
            totalUsers: usersRes.data?.totalUsers || 0,
            totalProducts: productsRes.data?.totalProducts || 0,
            totalAds: adsRes.data?.totalAds || 0,
            totalOrders: ordersRes.data?.totalOrders || 0,
          });
        })
        .catch(console.error);
    } else if (role === "vendor" && user?.email) {
      Promise.all([
        axios.get(
          `https://price-tracker-for-local-markets-ser.vercel.app/dashboard/myproducts?email=${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `https://price-tracker-for-local-markets-ser.vercel.app/vendor/dashboard/Ads?email=${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ])
        .then(([productsRes, adsRes]) => {
          setStats({
            totalProducts: productsRes.data.length || 0,
            totalAds: adsRes.data.length || 0,
          });
        })
        .catch(console.error);
    } else if (role === "user" && user?.email) {
      // Fetch orders
      axios
        .get(
          `https://price-tracker-for-local-markets-ser.vercel.app/user/orders?email=${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setOrders(res.data); // store full orders
          setStats((prev) => ({ ...prev, totalOrders: res.data.length }));
        })
        .catch(console.error);

      // Fetch wishlist & saved ads
      Promise.all([
        axios.get(
          `https://price-tracker-for-local-markets-ser.vercel.app/user/watchlist?email=${user.email}`
        ),
      ])
        .then(([wishlistRes]) => {
          console.log(wishlistRes.data);
          setStats((prev) => ({
            ...prev,
            totalWishlist: wishlistRes.data.length,
          }));
        })
        .catch(console.error);
    }
  }, [role, user?.email, token]);

  let statsToShow = [];
  let dashboardTitle = "";

  if (role === "admin") {
    dashboardTitle = "🧮 Admin Dashboard Overview";
    statsToShow = [
      {
        icon: FaUsers,
        label: "Total Users",
        value: stats.totalUsers || 0,
        bgColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
      },
      {
        icon: FaBoxOpen,
        label: "Total Products",
        value: stats.totalProducts || 0,
        bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      },
      {
        icon: FaBullhorn,
        label: "Total Ads",
        value: stats.totalAds || 0,
        bgColor: "bg-gradient-to-r from-orange-400 to-pink-500",
      },
      {
        icon: FaShoppingCart,
        label: "Total Orders",
        value: stats.totalOrders || 0,
        bgColor: "bg-gradient-to-r from-purple-500 to-fuchsia-600",
      },
    ];
  } else if (role === "vendor") {
    dashboardTitle = "🏬 Vendor Dashboard";
    statsToShow = [
      {
        icon: FaBoxOpen,
        label: "My Products",
        value: stats.totalProducts || 0,
        bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      },
      {
        icon: FaBullhorn,
        label: "My Ads",
        value: stats.totalAds || 0,
        bgColor: "bg-gradient-to-r from-orange-400 to-pink-500",
      },
    ];
  } else if (role === "user") {
    statsToShow = [
      {
        icon: FaShoppingCart,
        label: "My Orders",
        value: stats.totalOrders || 0,
        bgColor: "bg-gradient-to-r from-purple-500 to-fuchsia-600",
      },
      {
        icon: FaBoxOpen,
        label: "Watchlist Items",
        value: stats.totalWishlist || 0,
        bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      },
    ];
  }

  return (
    <div
      className={`max-w-7xl mx-auto px-6 py-12 min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <h1 className="text-4xl font-extrabold text-center mb-12">
        {dashboardTitle}
      </h1>

      {role === "user" && (
        <div
          className={`text-center p-8 rounded-2xl shadow-lg max-w-lg mx-auto mb-8 ${
            theme === "dark"
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white/90 border border-gray-200"
          }`}
        >
          <img
            src={user?.photoURL}
            alt="Welcome"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-500 shadow-md"
          />
          <h2 className="text-3xl font-semibold mb-3">
            Welcome, {user?.displayName || "User"} 🎉
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Explore your account and discover what you can do here.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${
          role === "user" ? "3" : "4"
        } gap-6 mb-12`}
      >
        {statsToShow.map((stat) => (
          <StatCard key={stat.label} {...stat} theme={theme} />
        ))}
      </div>

      {/* User Orders List */}
      {/* {role === "user" && orders.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800/80 border border-gray-700" : "bg-white/90 border border-gray-200"}`}>
                <p><strong>Product:</strong> {order.productName}</p>
                <p><strong>Market:</strong> {order.marketName}</p>
                <p><strong>Amount:</strong> ${order.amount}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {order.date}</p>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DashboardHome;
