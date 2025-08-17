import React, { useContext, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signInUser, signInWithGoogle, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme } = useOutletContext();

  const handleSignIn = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData.entries());

    signInUser(email, password).then((res) => {
      if (res.user) {
        toast.success("User Login Successfully");
        navigate("/");
      }
    });
  };

  const handleSignInGoogle = () => {
    signInWithGoogle().then((res) => {
      const user = res.user;
<<<<<<< HEAD
      console.log(user);
=======
>>>>>>> c1114fc (add theme)
      if (user) {
        toast.success("User Login Successfully");
        axios.post(
          "https://price-tracker-of-market-server.onrender.com/users",
          {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            role: "user",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate("/");
      }
    });
  };

  const bgClass =
    theme === "dark"
      ? "bg-gray-900 text-gray-100"
      : "bg-gradient-to-tr from-green-100 via-white to-green-50";

  const cardBg =
    theme === "dark" ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90";

  const inputClass =
    theme === "dark"
      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-300 focus:ring-green-500"
      : "bg-gray-100 border-green-300 text-gray-900 placeholder-gray-500 focus:ring-green-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${bgClass}`}
    >
      <div className="flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl">
        {/* Left Section - Illustration */}
        <div
          className={`hidden md:flex md:w-1/2 items-center justify-center p-8 ${
            theme === "dark" ? "bg-gray-700" : "bg-green-100"
          }`}
        >
          <img
            src="/assets/bg.svg"
            alt="Illustration"
            className="max-w-md drop-shadow-xl"
          />
        </div>

        {/* Right Section - Login Form */}
        <div className={`w-full md:w-1/2 p-8 md:p-12 rounded-tr-3xl rounded-br-3xl ${cardBg}`}>
          <div className="text-center mb-6">
            <img src="/assets/avatar.svg" alt="Logo" className="w-12 mx-auto mb-2" />
            <h2 className="text-3xl font-bold text-green-600">Welcome Back!</h2>
            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} text-sm`}>
              Please login to your account
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${inputClass}`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Password
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-xl pr-10 shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${inputClass}`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-green-500"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                to="/forgotpassword"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-base font-semibold shadow-md transition duration-200"
            >
              Login
            </button>

            {/* Register Prompt */}
            <p className={`text-center text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className={`divider my-6 ${theme === "dark" ? "border-gray-600" : ""}`}>OR</div>

          {/* Google Login */}
          <button
            onClick={handleSignInGoogle}
            className={`w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition duration-150`}
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
