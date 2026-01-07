"use client";
import React from "react";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ================= TOP SECTION: NEWSLETTER / CTA ================= */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20 border-b border-slate-100 mb-20 items-center">
          <div>
            <h2 className="text-4xl font-[950] tracking-tighter mb-4 italic text-slate-900">
              Ready to amplify <br/> your voice?
            </h2>
            <p className="text-slate-500 font-medium">Join 2,000+ creators at Entrovex today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/home/write" className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
              Start Writing <ArrowRight size={18} />
            </Link>
            <Link href="/home/contact" className="px-8 py-4 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center border border-slate-100">
              Contact Sales
            </Link>
          </div>
        </div>

        {/* ================= MAIN LINKS SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-100">
                <span className="text-white font-black text-xl">E</span>
              </div>
              <span className="text-2xl font-[900] tracking-tighter uppercase text-slate-900">
                Entrovex
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8 font-medium">
              The world's most advanced platform for SEO-driven content and high-authority guest posting. 
            </p>
            <div className="flex gap-4">
              {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg transition-all border border-slate-100">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Platform</h3>
            <ul className="space-y-4">
              {["Features", "Writers", "Case Studies", "Pricing"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Resources</h3>
            <ul className="space-y-4">
              {["Documentation", "Help Center", "Guidelines", "API Status"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Legal</h3>
            <ul className="space-y-4">
              {["Privacy", "Terms", "Cookie Policy", "Licensing"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400">
            &copy; {currentYear} Entrovex Media Group. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            System Status: Operational
          </div>
        </div>
      </div>
    </footer>
  );
}