import React, { useEffect, useState, useContext } from "react";
import Navbar from "../Components/Navbar";
import { NavLink, Outlet } from "react-router";
import axios from "axios";
import loaderlottie from "../assets/looties/Loading.json";
import { AuthContext } from "../context/AuthContext";
import Lottie from "lottie-react";
import { ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import Footer from "../Pages/Home/Footer";

const DashboardLayout = () => {
  const { user, token } = useContext(AuthContext);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Theme persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user?.email) {
      axios
<<<<<<< HEAD
        .get(`https://price-tracker-of-market-server.onrender.com/users/role/${user.email}`)
=======
        .get(
          `https://price-tracker-for-local-markets-ser.vercel.app/users/role/${user.email}`
        )
>>>>>>> c1114fc (add theme)
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
<<<<<<< HEAD
        .catch((err) => console.log(err));
=======
        .catch((err) => err);
>>>>>>> c1114fc (add theme)
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lottie
          animationData={loaderlottie}
          loop
          className="max-w-[450px] w-full"
        />
      </div>
    );
  }

  // Sidebar Links
  const renderLinks = () => {
    const baseClass =
      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300";
    const activeClass =
      theme === "dark"
        ? "bg-green-700 text-white"
        : "bg-green-200 text-green-900";

    if (role === "user") {
      return (
        <>
          <NavLink
            to="/dashboard/watchlist"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            📌 Manage Watchlist
          </NavLink>
          <NavLink
            to="/dashboard/my-orders"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            🛒 My Order List
          </NavLink>
          <NavLink
            to="/dashboard/pricetrends"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            📈 View Price Trends
          </NavLink>
          <NavLink
            to="/dashboard/become-vendor"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            ⚙️ Become a Vendor
          </NavLink>
        </>
      );
    }

    if (role === "vendor") {
      return (
        <>
          <NavLink
            to="/dashboard/add-product"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            ➕ Add Product
          </NavLink>
          <NavLink
            to="/dashboard/my-products"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            📦 My Products
          </NavLink>
          <NavLink
            to="/dashboard/add-advertisement"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            📢 Add Advertisement
          </NavLink>
          <NavLink
            to="/dashboard/my-ads"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            🧾 My Advertisements
          </NavLink>
        </>
      );
    }

    if (role === "admin") {
      return (
        <>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            👥 All Users
          </NavLink>
          <NavLink
            to="/dashboard/all-products"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            📋 All Products
          </NavLink>
          <NavLink
            to="/dashboard/all-ads"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            📢 All Advertisements
          </NavLink>
          <NavLink
            to="/dashboard/all-orders"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            🛍 All Orders
          </NavLink>
          <NavLink
            to="/dashboard/all-vendors"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : "hover:bg-green-100"}`
            }
          >
            🧾 Vendor Requests
          </NavLink>
        </>
      );
    }
  };

  return (
    <div
      className={
        theme === "dark"
          ? "bg-gray-950 text-white"
          : "bg-gray-50 text-gray-900"
      }
    >
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
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 z-50 md:z-auto 
          ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} 
          shadow-lg md:rounded-r-2xl p-6 transition-all duration-300 ease-in-out
          ${menuOpen ? "left-0 w-72 min-h-screen" : "-left-full"}
          md:w-72 md:min-h-screen`}
        >
          {/* Close for mobile */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold">📊 Dashboard</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-red-500"
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
          <span className="text-xs text-gray-400 block mt-6">
            Logged in as: {user?.email}
          </span>
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
