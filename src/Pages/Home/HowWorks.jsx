// components/HowWorks.jsx
import { motion } from "framer-motion";
import { useOutletContext } from "react-router";

const steps = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 10-8 0 4 4 0 008 0zM12 14v7m-3-3h6"
        />
      </svg>
    ),
    title: "Register or Login",
    desc: "Create an account or log in quickly with email or Google to access market prices.",
    gradient: "from-blue-400 to-blue-600"
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    title: "Browse & Compare Prices",
    desc: "Explore daily updated local market prices, compare across markets, and track your favorite items.",
    gradient: "from-green-400 to-green-600"
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-5h3m-3 4h3"
        />
      </svg>
    ),
    title: "Buy & Track",
    desc: "Purchase products securely via Stripe and add items to your watchlist for price alerts.",
    gradient: "from-orange-400 to-orange-600" // changed from purple to orange
  },
];

const HowWorks = () => {
  const { theme } = useOutletContext();

  const sectionBg = theme === "dark" ? "bg-gray-800" : "bg-gray-50";
  const headingColor = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <section className={`py-20 transition-colors duration-500 ${sectionBg}`}>
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className={`text-4xl font-bold mb-12 ${headingColor}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ icon, title, desc, gradient }, idx) => (
            <motion.div
              key={idx}
              className={`p-8 rounded-2xl flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105 shadow-lg bg-gradient-to-br ${gradient}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md bg-white/10 backdrop-blur-sm">
                {icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
              <p className="text-white text-center">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWorks;
