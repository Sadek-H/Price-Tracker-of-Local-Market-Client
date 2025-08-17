import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { theme } = useOutletContext();

  // Fetch products
  useEffect(() => {
    axios
      .get("https://price-tracker-for-local-markets-ser.vercel.app/dashboard/my-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  // Approve
  const handleApprove = (id) => {
    axios
      .put(
        `https://price-tracker-of-market-server.onrender.com/dashboard/approveProduct/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.modifiedCount) {
          setProducts((prev) =>
            prev.map((p) => (p._id === id ? { ...p, status: "approved" } : p))
          );
          toast.success("Approved successfully");
        }
      })
      .catch(() => toast.error("Failed to approve product"));
  };

  // Reject
  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Product",
      input: "text",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter a reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        axios
          .post(
            "https://price-tracker-for-local-markets-ser.vercel.app/dashboard/rejectProduct",
            {
              productId: id,
              reason: reason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            axios
              .put(
                `https://price-tracker-for-local-markets-ser.vercel.app/dashboard/rejectProduct/${id}`,
                {
                  status: "rejected",
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                if (res.data.modifiedCount) {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p._id === id ? { ...p, status: "rejected" } : p
                    )
                  );
                  toast.success("Product rejected with reason");
                } else {
                  toast.warn("Product status not updated, but reason saved.");
                }
              })
              .catch((err) => {
                console.error("Error updating status:", err);
                toast.error("Request failed.");
              });
          })
          .catch((err) => {
            console.error("Error posting reason:", err);
            toast.error("Request failed.");
          });
      }
    });
  };

  // Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://price-tracker-for-local-markets-ser.vercel.app/dashboard/deleteProduct/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.deletedCount) {
              setProducts((prev) => prev.filter((p) => p._id !== id));
              Swal.fire("Deleted!", "Product removed.", "success");
            }
          })
          .catch(() =>
            Swal.fire("Error!", "Failed to delete the product.", "error")
          );
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-green-500"></span>
      </div>
    );
  }

  return (
     <div className="pt-4 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">📋 All Vendor Products</h2>

      {/* Table for large screens */}
      <div className="hidden lg:block overflow-x-auto rounded-xl shadow">
        <table className="table w-full">
          <thead className="bg-base-200 text-base">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-left">Vendor</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p._id}
                className={`border-t ${
                  theme === "dark" ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-green-50"
                }`}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{p.itemName}</td>
                <td className="px-4 py-2">{p.vendorName}</td>
                <td
                  className={`px-4 py-2 font-semibold capitalize ${
                    p.status === "rejected"
                      ? "text-red-500"
                      : p.status === "approved"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {p.status}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  {p.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(p._id)} className="btn btn-xs btn-success"><FaCheck /></button>
                      <button onClick={() => handleReject(p._id)} className="btn btn-xs btn-warning"><FaTimes /></button>
                    </>
                  )}
                  <button onClick={() => navigate(`/dashboard/update-product/${p._id}`)} className="btn btn-xs btn-info"><FaEdit /></button>
                  <button onClick={() => handleDelete(p._id)} className="btn btn-xs btn-error"><FaTrashAlt /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile and tablet */}
      <div className="lg:hidden space-y-4">
        {products.map((p) => (
          <div key={p._id} className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{p.itemName}</h3>
              <span className={`text-sm font-medium ${
                p.status === "rejected" ? "text-red-500" :
                p.status === "approved" ? "text-green-600" :
                "text-yellow-600"
              }`}>
                {p.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Vendor: {p.vendorName}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {p.status === "pending" && (
                <>
                  <button onClick={() => handleApprove(p._id)} className="btn btn-xs btn-success"><FaCheck /></button>
                  <button onClick={() => handleReject(p._id)} className="btn btn-xs btn-warning"><FaTimes /></button>
                </>
              )}
              <button onClick={() => navigate(`/dashboard/update-product/${p._id}`)} className="btn btn-xs btn-info"><FaEdit /></button>
              <button onClick={() => handleDelete(p._id)} className="btn btn-xs btn-error"><FaTrashAlt /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
