import { Link, useOutletContext } from "react-router";
import ReactDatePicker from "react-datepicker";
import { useEffect, useMemo, useState } from "react";

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useOutletContext();

  // Filters and sorting
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sorting, setSorting] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Fetch with fetch API
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://price-tracker-for-local-markets-ser.vercel.app/productsAll",
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache", // prevent cached 304
            "Pragma": "no-cache",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products: " + err.message);
      setLoading(false);
    }
  };

  const applyFilterAndSort = () => {
    let filtered = [...products];

    if (startDate) {
      filtered = filtered.filter((p) =>
        p.prices.some((price) => new Date(price.date) >= startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter((p) =>
        p.prices.some((price) => new Date(price.date) <= endDate)
      );
    }

    filtered = filtered.map((p) => {
      const sortedPrices = [...p.prices].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return { ...p, latestPrice: sortedPrices[0]?.price || 0, prices: sortedPrices };
    });

    if (sorting === "asc") filtered.sort((a, b) => a.latestPrice - b.latestPrice);
    else if (sorting === "desc") filtered.sort((a, b) => b.latestPrice - a.latestPrice);

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const totalPages = useMemo(
    () => Math.ceil(filteredProducts.length / rowsPerPage),
    [filteredProducts, rowsPerPage]
  );

  useEffect(() => {
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    setCurrentItems(filteredProducts.slice(indexOfFirst, indexOfLast));
  }, [filteredProducts, currentPage, rowsPerPage]);

  const pageBg = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen py-12 transition-colors duration-500 ${pageBg}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-extrabold text-center mb-12 ${textPrimary}`}>
          All Market Products
        </h2>

        {/* Filters (Sticky Top) */}
        <div
          className={`sticky top-4 z-50 flex flex-wrap justify-center gap-6 p-6 rounded-xl shadow-lg mb-12 transition-colors duration-500 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-400">📅 Start</label>
            <ReactDatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              className="border rounded px-3 py-1 w-36 text-sm bg-gray-50 text-gray-900"
              placeholderText="Start Date"
              isClearable
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-400">📅 End</label>
            <ReactDatePicker
              selected={endDate}
              onChange={setEndDate}
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
              maxDate={new Date()}
              className="border rounded px-3 py-1 w-36 text-sm bg-gray-50 text-gray-900"
              placeholderText="End Date"
              isClearable
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-400">↕️ Sort</label>
            <select
              value={sorting}
              onChange={(e) => setSorting(e.target.value)}
              className="border rounded px-3 py-1 w-36 text-sm bg-gray-50"
            >
              <option value="">Default</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
          <button
            onClick={applyFilterAndSort}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
          >
            Apply
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-green-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : currentItems.length === 0 ? (
          <p className="text-center text-gray-400">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((product) => {
                const latest = product.prices?.reduce((a, b) =>
                  new Date(a.date) > new Date(b.date) ? a : b
                );

                return (
                  <div
                    key={product._id}
                    className={`group ${cardBg} rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1`}
                  >
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.marketName}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-5 space-y-2">
                      <h3 className={`text-lg font-semibold ${textPrimary}`}>
                        {product.marketName}
                      </h3>
                      <p className={`text-sm ${textSecondary}`}>
                        📅 {latest?.date || "N/A"}
                      </p>
                      <p className={`text-md font-semibold ${textPrimary}`}>
                        💵 ৳{latest?.price || "N/A"}/kg
                      </p>
                      <p className={`text-xs ${textSecondary}`}>
                        👨‍🌾 {product.vendorName || "Unknown"}
                      </p>
                      <Link
                        to={`/details/${product._id}`}
                        className="mt-3 block bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl text-center font-medium hover:from-green-600 hover:to-green-700 transition"
                      >
                        🔍 View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition
                  ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
                  }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition
                    ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition
                  ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700"
                  }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Allproduct;
