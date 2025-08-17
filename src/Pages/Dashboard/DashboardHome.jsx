import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useOutletContext } from "react-router";
import { FaUsers, FaBoxOpen, FaBullhorn, FaShoppingCart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
        .catch((error) => console.error("Admin stats fetch error:", error));
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
        .catch((error) => console.error("Vendor stats fetch error:", error));
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
  }

  const chartData = statsToShow.map((s) => ({
    name: s.label,
    value: s.value,
  }));

  return (
    <div
      className={`max-w-7xl mx-auto px-6 py-12 min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-gray-50 to-white text-gray-800"
      }`}
    >
      <h1 className="text-4xl font-extrabold text-center mb-12">
        {dashboardTitle}
      </h1>

      {role === "user" ? (
        <div
          className={`text-center p-8 rounded-2xl shadow-lg max-w-lg mx-auto ${
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
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsToShow.map((stat) => (
              <StatCard key={stat.label} {...stat} theme={theme} />
            ))}
          </div>

          {/* Chart Section */}
          <div
            className={`mt-12 p-8 rounded-2xl shadow-lg ${
              theme === "dark"
                ? "bg-gray-800/90 border border-gray-700"
                : "bg-white/95 border border-gray-200"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">📊 Stats Overview</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#444" : "#ddd"}
                />
                <XAxis
                  dataKey="name"
                  stroke={theme === "dark" ? "#aaa" : "#333"}
                />
                <YAxis stroke={theme === "dark" ? "#aaa" : "#333"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#333" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    borderRadius: "10px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={theme === "dark" ? "#60a5fa" : "#2563eb"}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
