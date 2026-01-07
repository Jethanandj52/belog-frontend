"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, FileText, Send, Users, Settings, LogOut, ChevronRight, User 
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // States for Real Data
  const [adminData, setAdminData] = useState({
    username: "Loading...",
    role: "Admin",
    avatar: ""
  });

  useEffect(() => {
    // LocalStorage se data nikalna
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId) {
      // Backend se latest profile data fetch karna
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

  // Logout Function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://belogbackend.vercel.app/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clean up storage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      toast.success("Logged out successfully");
      router.push("/"); // Home page par redirect
    } catch (err) {
      toast.error("Logout failed");
      // Safety logout
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "All Articles", icon: FileText, path: "/admin/belogs" },
    { name: "Guest Requests", icon: Send, path: "/admin/guest-requests", badge: 8 },
    { name: "Users", icon: Users, path: "/admin/users" },
  ];

  return (
    <aside className="h-screen w-72 flex flex-col sticky top-0 border-r border-slate-200 bg-white shadow-xl">
      {/* ================= LOGO SECTION ================= */}
      <div className="p-8">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
              <span className="text-white font-black text-2xl italic">E</span>
            </div>
          </div>
          <div>
            <span className="text-xl font-[950] tracking-tighter italic uppercase block text-slate-900">Entrovex</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600">Premium Admin</span>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <Link key={idx} href={item.path}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`group flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 mb-1 cursor-pointer ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-purple-400" : "group-hover:text-purple-600"}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge ? (
                  <span className="px-2 py-0.5 bg-rose-500 text-[10px] font-black text-white rounded-lg shadow-md">{item.badge}</span>
                ) : (
                  isActive && <ChevronRight className="w-4 h-4 text-purple-400" />
                )}
              </motion.div>
            </Link>
          );
        })}

        <div className="pt-10">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Preferences</p>
          <Link href="/admin/settings">
            <div className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all cursor-pointer ${pathname === '/admin/settings' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* ================= REAL PROFILE SECTION ================= */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {adminData.avatar ? (
                <img
                  src={adminData.avatar}
                  alt="Admin"
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
                  <User size={20} />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate italic leading-tight">
                {adminData.username}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                {adminData.role}
              </p>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}