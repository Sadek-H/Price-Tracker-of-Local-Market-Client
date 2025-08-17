import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router";

const ViewPriceTrends = () => {
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { token } = useContext(AuthContext);
  const { theme } = useOutletContext();

  useEffect(() => {

    axios
      .get("https://price-tracker-for-local-markets-ser.vercel.app/watchlistPrice", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;

        const productMap = new Map();

        data.forEach((item) => {
          const itemName = item.itemName;
          if (!productMap.has(itemName)) {
            productMap.set(itemName, { itemName, prices: [] });
          }
          if (Array.isArray(item.prices)) {
            item.prices.forEach((p) => {
              const cleanedPrice = Number(String(p.price).replace(/[^\d.]/g, ""));
              const dateObject = new Date(p.date);
              if (p.date && !isNaN(dateObject.getTime()) && cleanedPrice > 0) {
                productMap.get(itemName).prices.push({ date: dateObject, price: cleanedPrice });
              }
            });
          }
        });

        const processedProducts = Array.from(productMap.values()).map((product) => ({
          ...product,
          prices: product.prices.sort((a, b) => a.date.getTime() - b.date.getTime()),
        }));

        setGroupedProducts(processedProducts);
        if (processedProducts.length > 0) setSelectedIndex(0);
      })
      .catch(() => {
        toast.error("Failed to fetch watchlist data. Please check your server.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Loading price trends...
        </span>
      </div>
    );

  if (!groupedProducts.length)
    return (
      <p className={`text-center mt-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        No tracked items found.
      </p>
    );

  const selectedProduct = groupedProducts[selectedIndex] || {};
  const { itemName, prices = [] } = selectedProduct;

  const chartData = prices.map(({ date, price }) => ({
    date: date.toLocaleDateString("en-GB"),
    price,
  }));

  const calculateTrendPercentage = () => {
    if (prices.length < 2) return "0%";
    const latestPriceEntry = prices.at(-1);
    const latestPrice = latestPriceEntry.price;
    const sevenDaysAgo = new Date(latestPriceEntry.date);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let historicalPrice = prices[0].price;
    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i].date <= sevenDaysAgo) {
        historicalPrice = prices[i].price;
        break;
      }
    }
    if (historicalPrice <= 0) return "0%";
    const change = ((latestPrice - historicalPrice) / historicalPrice) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const trendPercentage = calculateTrendPercentage();

  return (
    <div className="max-w-6xl mx-auto my-8 flex flex-col md:flex-row gap-6 px-4">
      {/* Sidebar */}
      <aside
        className={`md:w-1/4 p-4 rounded-xl shadow ${
          theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Tracked Items</h3>
        <ul className="space-y-2">
          {groupedProducts.map((product, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <li
                key={product.itemName}
                onClick={() => setSelectedIndex(idx)}
                className={`cursor-pointer px-3 py-2 rounded-md font-medium transition ${
                  isSelected
                    ? theme === "dark"
                      ? "bg-orange-700"
                      : "bg-purple-200"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                {product.itemName}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chart */}
      <main
        className={`md:flex-1 p-4 rounded-xl shadow ${
          theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">{itemName}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#444" : "#ddd"} />
            <XAxis dataKey="date" stroke={theme === "dark" ? "#aaa" : "#333"} />
            <YAxis stroke={theme === "dark" ? "#aaa" : "#333"} />
            <Tooltip formatter={(value) => `৳${value}`} />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} name="Price (৳)" />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-4 font-bold">
          Trend:{" "}
          <span className={trendPercentage.startsWith("+") ? "text-green-500" : "text-red-500"}>
            {trendPercentage} last 7 days
          </span>
        </p>
      </main>
    </div>
  );
};

export default ViewPriceTrends;
