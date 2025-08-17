import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const { theme } = useOutletContext();

  useEffect(() => {
    fetch("https://price-tracker-for-local-markets-ser.vercel.app/review")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }, []);

  // Gradient colors for avatars
  const avatarGradients = [
    "from-green-400 to-blue-500",
    "from-yellow-400 to-orange-500",
    "from-blue-400 to-purple-500",
    "from-green-300 to-yellow-300",
    "from-orange-400 to-red-500",
  ];

  return (
    <div
      className={`py-16 px-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } transition-colors duration-500`}
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          ❤️ What People Say
        </h2>

        <div className="overflow-hidden">
          <div className="animate-marquee flex gap-8">
            {/* Row 1 */}
            <div className="flex gap-8">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className={`min-w-[280px] max-w-[320px] p-6 rounded-3xl shadow-xl 
                    ${
                      theme === "dark"
                        ? "bg-gray-800/80 text-white"
                        : "bg-white/80 text-gray-900"
                    }
                    backdrop-blur-md border border-transparent hover:border-yellow-400
                    transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r ${
                        avatarGradients[idx % avatarGradients.length]
                      }`}
                    >
                      {review.name?.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                  </div>
                  <p className="text-sm opacity-90 line-clamp-3 mb-3">
                    “{review.comment}”
                  </p>
                  <p className="font-semibold flex items-center gap-1 text-yellow-400">
                    ⭐ {review.rating || "5"}/5
                  </p>
                </div>
              ))}
            </div>

            {/* Row 2 duplicate for infinite marquee */}
            <div className="flex gap-8">
              {reviews.map((review, idx) => (
                <div
                  key={`row2-${idx}`}
                  className={`min-w-[280px] max-w-[320px] p-6 rounded-3xl shadow-xl 
                    ${
                      theme === "dark"
                        ? "bg-gray-800/80 text-white"
                        : "bg-white/80 text-gray-900"
                    }
                    backdrop-blur-md border border-transparent hover:border-green-400
                    transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r ${
                        avatarGradients[(idx + 2) % avatarGradients.length]
                      }`}
                    >
                      {review.name?.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                  </div>
                  <p className="text-sm opacity-90 line-clamp-3 mb-3">
                    “{review.comment}”
                  </p>
                  <p className="font-semibold flex items-center gap-1 text-yellow-400">
                    ⭐ {review.rating || "5"}/5
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>
          {`
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 25s linear infinite;
            }
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Reviews;
