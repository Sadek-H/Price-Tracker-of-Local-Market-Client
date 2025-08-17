// components/WhyTrackPrices.jsx
import { motion } from "framer-motion";
import { useOutletContext } from "react-router";

const TracPrices = () => {
  const { theme } = useOutletContext();

  const sectionBg = theme === "dark" ? "bg-gray-900" : "bg-green-50";
  const headingColor = theme === "dark" ? "text-white" : "text-green-700";
  const textColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const buttonBg = theme === "dark" ? "bg-green-600 hover:bg-green-500" : "bg-green-600 hover:bg-green-700";

  const images = [
    "https://i.ibb.co/RTTVK3s2/premium-photo-1686878950187-faf4bb17f5f1-mark-https-images-unsplash-com-opengraph-logo-png-mark-w-64.jpg",
    "https://i.postimg.cc/52gLLxQC/barcelona-spain-july-16-2015-people-buying-food-inside-mercat-de-la-boqueria-it-is-large-public-mark.jpg",
    "https://i.postimg.cc/g22n93rx/african-american-female-protective-face-mask-shopping-fruit-market.jpg",
    "https://i.postimg.cc/NfWPSkd4/beautiful-street-market-sunset.jpg"
  ];

  return (
    <section className={`py-16 transition-colors duration-500 ${sectionBg}`}>
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

        {/* Image Section */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="w-full h-32 md:h-40 lg:h-48 overflow-hidden rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <img
                src={src}
                alt={`Local Market ${index + 1}`}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${headingColor}`}>
            Why Track Daily Prices?
          </h2>
          <ul className={`space-y-3 text-lg ${textColor}`}>
            <li> &rarr; Save money with accurate pricing.</li>
            <li> &rarr; Avoid overpriced items in the market.</li>
            <li> &rarr; Know price trends at a glance.</li>
            <li> &rarr; Buy when prices drop!</li>
            <li> &rarr; Make smarter shopping decisions.</li>
          </ul>
          <button className={`mt-6 px-6 py-3 rounded-full font-semibold text-white ${buttonBg} shadow-lg transition-transform transform hover:scale-105`}>
            Start Now
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default TracPrices;
