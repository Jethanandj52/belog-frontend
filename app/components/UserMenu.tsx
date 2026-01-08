"use client";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, LayoutDashboard, ChevronDown, Settings, UserCircle, Zap } from "lucide-react";
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
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* --- TRIGGER BUTTON --- */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3 p-1.5 pr-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 backdrop-blur-md active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9b2dee] via-[#e300b4] to-[#ff00c8] text-white flex items-center justify-center shadow-lg shadow-[#9b2dee]/20 transition-transform group-hover:rotate-6">
            {user?.username ? (
              <span className="text-sm font-black tracking-tighter italic">
                {user.username.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={18} />
            )}
          </div>
          {/* Status Dot */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0d0118] rounded-full shadow-[0_0_8px_#10b981]"></div>
        </div>

        <div className="hidden lg:flex flex-col items-start leading-tight">
          <span className="text-[11px] font-[1000] uppercase tracking-widest text-white/90 group-hover:text-[#ff00c8] transition-colors">
            {loading ? "Scanning..." : user?.username || "Account"}
          </span>
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">Verified</span>
        </div>
        
        <ChevronDown 
          size={14} 
          className={`text-white/30 transition-all duration-500 ${open ? "rotate-180 text-[#ff00c8]" : ""}`} 
        />
      </button>

      {/* --- DROPDOWN MENU --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute right-0 mt-4 w-72 origin-top-right bg-[#130121]/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden z-[100]"
          >
            {/* User Info Header */}
            <div className="p-8 pb-6 bg-gradient-to-b from-white/5 to-transparent">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-24 bg-white/5 rounded-full"></div>
                  <div className="h-3 w-32 bg-white/5 rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                     <Zap size={10} className="text-[#9b2dee] fill-[#9b2dee]" />
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em]">User Profile</p>
                  </div>
                  <h4 className="text-xl font-[1000] text-white truncate leading-none mb-1 tracking-tighter uppercase italic">
                    {user?.username}
                  </h4>
                  <p className="text-xs font-bold text-white/40 truncate tracking-tight lowercase italic border-l border-[#e300b4] pl-3 mt-2">
                    {user?.email}
                  </p>
                </>
              )}
            </div>

            {/* Links Section */}
            <div className="px-3 pb-6 space-y-1">
              <MenuLink 
                href="/dashboard/profile" 
                icon={<UserCircle size={18} />} 
                label="Profile" 
                sub="Your identity" 
              />
              <MenuLink 
                href="/dashboard" 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                sub="Your analytics" 
              />
              <MenuLink 
                href="/dashboard/settings" 
                icon={<Settings size={18} />} 
                label="Settings" 
                sub="Privacy" 
              />

              <div className="pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={logout}
                  className="w-full group flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <LogOut size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase tracking-widest leading-none">Logout</p>
                    <p className="text-[9px] font-bold text-red-400/50 uppercase mt-1 tracking-tighter">Exit session</p>
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

// Helper Component for Menu Links (Updated with Metaverse Style)
function MenuLink({ href, icon, label, sub }: { href: string; icon: any; label: string; sub: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
      <div className="p-2 bg-white/5 rounded-xl text-white/40 group-hover:bg-gradient-to-br group-hover:from-[#9b2dee] group-hover:to-[#ff00c8] group-hover:text-white transition-all duration-300 border border-white/5 shadow-inner">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-[1000] uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
          {label}
        </span>
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mt-0.5 transition-colors group-hover:text-white/40">
          {sub}
        </span>
      </div>
    </Link>
  );
}