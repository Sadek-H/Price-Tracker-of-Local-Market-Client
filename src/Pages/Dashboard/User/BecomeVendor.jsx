import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { useOutletContext } from "react-router";

const BecomeVendor = () => {
  const { user, token } = useContext(AuthContext);
  const [marketName, setMarketName] = useState("");
  const [description, setDescription] = useState("");
  const { theme } = useOutletContext();

  const handleVendorRequest = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://price-tracker-of-market-server.onrender.com/become-vendor",
        {
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          marketName,
          description,
          status: "pending",
          role: "vendor-request",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.insertedId) {
<<<<<<< HEAD
        console.log(res.data);

=======
>>>>>>> c1114fc (add theme)
        Swal.fire("Success", "Vendor request submitted!", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <motion.div
      className={`max-w-2xl mx-auto px-4 py-10 ${
        theme === "dark" ? "text-gray-100" : "text-gray-900"
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
        Become a Vendor
      </h2>

      <form
        onSubmit={handleVendorRequest}
        className={`p-6 rounded-xl shadow-lg space-y-4 transition-colors
          ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={user?.displayName}
            readOnly
            className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2
              ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-green-400"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={user?.email}
            readOnly
            className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2
              ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-green-400"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Market Name</label>
          <input
            type="text"
            value={marketName}
            onChange={(e) => setMarketName(e.target.value)}
            required
            placeholder="e.g. Karwan Bazar"
            className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2
              ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-green-400"}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Why do you want to become a vendor?
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            placeholder="Write a short reason and your experience..."
            className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 resize-none
              ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-green-400"}`}
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-md font-semibold transition-colors
            ${theme === "dark" ? "bg-green-600 hover:bg-green-700 text-gray-100" : "bg-green-500 hover:bg-green-600 text-white"}`}
        >
          Submit Request
        </button>
      </form>
    </motion.div>
  );
};

export default BecomeVendor;
