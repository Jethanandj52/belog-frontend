"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Zap, Sparkles } from "lucide-react";
import UserMenu from "./UserMenu";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onJoinClick }: { onJoinClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();
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
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-[#11011A]/90 backdrop-blur-xl border-b border-[#2A083E] py-3 shadow-neon"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 z-[110]">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#9B2DEE] to-[#E300B4] rounded-xl flex items-center justify-center shadow-neon-pink border border-white/20">
            <Zap className="text-white fill-white" size={18} />
          </div>
          <span className="text-xl md:text-2xl font-[1000] tracking-tighter uppercase text-white italic">
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
                className="hover:text-[#E300B4] transition-all relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#E300B4] to-[#9B2DEE] transition-all group-hover:w-full"></span>
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
                JOIN US <Sparkles size={14} className="animate-pulse" />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
        >
          <Menu size={20} className="text-white" />
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed inset-0 bg-[#0d0118]/95 backdrop-blur-2xl z-[120] md:hidden"
          >
            <div className="flex justify-between items-center px-6 py-6 border-b border-white/10">
              <span className="text-lg font-black uppercase tracking-widest">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-8 px-6 py-12 text-center">
              {menuLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className=" text-white/50 text-3xl font-[1000] uppercase italic tracking-tight hover:text-[#E300B4] transition"
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-12">
                {isLoggedIn ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onJoinClick?.();
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#9B2DEE] to-[#E300B4] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    JOIN US <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
