"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, FileText, Send, Users, Settings, LogOut, 
  User, Zap, Menu, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle state
  
  const [adminData, setAdminData] = useState({
    username: "Loading...",
    role: "Admin",
    avatar: ""
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId) {
      axios.get(`https://belogbackend.vercel.app/auth/getUserById/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data.success) {
          setAdminData({
            username: res.data.user.username,
            role: res.data.user.role,
            avatar: res.data.user.avatar || "" 
          });
        }
      })
      .catch(err => console.error("Sidebar Auth Error:", err));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://belogbackend.vercel.app/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.clear();
      toast.success("Connection Terminated");
      router.push("/");
    } catch (err) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Articles", icon: FileText, path: "/admin/belogs" },
    { name: "Guest", icon: Send, path: "/admin/guest-requests", badge: 8 },
    { name: "Users", icon: Users, path: "/admin/users" },
  ];

  const SidebarContent = () => (
    <>
      {/* ================= LOGO SECTION ================= */}
      <div className="p-8">
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-11 h-11 bg-black rounded-xl flex items-center justify-center border border-white/10">
              <span className="text-white font-[1000] text-2xl italic">E</span>
            </div>
          </div>
          <div>
            <span className="text-xl font-[1000] tracking-tighter italic uppercase block text-white">Entrovex</span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#9b2dee]">Neural Interface</span>
          </div>
        </Link>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">Main Terminal</p>
        
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <Link key={idx} href={item.path} onClick={() => setIsOpen(false)}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 mb-2 cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? "text-white bg-white/5 border border-white/10" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#9b2dee] shadow-[0_0_15px_#9b2dee]" />
                )}
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-[#9b2dee]" : "group-hover:text-[#9b2dee]"}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge ? (
                  <span className="px-2 py-1 bg-[#ff00c8] text-[9px] font-black text-white rounded-md shadow-[0_0_10px_rgba(255,0,200,0.4)]">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <Zap size={12} className="text-[#9b2dee] fill-[#9b2dee] animate-pulse" />
                )}
              </motion.div>
            </Link>
          );
        })}

        <div className="pt-10">
          <p className="px-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">System Config</p>
          <Link href="/admin/settings" onClick={() => setIsOpen(false)}>
            <div className={`flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer ${
              pathname === '/admin/settings' ? 'bg-white/5 text-white border border-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}>
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* ================= PROFILE SECTION ================= */}
      <div className="p-6 mt-auto border-t border-white/5">
        <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-4 group hover:bg-white/[0.05] transition-all">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] rounded-2xl blur opacity-20"></div>
              {adminData.avatar ? (
                <img src={adminData.avatar} alt="Admin" className="relative w-11 h-11 rounded-2xl object-cover border border-white/10" />
              ) : (
                <div className="relative w-11 h-11 rounded-2xl bg-[#1a012e] border border-white/10 flex items-center justify-center text-white/40">
                  <User size={20} />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-[3px] border-[#0d0118] rounded-full shadow-[0_0_10px_#22c55e]"></div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-[1000] text-white truncate italic uppercase tracking-tighter leading-tight">{adminData.username}</p>
              <p className="text-[9px] font-black text-[#9b2dee] uppercase tracking-widest truncate mt-0.5">{adminData.role}</p>
            </div>

            <button onClick={handleLogout} className="p-2.5 text-white/20 hover:text-[#ff00c8] hover:bg-[#ff00c8]/10 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE HEADER / TOGGLE */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-[#1a012e] border border-[#ff00c8]/30 rounded-2xl text-white shadow-neon-pink"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex h-screen w-72 flex-col sticky top-0 border-r border-white/5 bg-[#0d0118]/80 backdrop-blur-3xl z-50">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
            />
            
            {/* Drawer */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-80 bg-[#0d0118] border-r border-[#ff00c8]/20 z-[56] lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}