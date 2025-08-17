import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import { useOutletContext } from "react-router";

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const { token } = useContext(AuthContext);
  const { theme } = useOutletContext(); 

  useEffect(() => {
    axios
      .get("https://price-tracker-for-local-markets-ser.vercel.app/dashboard/my-ads", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch(() => {
        setAds([]);
        setLoading(false);
      });
  }, [token]);

  const handleEditClick = (ad) => {
    setEditingAd(ad);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://price-tracker-for-local-markets-ser.vercel.app/dashboard/delete-ads/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
              Swal.fire("Deleted!", "Your advertisement has been deleted.", "success");
            }
          });
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const addata = {
      title: data.title,
      description: data.description,
      image: data.image,
      status: "pending",
    };

    axios
      .put(
        `https://price-tracker-for-local-markets-ser.vercel.app/dashboard/update-ads/${editingAd._id}`,
        addata,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          setAds((preAds) =>
            preAds.map((ad) => (ad._id === editingAd._id ? { ...ad, ...addata } : ad))
          );
        }
      });

    setShowFormModal(false);
  };

  const containerClass = theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
  const cardClass = theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const inputClass = theme === "dark" ? "input input-bordered w-full bg-gray-700 text-gray-100 border-gray-600" : "input input-bordered w-full";
  const textareaClass = inputClass + " resize-none";

  return (
    <div className={`max-w-5xl mx-auto p-6 shadow rounded ${containerClass}`}>
      <h2 className="text-2xl font-bold mb-4">📢 My Advertisements</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64 space-x-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden sm:block overflow-x-auto">
            <table className={`table w-full ${theme === "dark" ? "text-gray-100" : ""}`}>
              <thead>
                <tr>
                  <th>Ad Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad._id}>
                    <td>{ad.title}</td>
                    <td>{ad.description}</td>
                    <td>{ad.status}</td>
                    <td className="flex gap-2">
                      <button className="btn btn-sm btn-info" onClick={() => handleEditClick(ad)}>Update</button>
                      <button className="btn btn-sm btn-error" onClick={() => handleDeleteClick(ad._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for small screens */}
          <div className="sm:hidden space-y-4">
            {ads.map((ad) => (
              <div key={ad._id} className={`rounded-lg shadow p-4 border ${cardClass}`}>
                <h3 className="text-lg font-semibold mb-2">{ad.title}</h3>
                <p className="mb-2">{ad.description}</p>
                <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  ad.status === "approved"
                    ? "bg-green-200 text-green-800"
                    : ad.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}>{ad.status}</p>
                <div className="mt-4 flex gap-3">
                  <button className="btn btn-sm btn-info flex-1" onClick={() => handleEditClick(ad)}>Update</button>
                  <button className="btn btn-sm btn-error flex-1" onClick={() => handleDeleteClick(ad._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showFormModal && (
        <div className="modal modal-open">
          <div className={`modal-box ${theme === "dark" ? "bg-gray-800 text-gray-100" : ""}`}>
            <h3 className="font-bold text-lg mb-4">✏️ Edit Advertisement</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-medium mb-1">📢 Ad Title</label>
                <input type="text" name="title" className={inputClass} defaultValue={editingAd?.title || ""} required />
              </div>
              <div>
                <label className="block font-medium mb-1">📝 Short Description</label>
                <textarea name="description" rows={3} className={textareaClass} defaultValue={editingAd?.description || ""} required />
              </div>
              <div>
                <label className="block font-medium mb-1">🖼️ Banner / Image URL</label>
                <input type="text" name="image" className={inputClass} defaultValue={editingAd?.image || ""} required />
              </div>
              <input type="hidden" name="status" value="pending" />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-success text-lg">Update</button>
                <button type="button" className="btn btn-error text-lg" onClick={() => setShowFormModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAds;
