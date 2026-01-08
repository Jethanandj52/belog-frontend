"use client";
import React from "react";
// In components ko bhi isi theme mein update karna hoga
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardWidgets from "./components/DashboardWidgets";
import RecentArticles from "./components/RecentArticles";

export default function AdminPage() {
  return (
    // Base Background: Deep Radial Gradient
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white overflow-hidden relative">
      
      {/* --- BACKGROUND NEON GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] -right-[5%] w-[35%] h-[35%] bg-[#e300b4]/10 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar - (Pass the theme down if needed) */}
      <div className="relative z-20 border-r border-white/5">
         {/* <Sidebar /> */}
      </div>

      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="sticky top-0 z-30 backdrop-blur-md border-b border-white/5">
           {/* <Header /> */}
        </div>

        {/* Dashboard Content */}
        <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-12">
          
          {/* Section Heading Example */}
          <div className="flex items-center gap-4">
             <div className="h-8 w-[2px] bg-gradient-to-b from-[#9b2dee] to-[#ff00c8]"></div>
             <div>
                <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter">
                  Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Center</span>
                </h1>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Neural Analytics Active</p>
             </div>
          </div>

          <div className="space-y-16">
            <DashboardWidgets />
            <RecentArticles />
          </div>

        </div>
      </main>
    </div>
  );
}