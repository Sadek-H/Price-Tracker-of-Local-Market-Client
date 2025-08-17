import React from "react";
import { Link, useOutletContext } from "react-router";
import { motion } from "framer-motion";

const Banner = () => {
  const { theme } = useOutletContext(); // expects 'light' or 'dark'

  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-[#C8F5C0]";
  const headingColor = theme === "dark" ? "text-white" : "text-[#0B4F2E]";
  const paragraphColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const buttonBg = theme === "dark" ? "bg-[#256D32]" : "bg-[#37A851]";
  const buttonHover = theme === "dark" ? "hover:bg-[#1f4f26]" : "hover:bg-[#2e8a45]";

  return (
    <div className={`${bgColor} py-10 sm:py-20 transition-colors duration-500`}>
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-8 sm:gap-12">
        
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className={`text-3xl sm:text-5xl font-bold leading-snug mb-4 ${headingColor}`}>
            Daily Local Market Price Tracker
          </h1>
          <p className={`text-base sm:text-lg mb-6 max-w-md mx-auto md:mx-0 ${paragraphColor}`}>
            Stay updated with daily product prices, compare across markets, and shop smarter!
          </p>
          <div className="flex justify-center md:justify-start">
            <Link
              to="/products"
              className={`px-6 py-3 ${buttonBg} text-white text-lg font-semibold rounded-full shadow-md ${buttonHover} hover:scale-105 transition-transform`}
            >
              View Today's Prices
            </Link>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative"
        >
          <div className="relative w-full max-w-xs sm:max-w-md h-44 sm:h-72 mx-auto">
            <motion.img
              src="/assets/banner1.png"
              alt="Market Van"
              className="lg:absolute lg:top-0 lg:left-0 w-full h-full object-contain z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.img
              src="/assets/banner-img.png"
              alt="Vegetable Crate"
              className="absolute -bottom-2 -right-2 w-20 h-28 sm:w-44 sm:h-52 object-contain z-20 transform sm:translate-x-5 sm:translate-y-5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
