"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    // overflow-x-hidden lagaya hai taaki x-axis scrolling bilkul na ho
    <div className="flex min-h-screen bg-[#0d0118] text-white selection:bg-[#ff00c8]/30 selection:text-[#ff00c8] relative overflow-x-hidden">
      
      {/* --- BACKGROUND METAVERSE EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-[60%] md:w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[50%] md:w-[30%] h-[30%] bg-[#e300b4]/10 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      {/* Sidebar - Desktop par fixed, Mobile par toggle mechanism sidebar component ke andar handle hoga */}
      <div className="relative z-50 shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full min-w-0">
        {/* Header - Glassmorphism style (Sticky behavior for mobile access) */}
        <div className="border-b border-white/5 bg-[#0d0118]/40 backdrop-blur-xl shrink-0">
          <Header />
        </div>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent w-full">
          {/* Mobile par padding kam ki hai (p-4), tablet/desktop par zyada (md:p-10) */}
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10 w-full">
            
            {/* Page Transition Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
            
            {/* Mobile safe area spacing at bottom */}
            <div className="h-10 md:hidden" />
          </div>
        </main>
      </div>

      {/* Metaverse Styled Scrollbar */}
      <style jsx global>{`
        /* X-Axis ko block karne ke liye additional global fix */
        body {
          overflow-x: hidden;
          width: 100%;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9b2dee, #ff00c8);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff00c8;
        }
      `}</style>
    </div>
  );
}