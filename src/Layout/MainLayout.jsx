import React, { use, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import Footer from "../Pages/Home/Footer";
import { useState } from "react";


const MainLayout = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={900}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <Navbar theme={theme} setTheme={setTheme} />
      <Outlet context={{ theme }} />
      <Footer theme={theme} />
    </div>
  );
};

export default MainLayout;
