

  // import { currentUser } from "@clerk/nextjs/server";
  import { redirect } from "next/navigation";
  import React from "react";
  import Sidebar from "@/components/sidebar";
  import BlurPage from "@/components/global/blur-pagge";
  import InfoBar from "@/components/global/InfoBar";
  import SidebarAdmin from "@/components/sidebarAdmin";
  import { AdminLoginUser } from "@/actions/auth";
  
  type Props = {
    children: React.ReactNode;
  
  };
  
  const layout = async ({ children }: Props) => {
    
    const authenticated = await AdminLoginUser();

    if (!authenticated) redirect("/");

  
   
  
    return (
      <div className="h-screen overflow-hidden">
        <SidebarAdmin  />
        <div className="md:pl-[300px]">
          <InfoBar  />
          <div className="relative">
            <BlurPage>{children}</BlurPage>
          </div>
        </div>
      </div>
    );
  };
  
  export default layout;
  