import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link, useOutletContext } from "react-router";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import Rating from "react-rating";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Make sure this is imported
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [role, setRole] = useState("user");
  const { user,token } = useContext(AuthContext) || { user: { role: "user" } };
  const {theme} = useOutletContext();
  console.log(role);
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`https://price-tracker-of-market-server.onrender.com/users/${user.email}`,
          {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        )
        .then((res) => {
          setRole(res.data?.role || "user");
        })
        .catch((err) => console.error(err));
    
    }
  }, [user?.email]);

  useEffect(() => {
    axios
      .get(`https://price-tracker-of-market-server.onrender.com/products/${id}`,
        {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
      })
      .catch(() => toast.error("Failed to fetch product details"));
  }, [id]);

  const fetchReviews = () => {
    axios
      .get("https://price-tracker-of-market-server.onrender.com/review",
        {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then((res) => {
        const filtered = res.data.filter((r) => r.productId === id);
        setReviews(filtered);
      })
      .catch(() => toast.error("Failed to load reviews"));
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const comment = form.review.value.trim();

    if (!comment || rating === 0) {
      toast.error("Please provide a rating and a review comment.");
      return;
    }

    const newReview = {
      photo: user?.photoURL,
      name: user?.displayName || "Anonymous",
      email: user?.email,
      rating,
      comment,
      productId: id,
      date: new Date().toISOString(),
    };

    axios
      .post("https://price-tracker-of-market-server.onrender.com/review", newReview,
        {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then((res) => {
        if (res.data) {
          toast.success("Review submitted!");
          form.reset();
          setRating(0);
          fetchReviews();
        }
      })
      .catch(() => toast.error("Failed to submit review"));
  };

  const handleDeleteReview = (reviewId) => {
    axios
      .delete(`https://price-tracker-of-market-server.onrender.com/review/${reviewId}`,
        {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then(() => {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        toast.success("Review deleted!");
      })
      .catch(() => toast.error("Failed to delete review"));
  };

  const handleAddToWatchlist = () => {
    if (!user?.email) {
      toast.error("You must be logged in to add to watchlist");
      return;
    }

    const data = {
      userEmail: user.email,
      productId: product._id,
      itemName: product.itemName,
      marketName: product.marketName,
      imageUrl: product.imageUrl,
      prices: sortedPrices.map((p) => ({
        date: p.date,
        price: Number(p.price),
      })),
    };

    axios
      .post("https://price-tracker-of-market-server.onrender.com/watchlist", data,
        {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then(() => toast.success("Added to watchlist!"))
      .catch(() => toast.error("Failed to add to watchlist"));
  };

  const sortedPrices = [...(product.prices || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestPriceObj = sortedPrices[0] || {
    price: "N/A",
    date: product.date,
  };
  const latestPrice = latestPriceObj.price;
  const latestDate = latestPriceObj.date;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const normalizeDateToUTC = (dateInput) => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const handleCompareDate = (date) => {
    setSelectedDate(date);

    const normalizedSelectedDate = normalizeDateToUTC(date);
    const normalizedLatestDate = normalizeDateToUTC(latestDate);

    const selectedPriceObj = sortedPrices.find((entry) => {
      return normalizeDateToUTC(entry.date) === normalizedSelectedDate;
    });

    if (selectedPriceObj && latestPrice !== "N/A") {
      setComparisonData([
        {
          date: new Date(normalizedSelectedDate).toISOString().split("T")[0],
          price: Number(selectedPriceObj.price),
        },
        {
          date: new Date(normalizedLatestDate).toISOString().split("T")[0],
          price: Number(latestPrice),
        },
      ]);
    } else {
      toast.error("No price data found for selected date.");
      setComparisonData([]);
    }
  };

  return (
   <div className={`min-h-screen px-6 py-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900' : 'bg-green-50'}`}>
  <div className="container mx-auto">
  {/* Back Button */}
  <button
    onClick={() => navigate(-1)}
    className={`flex items-center mb-6 font-medium ${theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-green-700 hover:underline'}`}
  >
    <FaArrowLeft className="mr-2" /> Back to Products
  </button>

  {/* Main Card */}
  <motion.div
    className={`max-w-5xl mx-auto grid md:grid-cols-2 overflow-hidden rounded-2xl shadow-xl transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex justify-center items-center p-6 bg-green-100">
      <img
        src={product.imageUrl}
        alt={product.itemName}
        className="w-full max-h-96 object-contain rounded-xl"
      />
    </div>

    <div className="p-6 flex flex-col justify-between space-y-4">
      <div>
        <h2 className={`${theme === 'dark' ? 'text-white' : 'text-green-800'} text-3xl font-bold mb-2`}>
          {product.itemName}
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-green-600'} text-sm`}>
          🏪 Market: {product.marketName} | 👤 Vendor: {product.vendorName} | 📆 {new Date(latestDate).toLocaleDateString()}
        </p>

        <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
          product.status === 'approved' ? 'bg-green-200 text-green-900' :
          product.status === 'pending' ? 'bg-yellow-200 text-yellow-900' :
          'bg-red-200 text-red-900'
        }`}>
          {product.status || 'unknown'}
        </span>

        <p className={`${theme === 'dark' ? 'text-white' : 'text-green-900'} font-semibold text-lg mt-2`}>
          💵 Price: ৳{latestPrice}/kg
        </p>

        <div className="mt-4">
          <h3 className={`${theme === 'dark' ? 'text-white' : 'text-green-800'} font-semibold`}>📝 Description</h3>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-green-700'} text-sm whitespace-pre-line`}>
            {product.itemDescription || product.description || 'No description provided.'}
          </p>
        </div>

        {sortedPrices.length > 1 && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            <h3 className={`${theme === 'dark' ? 'text-white' : 'text-green-800'} font-semibold`}>📋 Price History</h3>
            <ul className={`${theme === 'dark' ? 'text-gray-300' : 'text-green-700'} list-disc ml-5 text-sm`}>
              {sortedPrices.map((entry, idx) => (
                <li key={idx}>
                  {new Date(entry.date).toLocaleDateString()} — ৳{entry.price}/kg
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          onClick={handleAddToWatchlist}
          disabled={role === 'admin' || role === 'vendor'}
          className={`px-4 py-2 rounded-xl font-semibold shadow transition transform hover:scale-105 ${
            role === 'admin' || role === 'vendor'
              ? 'bg-gray-500 cursor-not-allowed text-gray-200'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600'
          }`}
        >
          ⭐ Add to Watchlist
        </button>

        <Link
          to={`/payment/${product._id}`}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow hover:from-green-700 hover:to-green-800 transition transform hover:scale-105"
        >
          🛒 Buy Product
        </Link>
      </div>
    </div>
  </motion.div>

  {/* Comparison Section */}
  <div className={`max-w-5xl mx-auto mt-10 p-6 rounded-xl shadow transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    <label className={`${theme === 'dark' ? 'text-white' : 'text-green-800'} font-semibold block mb-2`}>
      📊 Compare with previous date:
    </label>

    <ReactDatePicker
      selected={selectedDate}
      onChange={handleCompareDate}
      dateFormat="yyyy-MM-dd"
      maxDate={yesterday}
      className="border p-2 rounded-md border-green-300 w-full max-w-xs mb-4"
      placeholderText="Select a past date"
    />

    {comparisonData.length === 2 && (
      <div className="my-4">
        <p className={`${theme === 'dark' ? 'text-white' : 'text-green-800'} font-semibold text-lg`}>
          🧾 Price Difference: <span className={theme === 'dark' ? 'text-yellow-400' : 'text-black'}>{comparisonData[1].price - comparisonData[0].price}৳</span>
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke={theme === 'dark' ? 'white' : 'black'} />
            <YAxis unit="৳" stroke={theme === 'dark' ? 'white' : 'black'} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#00B894" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>

  {/* Reviews Section */}
  <div className={`max-w-5xl mx-auto mt-10 p-6 rounded-xl shadow transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-green-800'} text-xl font-semibold mb-4`}>💬 User Reviews</h3>

    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Rating
        initialRating={rating}
        emptySymbol={<span className="text-gray-300 text-3xl">★</span>}
        fullSymbol={<span className="text-yellow-400 text-3xl">★</span>}
        fractions={2}
        onChange={(rate) => setRating(rate)}
      />
      <textarea
        name="review"
        rows="3"
        placeholder="Write your honest review here..."
        className="w-full border border-green-300 rounded-lg p-3 text-sm"
        required
      ></textarea>
      <button
        type="submit"
        className="self-end bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-xl shadow transition transform hover:scale-105"
      >
        Submit Review
      </button>
    </form>

    <div className="mt-6 space-y-4">
      {reviews.length === 0 && (
        <p className="text-orange-600 font-semibold bg-amber-50 p-3 rounded">No reviews yet.</p>
      )}

      {reviews.map((rev) => (
        <div key={rev._id} className={`flex gap-4 items-start p-4 rounded-lg transition shadow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-green-50 text-green-700'}`}>
          <img
            src={rev?.photo || 'https://i.ibb.co/ZYW3VTp/brown-brim.png'}
            alt={rev.name || 'Anonymous'}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div className="flex-1">
            <p className="font-semibold">{rev.name || 'Anonymous'} ({rev.email || 'No email'})</p>
            <Rating
              readonly
              initialRating={rev.rating || 0}
              emptySymbol={<span className="text-gray-300 text-sm">★</span>}
              fullSymbol={<span className="text-yellow-500 text-sm">★</span>}
            />
            <p className="mt-1 whitespace-pre-line">{rev.comment}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(rev.date).toLocaleString()}</p>
            <button
              onClick={() => handleDeleteReview(rev._id)}
              className="mt-2 text-red-500 hover:text-red-700"
              title="Delete review"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  </div>
</div>

  );
};

export default ProductDetails;
