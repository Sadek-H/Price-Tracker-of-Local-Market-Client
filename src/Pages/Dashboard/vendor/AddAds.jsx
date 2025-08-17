import axios from "axios";
import React, { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { useOutletContext } from "react-router";

const AddAds = () => {
  const { user, token } = useContext(AuthContext);
  const { theme } = useOutletContext(); // "light" or "dark"

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());
<<<<<<< HEAD
    console.log(data);
=======

>>>>>>> c1114fc (add theme)
    const adData = {
      userEmail: user?.email,
      title: data.title,
      description: data.description,
      image: data.image,
      status: "pending",
    };

    axios
      .post("https://price-tracker-of-market-server.onrender.com/dashboard/add-advertisement", adData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire("Success", "Advertisement added successfully!", "success");
          form.reset();
        }
      });
  };

  // Theme-based classes
  const containerClass = theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
  const inputClass =
    theme === "dark"
      ? "input input-bordered w-full bg-gray-800 text-gray-100 border-gray-700 focus:border-green-400 focus:ring focus:ring-green-300"
      : "input input-bordered w-full";
  const textareaClass =
    theme === "dark"
      ? "textarea textarea-bordered w-full bg-gray-800 text-gray-100 border-gray-700 focus:border-green-400 focus:ring focus:ring-green-300"
      : "textarea textarea-bordered w-full";

  return (
    <div className={`max-w-3xl mx-auto p-8 rounded-xl shadow-lg ${containerClass}`}>
      <h2 className="text-3xl font-bold text-center mb-6 border-b pb-2 text-green-500">
        📢 Post New Advertisement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ad Title */}
        <div>
          <label className="block font-medium mb-1">📢 Ad Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Special Discount on Onions"
            className={inputClass}
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium mb-1">📝 Short Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Write a short promotional message..."
            className={textareaClass}
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-medium mb-1">🖼️ Banner / Image URL</label>
          <input
            type="text"
            name="image"
            placeholder="Enter image URL..."
            className={inputClass}
            required
          />
        </div>

        {/* Hidden Status */}
        <input type="hidden" name="status" value="pending" />

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="btn btn-success w-full text-lg hover:scale-105 transition-transform duration-200"
          >
            ✅ Submit Advertisement
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAds;
