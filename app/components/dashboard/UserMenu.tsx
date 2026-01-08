"use client";
import { useState, useEffect, useRef } from "react";
import { User, LogOut, LayoutDashboard, ChevronDown, Settings, UserCircle, X } from "lucide-react";
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
      {/* Trigger Button - Optimized for touch */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 md:gap-3 p-1 md:p-1.5 md:pr-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-500 shadow-2xl active:scale-90 lg:active:scale-95"
      >
        <div className="relative">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#9b2dee] via-[#e300b4] to-[#ff00c8] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,0,200,0.3)] transition-transform group-hover:rotate-6 border border-white/20">
            {user?.username ? (
              <span className="text-xs md:text-sm font-[1000] tracking-tighter italic">
                {user.username.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={16} className="md:w-[18px]" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#00ffa3] border-2 border-[#0d0118] rounded-full shadow-[0_0_8px_#00ffa3]"></div>
        </div>

        {/* Text hidden on smallest mobile screens to save space */}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-[#ff00c8] transition-colors">
            {loading ? "..." : user?.username || "Account"}
          </span>
          <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Member</span>
        </div>
        
        <ChevronDown 
          size={14} 
          className={`text-white/40 transition-all duration-500 mr-1 md:mr-0 ${open ? "rotate-180 text-[#ff00c8]" : ""}`} 
        />
      </button>

      {/* Dropdown Menu - Responsive Logic */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile Backdrop - Extra layer for focus on mobile */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              // Mobile: Slides up from bottom | Desktop: Drops down from top-right
              initial={typeof window !== 'undefined' && window.innerWidth < 1024 
                ? { opacity: 0, y: "100%" } 
                : { opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={typeof window !== 'undefined' && window.innerWidth < 1024 
                ? { opacity: 0, y: "100%" } 
                : { opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:top-full lg:right-0 mt-0 lg:mt-4 w-full lg:w-72 origin-bottom lg:origin-top-right bg-[#0d0118] lg:bg-[#1a012e]/90 backdrop-blur-2xl rounded-t-[2.5rem] lg:rounded-[2.5rem] shadow-[0_-20px_100px_rgba(0,0,0,0.6)] lg:shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-t lg:border border-white/10 overflow-hidden z-[100]"
            >
              {/* Mobile Handle Bar */}
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 lg:hidden" />

              {/* User Info Header */}
              <div className="p-6 md:p-8 pb-4 md:pb-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 flex justify-between items-start">
                <div>
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-24 bg-white/10 rounded-full"></div>
                      <div className="h-2 w-32 bg-white/5 rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[9px] font-black text-[#ff00c8] uppercase tracking-[0.3em] mb-2">Authenticated User</p>
                      <h4 className="text-xl font-[1000] text-white truncate leading-none mb-1 tracking-tighter italic">
                        {user?.username}
                      </h4>
                      <p className="text-[10px] font-bold text-white/30 truncate tracking-tight lowercase italic">
                        {user?.email}
                      </p>
                    </>
                  )}
                </div>
                {/* Mobile Close Button */}
                <button onClick={() => setOpen(false)} className="lg:hidden p-2 text-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Links Section */}
              <div className="px-4 pb-10 lg:pb-6 space-y-1 mt-2">
                <MenuLink 
                  href="/dashboard/profile" 
                  icon={<UserCircle size={18} />} 
                  label="Profile View" 
                  sub="Manage your identity" 
                  onClick={() => setOpen(false)}
                />
                <MenuLink 
                  href="/home" 
                  icon={<LayoutDashboard size={18} />} 
                  label="home" 
                  sub="Analytics & data" 
                  onClick={() => setOpen(false)}
                />
                <MenuLink 
                  href="/settings" 
                  icon={<Settings size={18} />} 
                  label="Account Settings" 
                  sub="Privacy & security" 
                  onClick={() => setOpen(false)}
                />

                <div className="pt-4 mt-4 border-t border-white/5">
                  <button
                    onClick={logout}
                    className="w-full group flex items-center gap-4 px-5 py-4 rounded-3xl text-red-500 hover:bg-red-500/5 transition-all duration-300"
                  >
                    <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-inner">
                      <LogOut size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-black uppercase tracking-widest leading-none">Logout</p>
                      <p className="text-[9px] font-black text-red-500/40 uppercase mt-1">End current session</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ href, icon, label, sub, onClick }: { href: string; icon: any; label: string; sub: string; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="group flex items-center gap-4 px-5 py-4 rounded-[2rem] hover:bg-white/5 transition-all duration-300 active:bg-white/10"
    >
      <div className="p-2 bg-white/5 rounded-xl text-white/40 group-hover:bg-[#ff00c8] group-hover:text-white transition-all duration-300 shadow-sm border border-white/5 group-hover:border-transparent">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-black uppercase tracking-widest text-white transition-colors">
          {label}
        </span>
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mt-0.5 transition-colors group-hover:text-white/40">
          {sub}
        </span>
      </div>
    </Link>
  );
}