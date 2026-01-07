"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Navbar({ onJoinClick }: { onJoinClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Initial Check
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Listen for storage changes (optional but good for cross-tab)
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
      isScrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-3" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <span className="text-white font-black text-xl">E</span>
          </div>
          <span className="text-2xl font-[900] tracking-tighter uppercase text-slate-900">Entrovex</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-widest text-slate-900">
          <Link href="/home" className="hover:text-blue-600 transition-all">Home</Link>
          <Link href="/home/blogs" className="hover:text-blue-600 transition-all">Blogs</Link>
          <Link href="#about" className="hover:text-blue-600 transition-all">About</Link>

          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <button
              onClick={onJoinClick}
              className="px-8 py-3 rounded-full bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-xl flex items-center gap-2 font-black text-[10px] tracking-[0.15em]"
            >
              JOIN US <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}