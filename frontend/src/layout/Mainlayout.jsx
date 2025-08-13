import Footer from "@/components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/hooks/queries/useGetProfileQuery";


const Mainlayout = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  useGetProfileQuery(user?._id, user?.role, {
    enabled: isAuthenticated && user?.isProfileComplete,
  });

  

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="flex-1 mt-16 ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Mainlayout;
