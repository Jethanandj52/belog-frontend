"use client";
import React from "react";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-20 md:pt-32 pb-8 md:pb-12 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white">
      
      {/* --- BACKGROUND GLOWS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[60%] md:w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] -right-[5%] w-[50%] md:w-[30%] h-[40%] bg-[#e300b4]/10 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ================= TOP SECTION: CTA ================= */}
        <div className="relative group mb-16 md:mb-24">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] rounded-[2rem] md:rounded-[3rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000" />
          
          <div className="relative flex flex-col lg:flex-row gap-10 p-8 md:p-16 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] items-center text-center lg:text-left">
            <div className="flex-1">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Sparkles size={16} className="text-[#e300b4]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Get Started</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-[1000] tracking-tighter mb-4 italic text-white leading-tight uppercase">
                Ready to amplify <br className="hidden md:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] via-[#e300b4] to-[#ff00c8]">
                  your voice?
                </span>
              </h2>
              <p className="text-slate-400 font-medium text-base md:text-lg">Join 2,000+ creators at Entrovex today.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:justify-end">
              <Link href="/home/write" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
                Start Writing <ArrowRight size={18} />
              </Link>
              <Link href="/home/contact" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center border border-white/10 uppercase text-[10px] md:text-xs tracking-widest backdrop-blur-md">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* ================= MAIN LINKS SECTION ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-16 mb-16 md:mb-24">
          
          {/* Logo & Socials - Full width on smallest mobile */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9b2dee] to-[#e300b4] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all shadow-[0_0_15px_rgba(227,0,180,0.3)]">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="text-2xl font-[1000] tracking-tighter uppercase text-white italic">
                Entrovex
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-8 font-medium italic">
              "The most advanced platform for SEO-driven content and high-authority guest posting." 
            </p>
            <div className="flex gap-3">
              {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-[#e300b4] hover:shadow-[0_0_15px_#e300b4] transition-all border border-white/10">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            { title: "Platform", links: ["Features", "Writers", "Case Studies", "Pricing"] },
            { title: "Resources", links: ["Documentation", "Help Center", "Guidelines", "API Status"] },
            { title: "Legal", links: ["Privacy", "Terms", "Cookie Policy", "Licensing"] }
          ].map((col) => (
            <div key={col.title} className="col-span-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9b2dee] mb-6 md:mb-8">{col.title}</h3>
              <ul className="space-y-3 md:space-y-4">
                {col.links.map(item => (
                  <li key={item}>
                    <Link href="#" className="text-xs md:text-sm font-bold text-white/40 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] order-2 md:order-1">
            &copy; {currentYear} Entrovex Media Group. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 order-1 md:order-2">
             <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Systems: Online
             </div>
             <p className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">
                Design V.2.0
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}