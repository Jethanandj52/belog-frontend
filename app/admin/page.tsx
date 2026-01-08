"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import DashboardWidgets from "./components/DashboardWidgets";
import RecentArticles from "./components/RecentArticles";

export default function AdminPage() {
  return (
    // overflow-x-hidden lagaya hai taaki horizontal scroll bilkul na aaye
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white overflow-x-hidden relative">
      
      {/* --- BACKGROUND NEON GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] -right-[5%] w-[35%] h-[35%] bg-[#e300b4]/10 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar - Desktop par side mein rahega, mobile par drawer ban jayega (as per Sidebar logic) */}
      <div className="relative z-40 shrink-0">
         <Sidebar />
      </div>

      {/* Main Content Area - width ko 100% control kiya gaya hai horizontal scroll rokne ke liye */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto overflow-x-hidden custom-scrollbar w-full">
        
        {/* Dashboard Content Container */}
        <div className="p-5 sm:p-8 lg:p-12 max-w-full mx-auto w-full space-y-10 md:space-y-16">
          
          {/* Section Heading - Responsive margins aur text sizes */}
          <div className="flex items-center gap-4 mt-12 lg:mt-0">
             <div className="h-8 md:h-10 w-[2px] bg-gradient-to-b from-[#9b2dee] to-[#ff00c8]"></div>
             <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-[1000] uppercase italic tracking-tighter leading-none">
                  Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Center</span>
                </h1>
                <p className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1">
                  Neural Analytics Active
                </p>
             </div>
          </div>

          {/* Widgets & Articles - Har component apni width khud handle karega */}
          <div className="space-y-12 md:space-y-20 w-full">
            <div className="w-full overflow-x-hidden">
              <DashboardWidgets />
            </div>
            
            <div className="w-full overflow-x-hidden">
              <RecentArticles />
            </div>
          </div>

          {/* Safe bottom area for mobile navigation/spacing */}
          <div className="h-10 md:h-20" />
        </div>
      </main>
    </div>
  );
}