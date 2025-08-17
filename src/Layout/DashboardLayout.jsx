import React, { useEffect, useState, useContext } from "react";
import { NavLink, Outlet } from "react-router";
import axios from "axios";
import Lottie from "lottie-react";
import { ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

import Navbar from "../Components/Navbar";
import Footer from "../Pages/Home/Footer";
import loaderlottie from "../assets/looties/Loading.json";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, token } = useContext(AuthContext);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Theme persistence
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => localStorage.setItem("theme", theme), [theme]);

  // Fetch user role
  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`https://price-tracker-for-local-markets-ser.vercel.app/users/role/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRole(res.data.role))
      .catch((err) => console.error("❌ Role fetch error:", err))
      .finally(() => setLoading(false));
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lottie animationData={loaderlottie} loop className="max-w-[450px] w-full" />
      </div>
    );
  }

  // Sidebar links configuration
  const linksConfig = {
    user: [
      { to: "/dashboard/watchlist", label: "📌 Manage Watchlist" },
      { to: "/dashboard/my-orders", label: "🛒 My Order List" },
      { to: "/dashboard/pricetrends", label: "📈 View Price Trends" },
      { to: "/dashboard/become-vendor", label: "⚙️ Become a Vendor" },
    ],
    vendor: [
      { to: "/dashboard/add-product", label: "➕ Add Product" },
      { to: "/dashboard/my-products", label: "📦 My Products" },
      { to: "/dashboard/add-advertisement", label: "📢 Add Advertisement" },
      { to: "/dashboard/my-ads", label: "🧾 My Advertisements" },
    ],
    admin: [
      { to: "/dashboard/users", label: "👥 All Users" },
      { to: "/dashboard/all-products", label: "📋 All Products" },
      { to: "/dashboard/all-ads", label: "📢 All Advertisements" },
      { to: "/dashboard/all-orders", label: "🛍 All Orders" },
      { to: "/dashboard/all-vendors", label: "🧾 Vendor Requests" },
    ],
  };

  const baseClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300";
  const activeClass = theme === "dark" ? "bg-green-700 text-white" : "bg-green-200 text-green-900";

  const renderLinks = () =>
    linksConfig[role]?.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`}
        aria-label={link.label}
      >
        {link.label}
      </NavLink>
    ));

  return (
    <div className={theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}>
      <ToastContainer autoClose={900} position="top-right" theme={theme} />

      {/* Navbar */}
      <Navbar theme={theme} setTheme={setTheme} />

      {/* Mobile Dashboard Toggle */}
      <div className="md:hidden p-2 text-right">
        <button
          onClick={() => setMenuOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
        >
          Dashboard Menu
        </button>
      </div>

      <div className="flex min-h-screen relative">
        {/* Mobile Backdrop */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 z-50 md:z-auto 
            ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} 
            shadow-lg md:rounded-r-2xl p-6 transition-all duration-300 ease-in-out
            ${menuOpen ? "left-0 w-72 min-h-screen" : "-left-full"}
            md:w-72 md:min-h-screen`}
        >
          {/* Close button for mobile */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold">📊 Dashboard</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-red-500"
              aria-label="Close Dashboard Menu"
            >
              <FaTimes />
            </button>
          </div>

          {/* Desktop heading */}
          <h2 className="hidden md:block text-2xl font-bold mb-6">📊 Dashboard</h2>

          {/* Links */}
          <nav className="flex flex-col gap-2">{renderLinks()}</nav>

          {/* Back Home */}
          <NavLink
            to="/"
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            🏠 Back to Home
          </NavLink>

          {/* Footer info */}
          <span className="text-xs text-gray-400 block mt-6">Logged in as: {user?.email}</span>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 bg-transparent">
          <Outlet context={{ role, theme }} />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
