import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { useOutletContext } from "react-router";

const Allads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext); // ✅ fixed
  const { theme } = useOutletContext(); // light / dark

  // Load all ads
  useEffect(() => {
    axios
      .get("https://price-tracker-of-market-server.onrender.com/admin/ads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [token]);

  const handleapprove = (id) => {
    axios
      .put(
        `https://price-tracker-of-market-server.onrender.com/admin/update-ads/${id}`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.modifiedCount) {
          setAds((prevAds) =>
            prevAds.map((ad) =>
              ad._id === id ? { ...ad, status: "approved" } : ad
            )
          );
          toast.success("Advertisement approved!");
        }
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
<<<<<<< HEAD
          .delete(`https://price-tracker-of-market-server.onrender.com/admin/delete-ads/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
=======
          .delete(
            `https://price-tracker-for-local-markets-ser.vercel.app/admin/delete-ads/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
>>>>>>> c1114fc (add theme)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
              toast.success("Advertisement deleted!");
            }
          });
      }
    });
  };

  return (
<<<<<<< HEAD
    <div className="max-w-7xl overflow-x-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
=======
    <div
      className={`max-w-7xl p-4 mx-auto ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
>>>>>>> c1114fc (add theme)
        📢 All Advertisements
      </h2>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-600"></div>
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center text-gray-400 text-xl mt-10">
          ❌ No advertisements found!
        </div>
      ) : (
<<<<<<< HEAD
        <table className="table w-full bg-white shadow rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Short Desc</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad, index) => (
              <tr key={ad._id} className="hover">
                <td>{index + 1}</td>
                <td>{ad.title}</td>
                <td>{ad.description?.slice(0, 40)}...</td>
                <td>
=======
        <>
          {/* TABLE FOR md and UP */}
          <table
            className={`hidden md:table w-full shadow rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            <thead className="bg-green-100">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Short Desc</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, index) => (
                <tr
                  key={ad._id}
                  className={`hover ${
                    theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>{ad.title}</td>
                  <td>{ad.description?.slice(0, 40)}...</td>
                  <td>
                    <span
                      className={`badge ${
                        ad.status === "approved"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>
                  <td>
                    {ad.status === "pending" ? (
                      <button
                        onClick={() => handleapprove(ad._id)}
                        className="btn btn-xs btn-success"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        className="btn btn-xs btn-warning"
                        title="Revert to Pending"
                        disabled
                      >
                        <FaTimes />
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(ad._id)}
                      className="btn btn-xs btn-error"
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* CARDS FOR SMALL SCREENS */}
          <div className="md:hidden space-y-4">
            {ads.map((ad, index) => (
              <div
                key={ad._id}
                className={`border rounded-lg shadow p-4 ${
                  theme === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-lg">
                    {index + 1}. {ad.title}
                  </div>
>>>>>>> c1114fc (add theme)
                  <span
                    className={`badge ${
                      ad.status === "approved"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {ad.status}
                  </span>
<<<<<<< HEAD
                </td>
                <td>
=======
                </div>
                <p
                  className={`mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {ad.description?.slice(0, 80)}...
                </p>
                <div className="flex space-x-2">
>>>>>>> c1114fc (add theme)
                  {ad.status === "pending" ? (
                    <button
                      onClick={() => handleapprove(ad._id)}
                      className="btn btn-xs btn-success"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                  ) : (
                    <button
                      className="btn btn-xs btn-warning"
                      title="Revert to Pending"
                      disabled
                    >
                      <FaTimes />
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="btn btn-xs btn-error"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Allads;
