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
    <div className="flex min-h-screen bg-[#0d0118] text-white selection:bg-[#ff00c8]/30 selection:text-[#ff00c8] relative overflow-hidden">
      
      {/* --- BACKGROUND METAVERSE EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        {/* Subtle Neon Glows for Dashboard */}
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-[#e300b4]/10 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar - Positioned Above Background */}
      <div className="relative z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Header - Glassmorphism style */}
        <div className="border-b border-white/5 bg-[#0d0118]/40 backdrop-blur-xl">
          <Header />
        </div>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
          <div className="max-w-7xl mx-auto p-6 md:p-10">
            {/* Page Transition Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Smoother transition
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Metaverse Styled Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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