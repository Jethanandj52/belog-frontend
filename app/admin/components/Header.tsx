"use client";
import React from "react";
import { Bell, Plus, Zap, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="relative z-30 bg-[#0d0118]/40 backdrop-blur-2xl border-b border-white/5 px-8 py-6 flex items-center justify-between">
      
      {/* --- Left Side: Welcome Text --- */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={12} className="text-[#9b2dee] fill-[#9b2dee]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">System Online</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter text-white">
          Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Overview</span>
        </h1>
      </div>

      {/* --- Right Side: Actions --- */}
      <div className="flex items-center gap-6">
        
        {/* Search Shortcut (Visual Only) */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 gap-3 text-white/20">
          <Search size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Search Cmd+K</span>
        </div>

        {/* Notifications */}
        <button className="relative group p-3 bg-white/5 rounded-xl border border-white/10 hover:border-[#9b2dee]/50 transition-all">
          <Bell size={20} className="text-white/60 group-hover:text-white transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff00c8] rounded-full shadow-[0_0_10px_#ff00c8]"></span>
        </button>

        {/* Action Button */}
        <button className="relative group overflow-hidden px-6 py-3 rounded-xl transition-all active:scale-95">
          {/* Button Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] group-hover:opacity-90 transition-opacity"></div>
          
          <div className="relative flex items-center gap-2 text-white text-[11px] font-[1000] uppercase tracking-widest">
            <Plus size={16} strokeWidth={3} />
            <span>New Post</span>
          </div>
          
          {/* Subtle Glow Effect on Hover */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity"></div>
        </button>
      </div>

      {/* Subtle Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9b2dee]/20 to-transparent"></div>
    </header>
  );
}