import DashboardSidebar from "@/components/admin/DashboardSidebar";
import Navbar from "@/components/shared/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const AdminDashboardLayout = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  if (user?.role !== "admin") {
    navigate("/");
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <div className="mt-16 h-[calc(100vh-4rem)] flex ">
        <SidebarProvider>
          <DashboardSidebar />
          <main className="flex-1 relative">
            <SidebarTrigger className={"fixed mt-2 text-[#5b30a6]"} />
            <div className="mt-8">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
