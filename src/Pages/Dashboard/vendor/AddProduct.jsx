import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import DatePicker from "react-datepicker";
import axios from "axios";
import Swal from "sweetalert2";
import { useOutletContext } from "react-router";

const AddProduct = () => {
  const { user, token } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { theme } = useOutletContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const priceDate = [
      {
        date: selectedDate.toISOString().split("T")[0],
        price: parseFloat(data.price),
      },
    ];

    const productData = {
      vendorEmail: data.vendorEmail,
      vendorName: data.vendorName,
      marketName: data.marketName,
      date: data.date || selectedDate.toISOString().split("T")[0],
      description: data.description,
      itemName: data.itemName,
      imageUrl: data.imageUrl,
      itemDescription: data.itemDescription || "",
      status: "pending",
      prices: priceDate,
    };


    axios
      .post(
        "https://price-tracker-for-local-markets-ser.vercel.app/dashboard/add-product",
        productData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire("Success", "Product added successfully!", "success");
          form.reset();
        }
      });
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-8 rounded-lg shadow-md transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100 shadow-lg"
          : "bg-white text-gray-900 shadow-md"
      }`}
    >
      <h2
        className={`text-3xl font-semibold mb-6 text-center border-b pb-2 ${
          theme === "dark" ? "text-green-400 border-gray-700" : "text-green-700 border-gray-200"
        }`}
      >
        🛒 Submit Daily Market Price
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Vendor Email - read-only */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">📧 Vendor Email</label>
          <input
            type="email"
            className={`input input-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-100"
            }`}
            name="vendorEmail"
            value={user?.email || ""}
            readOnly
            required
          />
        </div>

        {/* Vendor Name - read-only */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">🧑‍🌾 Vendor Name</label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-gray-100"
            }`}
            name="vendorName"
            value={user?.displayName || "Unknown Vendor"}
            readOnly
          />
        </div>

        {/* Market Name */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">🏪 Market Name</label>
          <input
            type="text"
            name="marketName"
            className={`input input-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : ""
            }`}
            required
            placeholder="e.g., Dhaka New Market"
          />
        </div>

        {/* Date */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">📅 Date</label>
          <DatePicker
            className={`input input-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : ""
            }`}
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>

        {/* Market Description */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">📝 Market Description</label>
          <textarea
            name="description"
            rows={3}
            className={`textarea textarea-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : ""
            }`}
            required
            placeholder="Where is the market located? When was it established? Any other info."
          />
        </div>

        {/* Item Name */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">🥦 Item Name</label>
          <input
            type="text"
            name="itemName"
            className={`input input-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : ""
            }`}
            required
            placeholder="e.g., Onion"
          />
        </div>

        {/* Price per Unit */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">💵 Price per Unit (৳)</label>
          <input
            type="number"
            name="price"
            className={`input input-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : ""
            }`}
            required
            min="0"
            step="0.01"
            placeholder="e.g., 30"
          />
        </div>

        {/* Product Image */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">🖼️ Product Image URL</label>
          <input
            type="url"
            name="imageUrl"
            className={`input input-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : ""
            }`}
            required
            placeholder="Image URL"
          />
        </div>

        {/* Item Description */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">
            📝 Item Description{" "}
            <span className="text-sm text-gray-400">(Optional)</span>
          </label>
          <textarea
            name="itemDescription"
            rows={2}
            className={`textarea textarea-bordered w-full ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-200" : ""
            }`}
            placeholder="Freshness, quality, notes, etc."
          />
        </div>

        {/* Hidden Status */}
        <input type="hidden" name="status" value="pending" />

        {/* Submit */}
        <div className="col-span-2">
          <button
            type="submit"
            className={`btn w-full text-lg ${
              theme === "dark"
                ? "btn-success bg-green-600 hover:bg-green-500 text-white"
                : "btn-success"
            }`}
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
