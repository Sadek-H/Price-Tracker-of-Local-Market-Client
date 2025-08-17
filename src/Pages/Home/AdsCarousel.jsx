import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { useOutletContext } from "react-router";

const AdsCarousel = () => {
  const [ads, setAds] = useState([]);
  const { theme } = useOutletContext();

  useEffect(() => {
    axios.get("https://price-tracker-of-market-server.onrender.com/advertisements")
      .then(res => setAds(res.data))
      .catch(err => console.error(err));
  }, []);

  const headingColor = theme === "dark" ? "text-white" : "text-green-900";
  const paragraphColor = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <div className="my-12 px-4 transition-colors duration-500">
     <div className="container mx-auto">
      <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-3 ${headingColor}`}>
        🎯 Advertisement Highlights
      </h2>
      <p className={`text-center mb-8 max-w-2xl mx-auto ${paragraphColor}`}>
        Explore all current promotions and vendor ads through this interactive carousel.
      </p>

      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="rounded-2xl overflow-hidden shadow-xl"
      >
        {ads.map(ad => (
          <SwiperSlide key={ad._id}>
            <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-2xl">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
              {/* Text content */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg sm:text-xl font-semibold">{ad.title}</h3>
                <p className="text-sm sm:text-base line-clamp-2">{ad.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </div>
  );
};

export default AdsCarousel;
