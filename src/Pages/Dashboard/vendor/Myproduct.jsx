import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const [rejection, setRejection] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token } = useContext(AuthContext);
  const { theme } = useOutletContext();
  const navigate = useNavigate();

  // Fetch rejection reasons
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://price-tracker-for-local-markets-ser.vercel.app/dashboard/rejectProduct", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data && setRejection(res.data));
  }, [token]);

  // Fetch user's products
  useEffect(() => {
    if (!user?.email) return;
    axios
      .get(
        `https://price-tracker-for-local-markets-ser.vercel.app/dashboard/my-products?vendorEmail=${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
  }, [user?.email, token]);

  // Delete product
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://price-tracker-for-local-markets-ser.vercel.app/dashboard/deleteProduct/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setProducts((prev) => prev.filter((p) => p._id !== id));
              toast.success("✅ Product deleted successfully!");
            }
          });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-50"></div>
        <p className="text-xl font-semibold text-green-600">
          Fetching your products...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
        📦 My Submitted Products
      </h2>

      {/* TABLE (desktop) */}
      <div
        className={`hidden lg:block overflow-x-auto rounded-xl shadow-lg border ${
          theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <table className="table w-full text-sm">
          <thead
            className={`text-sm font-semibold ${
              theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-green-100 text-green-800"
            }`}
          >
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Market</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr
                key={p._id}
                className={`transition-colors hover:${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <td className="font-medium">{idx + 1}</td>
                <td>{p.itemName}</td>
                <td>{p.marketName}</td>
                <td>৳{p.prices?.[p.prices.length - 1]?.price}/kg</td>
                <td>{p.date}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : p.status === "rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.status === "rejected" && (
                    <p className="text-xs text-red-500 mt-1 italic">
                      Reason: {rejection.find((r) => r.productId === p._id)?.reason || "No reason provided"}
                    </p>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/dashboard/update-product/${p._id}`)}
                    className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-xs bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-400">No products found.</div>
        )}
      </div>

      {/* CARDS (mobile) */}
      <div className="lg:hidden space-y-6">
        {products.map((p, idx) => (
          <div
            key={p._id}
            className={`border rounded-xl shadow p-5 transition ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">
                {idx + 1}. {p.itemName}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  p.status === "approved"
                    ? "bg-green-200 text-green-800"
                    : p.status === "rejected"
                    ? "bg-red-200 text-red-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {p.status}
              </span>
            </div>
            <p className="mb-1">
              <strong>Market:</strong> {p.marketName}
            </p>
            <p className="mb-1">
              <strong>Price:</strong> ৳{p.prices?.[p.prices.length - 1]?.price}/kg
            </p>
            <p className="mb-2">
              <strong>Date:</strong> {p.date}
            </p>
            {p.status === "rejected" && (
              <p className="text-red-400 italic mb-3 text-sm">
                Reason: {rejection.find((r) => r.productId === p._id)?.reason || "No reason provided"}
              </p>
            )}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate(`/dashboard/update-product/${p._id}`)}
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-400">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default MyProduct;
