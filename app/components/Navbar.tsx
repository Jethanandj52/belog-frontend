"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Zap, Sparkles } from "lucide-react"; // Sparkles icon add kiya for extra neon feel
import UserMenu from "./UserMenu"; // Assuming UserMenu is styled appropriately

export default function Navbar({ onJoinClick }: { onJoinClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const menuLinks = [
    { name: "Home", href: "/home" },
    { name: "Blogs", href: "/home/blogs" },
    { name: "About", href: "#about" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
        ? "bg-[#11011A]/90 backdrop-blur-xl border-b border-[#2A083E] py-3 shadow-neon" // Dark Purple bg on scroll
        : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group relative z-[110]">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#9B2DEE] to-[#E300B4] rounded-xl flex items-center justify-center shadow-neon-pink group-hover:rotate-12 transition-transform duration-300 border border-white/20">
            <Zap className="text-white fill-white" size={18} />
          </div>
          <span className="text-xl md:text-2xl font-[1000] tracking-tighter uppercase text-white italic drop-shadow-neon-text">
            Entrovex
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 font-bold text-[10px] uppercase tracking-[0.2em] text-white/70">
            {menuLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="hover:text-[#E300B4] transition-all relative group text-shadow-neon"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E300B4] to-[#9B2DEE] transition-all group-hover:w-full group-hover:shadow-neon-sm"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-4 border-l border-white/10 pl-8">
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <button
                onClick={onJoinClick}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#9B2DEE] to-[#E300B4] text-white hover:shadow-neon-pink transition-all flex items-center gap-2 font-black text-[10px] tracking-[0.15em] uppercase border border-white/20"
              >
                JOIN US <Sparkles size={14} className="fill-white text-white animate-pulse" />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden text-white relative z-[110] p-2 bg-[#9B2DEE]/30 rounded-lg border border-white/20 shadow-neon-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} className="text-white drop-shadow-neon-sm" /> : <Menu size={24} className="text-white drop-shadow-neon-sm" />}
        </button>

        {/* MOBILE OVERLAY */}
        <div className={`fixed inset-0 bg-[#11011A]/95 backdrop-blur-2xl transition-all duration-500 z-[105] flex flex-col items-center justify-center gap-8 md:hidden ${
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}>
          {menuLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl font-black uppercase tracking-widest text-white hover:text-[#E300B4] transition-colors drop-shadow-neon-text"
            >
              {link.name}
            </Link>
          ))}
          {!isLoggedIn && (
            <button
              onClick={() => { setMobileMenuOpen(false); onJoinClick?.(); }}
              className="mt-4 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#9B2DEE] to-[#E300B4] text-white font-black text-xs tracking-widest uppercase shadow-neon-pink"
            >
              Enter The Metaverse
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}