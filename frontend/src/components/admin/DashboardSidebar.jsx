import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { DASHBOARD_MENU_ITEMS } from "@/utils/constant";
import { Link } from "react-router-dom";



const DashboardSidebar = () => {
  

  return (
    <>
      <Sidebar className={"mt-16"}>
        <SidebarContent>
        
          <SidebarHeader>
            <span className="font-bold text-xl">
              <span className="text-black">Jobify</span>
              <span className="text-[#5b30a6]">.AI</span>&nbsp;
              <span className="font-normal"> dashboard</span>
               
              </span>
          </SidebarHeader>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[#5b30a6] text-sm">Admin area</SidebarGroupLabel>
            <SidebarContent>
              <SidebarMenu>

                {
                  DASHBOARD_MENU_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={"bg-white text-black font-medium hover:bg-[#c9b1f1]"}>
                        <Link to={item.url}>
                          <item.icon className="text-[1rem] text-[#5b30a6]"/>
                          <span>{item.title}</span>
                        </Link>

                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                }

              </SidebarMenu>

            </SidebarContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default DashboardSidebar;
