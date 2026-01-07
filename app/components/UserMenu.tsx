"use client";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, LayoutDashboard, ChevronDown, Settings, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";

interface UserType {
  username: string;
  email: string;
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `https://belogbackend.vercel.app/auth/getUserById/${userId}`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
          }
        );

        if (data.success) setUser(data.user);
      } catch (error) {
        console.error("User fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const logout = () => {
    localStorage.clear(); // Clear all data
    window.location.href = "/";
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3 p-1.5 pr-4 bg-white/10 hover:bg-slate-900/[0.03] border border-slate-200/60 rounded-full transition-all duration-300 shadow-sm active:scale-95"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-200/50 transition-transform group-hover:rotate-6">
            {user?.username ? (
              <span className="text-sm font-black tracking-tighter">
                {user.username.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={18} />
            )}
          </div>
          {/* Status Dot */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="hidden lg:flex flex-col items-start leading-tight">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">
            {loading ? "Loading..." : user?.username || "Account"}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified Member</span>
        </div>
        
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-all duration-500 ${open ? "rotate-180 text-blue-600" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute right-0 mt-4 w-72 origin-top-right bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.2)] border border-slate-100/50 overflow-hidden z-[100]"
          >
            {/* User Info Header */}
            <div className="p-8 pb-6 bg-gradient-to-b from-slate-50/80 to-transparent">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
                  <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-2">Authenticated User</p>
                  <h4 className="text-xl font-[1000] text-slate-900 truncate leading-none mb-1 tracking-tighter">
                    {user?.username}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 truncate tracking-tight lowercase italic">
                    {user?.email}
                  </p>
                </>
              )}
            </div>

            {/* Links Section */}
            <div className="px-4 pb-6 space-y-1">
              <MenuLink 
                href="/dashboard/profile" 
                icon={<UserCircle size={18} />} 
                label="Profile View" 
                sub="Manage your identity" 
              />
              <MenuLink 
                href="/dashboard" 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                sub="Analytics & data" 
              />
              <MenuLink 
                href="/dashboard/settings" 
                icon={<Settings size={18} />} 
                label="Account Settings" 
                sub="Privacy & security" 
              />

              <div className="pt-4 mt-4 border-t border-slate-100/60">
                <button
                  onClick={logout}
                  className="w-full group flex items-center gap-4 px-5 py-4 rounded-3xl text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <div className="p-2 bg-red-100/50 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                    <LogOut size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase tracking-widest leading-none">Logout</p>
                    <p className="text-[9px] font-bold text-red-400/80 uppercase mt-1">End current session</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Component for Menu Links
function MenuLink({ href, icon, label, sub }: { href: string; icon: any; label: string; sub: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 px-5 py-4 rounded-3xl hover:bg-blue-50/50 transition-all duration-300">
      <div className="p-2 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 group-hover:text-blue-600 transition-colors">
          {label}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5 transition-colors group-hover:text-blue-400">
          {sub}
        </span>
      </div>
    </Link>
  );
}