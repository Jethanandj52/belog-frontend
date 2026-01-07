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
    <div className="flex min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-purple-100 selection:text-purple-600">
      {/* Fixed Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed Header */}
        <Header />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto p-6 md:p-10">
            {/* Page Transition Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global CSS for Custom Scrollbar (Optional but recommended) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}