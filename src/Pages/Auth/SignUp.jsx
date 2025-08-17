import React, { useState, useContext } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";
import registerlottie from "../../assets/looties/register.json";

const SignUp = () => {
  const { createUser, profile, setUser, user, signInWithGoogle, token } =
    useContext(AuthContext);
  const { theme } = useOutletContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Handle regular sign-up
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password, name, photo } = Object.fromEntries(formData.entries());

    const passtest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passtest.test(password)) {
      setError(
        "Password must be at least 6 characters, include uppercase, lowercase and a number."
      );
      return;
    }

    createUser(email, password)
      .then((res) => {
        if (res.user) {
          // Update Firebase profile
          profile({ displayName: name, photoURL: photo });
          setUser({ ...user, displayName: name, photoURL: photo });
          setError("");
          toast.success("User Registered Successfully");

          // Save user to server
          axios
            .post(
              "https://price-tracker-for-local-markets-ser.vercel.app/users",
              { name, email, photo, role: "user" },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .catch((err) => console.error("Server Error:", err));

          navigate("/");
        }
      })
      .catch((err) => setError(err.message));
  };

  // Handle Google sign-in
  const handleSignInGoogle = () => {
    signInWithGoogle()
      .then((res) => {
        const gUser = res.user;
        if (gUser) {
          Swal.fire({
            title: "Google Sign In Successful",
            icon: "success",
            timer: 800,
            showConfirmButton: false,
            background: theme === "dark" ? "#1f2937" : "#e6f9ed",
            color: theme === "dark" ? "#f3f4f6" : "#166534",
            iconColor: theme === "dark" ? "#22c55e" : "#22c55e",
            customClass: { popup: "rounded-xl shadow-lg", title: "font-bold text-lg" },
          });

          axios
            .post(
              "https://price-tracker-for-local-markets-ser.vercel.app/users",
              { name: gUser.displayName, email: gUser.email, photo: gUser.photoURL, role: "user" },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .catch((err) => console.error("Server Error:", err));

          navigate("/");
        }
      })
      .catch((err) => setError(err.message));
  };

  // Theme-based styling
  const bgClass = theme === "dark"
    ? "bg-gray-900 text-gray-100"
    : "bg-gradient-to-tr from-green-100 via-white to-green-50";

  const cardBg = theme === "dark" ? "bg-gray-800 bg-opacity-90" : "bg-white bg-opacity-90";

  const inputClass = theme === "dark"
    ? "input input-bordered w-full border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-300 focus:ring-green-500 rounded-xl"
    : "input input-bordered w-full border-green-400 bg-white text-gray-900 placeholder-gray-500 focus:ring-green-400 rounded-xl";

  return (
    <div className={`min-h-screen flex flex-col-reverse md:flex-row items-center justify-around p-4 md:p-8 ${bgClass}`}>
      
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full md:w-1/2 max-w-md p-8 rounded-3xl z-10 ${cardBg}`}
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-green-600 mb-6">
          Register Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Name
            </label>
            <input type="text" name="name" required placeholder="Enter your name" className={inputClass} />
          </div>

          {/* Photo URL */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Photo URL
            </label>
            <input type="text" name="photo" required placeholder="Paste profile photo URL" className={inputClass} />
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Email
            </label>
            <input type="email" name="email" required placeholder="Enter your email" className={inputClass} />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <input type="password" name="password" required placeholder="Enter your password" className={inputClass} />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button type="submit" className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition duration-200">
            Register
          </button>

          <p className={`text-center text-sm mt-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Already have an account? <Link to="/login" className="text-green-600 font-semibold hover:underline">Login</Link>
          </p>
        </form>

        <div className={`divider my-6 ${theme === "dark" ? "border-gray-600" : ""}`}>OR</div>

        {/* Google Sign Up */}
        <button
          onClick={handleSignInGoogle}
          className="w-full btn bg-white text-black border border-gray-300 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2 transition"
        >
          <svg aria-label="Google logo" width="16" height="16" viewBox="0 0 512 512">
            <g>
              <path d="m0 0H512V512H0" fill="#fff" />
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
            </g>
          </svg>{" "}
          Sign up with Google
        </button>
      </motion.div>

      {/* Lottie Animation */}
      <div className="w-40 md:w-1/2 mt-8 md:mt-0 md:mb-14 flex items-center justify-center">
        <Lottie animationData={registerlottie} loop className="max-w-[550px] w-full" />
      </div>
    </div>
  );
};

export default SignUp;
