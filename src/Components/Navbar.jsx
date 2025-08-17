import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signout } = useContext(AuthContext);

  const handlesignout = () => {
    signout().then(() => {
      toast.success("User LogOut Successfully");
      setIsOpen(false);
    });
  };

  const handletoggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav
      className={`navbar shadow-md sticky top-0 z-50 px-4 lg:px-10 font-[Inter] ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-[#F6F6F6] text-green-600"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Mobile Header */}
        <div className="flex justify-between items-center w-full lg:hidden">
          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="transition"
            aria-label="Open menu"
            style={{ color: theme === "light" ? "#37A851" : "#FFD500" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo on the Right */}
          <div
            className="flex items-center gap-2 text-xl font-extrabold"
            style={{ color: theme === "light" ? "#37A851" : "#FFD500" }}
          >
            <img
              className="w-8 h-8 border-1 rounded-b-full"
              src="https://i.ibb.co/7LM7D10/vegetable.png"
              alt="logo"
            />
            <Link to="/" className="text-lg font-bold">
              কাঁচাবাজার
            </Link>
          </div>
        </div>

        {/* Logo for Desktop */}
        <div
          className="navbar-start hidden lg:flex items-center gap-2 text-xl font-extrabold"
          style={{ color: theme === "light" ? "#37A851" : "#FFD500" }}
        >
          <img
            className="w-8 h-8 border-1 rounded-b-full"
            src="https://i.ibb.co/7LM7D10/vegetable.png"
            alt="logo"
          />
          <Link to="/" className="text-lg md:text-2xl font-bold">
            কাঁচাবাজার
          </Link>
        </div>

        {/* Centered Desktop Links */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 gap-6 items-center">
          {["/", "/products", "/dashboard"].map((path, i) => {
            const label = ["Home", "All Products", "Dashboard"][i];
            return (
              <Link
                key={i}
                to={path}
                className="text-lg transition"
                style={{ color: theme === "light" ? "#37A851" : "#FFD500" }}
                onMouseOver={(e) =>
                  (e.target.style.color = theme === "light" ? "#FFD500" : "#37A851")
                }
                onMouseOut={(e) =>
                  (e.target.style.color = theme === "light" ? "#37A851" : "#FFD500")
                }
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth + Theme */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Toggle */}
          <label className="swap swap-rotate cursor-pointer">
            <input
              onChange={handletoggle}
              type="checkbox"
              className="theme-controller hidden"
            />
            {/* Sun */}
            <div
              className={`swap-off p-2 rounded-full flex items-center justify-center transition ${
                theme === "light" ? "bg-yellow-400" : "bg-gray-700"
              }`}
            >
              <svg
                className="h-6 w-6 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
            </div>
            {/* Moon */}
            <div
              className={`swap-on p-2 rounded-full flex items-center justify-center transition ${
                theme === "dark" ? "bg-gray-700" : "bg-yellow-400"
              }`}
            >
              <svg
                className="h-6 w-6 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </div>
          </label>

          {/* Auth Buttons */}
          {user ? (
            <>
              <img
                className="w-8 h-8 rounded-full"
                src={user.photoURL}
                alt={user.displayName}
              />
              <button
                onClick={handlesignout}
                className="px-4 py-1.5 transition rounded-full font-semibold text-sm"
                style={{
                  border: "1px solid #FF8A3D",
                  color: "#FF8A3D",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#FF8A3D";
                  e.target.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#FF8A3D";
                }}
              >
                LogOut
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 transition rounded-full font-semibold text-sm"
                style={{
                  border: "1px solid #37A851",
                  color: "#37A851",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 transition rounded-full font-semibold text-sm bg-green-600 text-white hover:bg-yellow-400"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className={`w-72 shadow-xl h-full p-5 relative ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-[#F6F6F6] text-green-600"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="transition"
                  style={{ color: theme === "light" ? "#37A851" : "#FFD500" }}
                >
                  <RxCross2 className="inline-block mb-2" size={22} />{" "}
                  <span className="text-xl">Close</span>
                </button>
              </div>

              {/* Links */}
              <ul className="space-y-4 text-base font-medium">
                <li>
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" onClick={() => setIsOpen(false)}>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
              </ul>

              <hr className="my-6" style={{ borderColor: theme === "light" ? "#C8F5C0" : "#555" }} />

              {/* Theme Toggle */}
              <div className="mb-4">
                <label className="swap swap-rotate cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={handletoggle}
                    className="theme-controller hidden"
                  />
                  <div
                    className={`swap-off p-2 rounded-full flex items-center justify-center transition ${
                      theme === "light" ? "bg-yellow-400" : "bg-gray-700"
                    }`}
                  >
                    Sun
                  </div>
                  <div
                    className={`swap-on p-2 rounded-full flex items-center justify-center transition ${
                      theme === "dark" ? "bg-gray-700" : "bg-yellow-400"
                    }`}
                  >
                    Moon
                  </div>
                </label>
              </div>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-4">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.photoURL}
                    alt={user.displayName}
                  />
                  <button
                    onClick={handlesignout}
                    className="px-4 py-1.5 transition rounded-full font-semibold text-sm"
                    style={{
                      border: "1px solid #FF8A3D",
                      color: "#FF8A3D",
                    }}
                  >
                    LogOut
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2 transition rounded-full"
                    style={{
                      border: "1px solid #37A851",
                      color: "#37A851",
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2 transition rounded-full text-white"
                    style={{
                      backgroundColor: "#37A851",
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Backdrop */}
            <div
              className="flex-1 bg-black bg-opacity-30"
              onClick={() => setIsOpen(false)}
            ></div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
