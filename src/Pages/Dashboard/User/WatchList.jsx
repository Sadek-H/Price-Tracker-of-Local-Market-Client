import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { FaTrashAlt } from "react-icons/fa";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const { theme } = useOutletContext();

  useEffect(() => {
    if (!user?.email || !token) {
      setWatchlist([]);
      setLoading(false);
      return;
    }
    fetchWatchlist();
  }, [user, token]);

  const fetchWatchlist = () => {
    setLoading(true);
    axios

      .get("https://price-tracker-for-local-markets-ser.vercel.app/watchlist", {
        headers: { Authorization: `Bearer ${token}` },

      })
      .then((res) => {
        const filtered = res.data.filter((item) => item.userEmail === user.email);
        setWatchlist(filtered);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to fetch watchlist", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Remove this item from your watchlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios

         

          .delete(`https://price-tracker-for-local-markets-ser.vercel.app/watchlist/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
 
          })
          .then(() => {
            setWatchlist((prev) => prev.filter((item) => item._id !== id));
            Swal.fire("Removed!", "Item has been removed.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to remove item", "error");
          });
      }
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-green-600 text-lg font-semibold">Loading watchlist...</span>
      </div>
    );

  return (
    <div className={`max-w-6xl mx-auto p-6 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">📌 My Watchlist</h2>
        <button
          onClick={() => navigate("/products")}
          className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Add More
        </button>
      </div>

      {watchlist.length === 0 ? (
        <p className={`text-center py-10 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Your watchlist is empty.
        </p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => {
            const latestPrice =
              item.prices && item.prices.length > 0
                ? [...item.prices].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
                : null;

            return (
              <div
                key={item._id}
                className={`p-5 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{item.itemName}</h3>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 rounded-full hover:bg-red-600 hover:text-white text-red-500 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                <p className={`mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Market: {item.marketName || "-"}
                </p>
                <p className={`mb-1 font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
                  Latest Price: {latestPrice ? latestPrice.price : "-"}
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  Updated: {latestPrice ? new Date(latestPrice.date).toLocaleDateString() : "-"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchList;
