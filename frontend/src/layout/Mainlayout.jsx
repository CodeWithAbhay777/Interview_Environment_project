import Footer from "@/components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "@/hooks/queries/useGetProfileQuery";
import { toast } from "sonner";
import { consumeNavigationToast } from "@/lib/navigationToast";


const Mainlayout = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const location = useLocation();

  useGetProfileQuery(user?._id, user?.role, {
    enabled: isAuthenticated && user?.isProfileComplete,
  });

  useEffect(() => {
    const queuedToast = consumeNavigationToast();
    if (!queuedToast?.message) {
      return;
    }

    const toastType = queuedToast.type || "info";
    if (typeof toast[toastType] === "function") {
      toast[toastType](queuedToast.message, queuedToast.id ? { id: queuedToast.id } : undefined);
      return;
    }

    toast.info(queuedToast.message, queuedToast.id ? { id: queuedToast.id } : undefined);
  }, [location.key]);
  
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
