"use client";
import React from "react";
import { Bell, Zap, Search, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-30 bg-[#0d0118]/40 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between w-full overflow-hidden">
      
      {/* --- Left Side: Welcome Text --- */}
      <div className="relative min-w-0 flex-shrink">
        <div className="flex items-center gap-2 mb-0.5 md:mb-1">
          <Zap size={10} className="text-[#9b2dee] fill-[#9b2dee] md:size-3" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 truncate">
            System Online
          </span>
        </div>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter text-white leading-none truncate">
          Dash<span className="md:hidden">...</span><span className="hidden md:inline">board</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Overview</span>
        </h1>
      </div>

      {/* --- Right Side: Actions --- */}
      <div className="flex items-center gap-3 sm:gap-6 ml-4 flex-shrink-0">
        
        {/* Search Shortcut (Desktop Only) */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 gap-3 text-white/20">
          <Search size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Search Cmd+K</span>
        </div>

        {/* Notifications (Simplified on Mobile) */}
        <button className="relative group p-2.5 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:border-[#9b2dee]/50 transition-all active:scale-90">
          <Bell size={18} className="text-white/60 group-hover:text-white transition-colors sm:size-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ff00c8] rounded-full shadow-[0_0_10px_#ff00c8]"></span>
        </button>

        {/* Action Button: Your Dashboard (Icon only on small mobile) */}
        <Link 
          href="/dashboard"
          className="relative group overflow-hidden px-3 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all active:scale-95 flex items-center shadow-neon-pink"
        >
          {/* Button Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] group-hover:opacity-90 transition-opacity"></div>
          
          <div className="relative flex items-center gap-2 text-white text-[11px] font-[1000] uppercase tracking-widest">
            <LayoutDashboard size={16} strokeWidth={3} className="sm:size-[16px]" />
            <span className="hidden sm:inline">Your Dashboard</span>
          </div>
          
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity"></div>
        </Link>
      </div>

      {/* Subtle Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9b2dee]/20 to-transparent"></div>
    </header>
  );
}