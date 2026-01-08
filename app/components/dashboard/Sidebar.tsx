"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Settings, 
  Users, LogOut, PlusCircle, Menu, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: FileText, label: "My Blogs", path: "/dashboard/blogs" },
  { icon: PlusCircle, label: "Create Post", path: "/dashboard/create" },
  { icon: Users, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <>
      {/* --- LOGO --- */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="relative">
          <div className="w-8 h-8 bg-[#ff00c8] rounded-lg flex items-center justify-center shadow-[0_0_15px_#ff00c8]">
            <span className="text-white font-[1000] text-lg">E</span>
          </div>
          <div className="absolute inset-0 bg-[#ff00c8] blur-md opacity-30 -z-10" />
        </div>
        <span className="text-xl font-[1000] tracking-tighter uppercase text-white italic">Entrovex</span>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setIsOpen(false)} // Mobile par click karte hi close ho jaye
              className="relative block group"
            >
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${
                isActive 
                ? "text-white" 
                : "text-white/40 hover:text-white"
              }`}>
                <item.icon size={18} className={isActive ? "text-[#ff00c8]" : "group-hover:text-[#ff00c8] transition-colors"} />
                {item.label}
              </div>

              {isActive && (
                <motion.div 
                  layoutId="sidebar-nav"
                  className="absolute inset-0 bg-white/5 border-l-2 border-[#ff00c8] rounded-2xl z-0 shadow-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- LOGOUT --- */}
      <button className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500/70 font-black text-xs uppercase tracking-widest hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group">
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        Log Out
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button - Sirf mobile par dikhega */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-6 left-6 z-[110] p-3 bg-[#1a012e] border border-white/10 rounded-xl text-white shadow-2xl"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Sidebar - Same as before */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0d0118]/10 backdrop-blur-2xl border-r border-white/10 hidden lg:flex flex-col p-6 z-[100] shadow-[10px_0_40px_rgba(0,0,0,0.4)]">
        <SidebarContent />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a012e]/20 pointer-events-none -z-10" />
      </aside>

      {/* Mobile Sidebar Overlay (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[101] lg:hidden"
            />
            {/* Drawer */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 bg-[#0d0118] border-r border-white/10 flex flex-col p-6 z-[102] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}