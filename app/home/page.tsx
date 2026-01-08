"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Play, Sparkles, Inbox, LayoutDashboard, Zap, Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// Components
import AboutPage from "../components/About";
import ContactPage from "../components/Contact";
import AuthModal from "../components/AuthModal";
import DemoVideoModal from "../components/DemoVideoModal";
import { BlogCard, BlogSkeleton } from "../components/BlogCard";
import { GuestPostCard, GuestSkeleton } from "../components/GuestPostCard";

export default function HomePage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [guestPosts, setGuestPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [blogRes, guestRes] = await Promise.all([
          axios.get("https://belogbackend.vercel.app/blogs"),
          axios.get("https://belogbackend.vercel.app/guest-posts"),
        ]);
        if (blogRes.data.success) {
          setAllPosts([...blogRes.data.blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
        if (guestRes.data.success) {
          setGuestPosts(guestRes.data.posts.filter((p: any) => p.status === "approved"));
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchHomeData();
  }, []);

  const filteredBlogs = useMemo(() => {
    return allPosts.filter((b) => {
      const matchesSearch = b.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const catName = b.categoryId?.name || "";
      return matchesSearch && (selectedCategory === "All" || catName === selectedCategory);
    });
  }, [searchQuery, selectedCategory, allPosts]);

  return (
    // Base Background changed from Black to a Deep Radial Gradient
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white overflow-x-hidden relative selection:bg-[#ff00c8]/40">
      
      {/* --- ENHANCED MULTI-DIRECTIONAL NEON GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        {/* Top Left Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#9b2dee]/25 blur-[140px] rounded-full" />
        {/* Top Right Glow */}
        <div className="absolute top-[10%] -right-[5%] w-[50%] h-[50%] bg-[#e300b4]/20 blur-[120px] rounded-full animate-pulse" />
        {/* Bottom Left Glow */}
        <div className="absolute bottom-[-10%] -left-[10%] w-[50%] h-[50%] bg-[#7c3aed]/15 blur-[130px] rounded-full" />
        {/* Bottom Right Glow */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-[#4a0e6d]/30 blur-[160px] rounded-full" />
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* --- HERO SECTION --- */}
       <section className="relative z-10 pt-48 pb-24 text-left max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-[#ff00c8] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Neural Network Active</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter leading-[0.9] mb-8 uppercase italic">
            WRITE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] via-[#e300b4] to-[#ff00c8] filter drop-shadow-[0_5px_15px_rgba(227,0,180,0.4)]">
              DOMINATE.
            </span>
          </h1>
          
          <p className="max-w-xl text-slate-400 text-lg mb-12 leading-relaxed border-l-2 border-[#e300b4] pl-6">
            The ultimate metaverse for content architects. Forge your legacy in the digital void with high-octane performance.
          </p>

          <div className="flex flex-wrap gap-6">
            <button onClick={() => !isLoggedIn && setIsAuthOpen(true)} className="relative group px-12 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#9b2dee] to-[#e300b4] shadow-[0_0_30px_rgba(227,0,180,0.4)] hover:shadow-[#e300b4]/60 transition-all">
              <span className="relative z-10 flex items-center gap-3 font-black uppercase text-xs tracking-widest">
                {isLoggedIn ? "Access Dashboard" : "Start Forging"} <ArrowRight size={18} />
              </span>
            </button>
            <button onClick={() => setDemoOpen(true)} className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
               <Play className="fill-white" size={16} /> View Trailer
            </button>
          </div>
        </motion.div>

        {/* Floating Abstract Visual (Like in the image) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#9b2dee] to-[#e300b4] blur-[80px] opacity-20" />
          <div className="relative bg-[#1a022d]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
             </div>
             <div className="space-y-4">
                <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse" />
                <div className="h-32 w-full bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-2xl border border-white/5" />
             </div>
          </div>
        </motion.div>
      </section>
      {/* --- GRADIENT SEARCH (No Black) --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 p-3 rounded-[2.5rem] flex items-center shadow-2xl focus-within:ring-2 ring-[#e300b4]/50 transition-all">
          <div className="p-4 bg-gradient-to-br from-[#9b2dee] to-[#ff00c8] rounded-[1.8rem] shadow-neon animate-pulse">
             <Zap size={24} className="fill-white text-white" />
          </div>
          <input 
            type="text" 
            placeholder="Scan the neural network..."
            className="flex-1 bg-transparent border-none px-8 outline-none text-white font-bold placeholder:text-white/40 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* --- CONTENT FEED (Gradient Containers) --- */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent via-[#1a012e]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter">Live Transmissions</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-[#ff00c8] via-[#9b2dee] to-transparent" />
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1, 2, 3].map(i => <BlogSkeleton key={i} />)}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredBlogs.map((blog, i) => (
                  <div key={blog._id} className="relative p-[2px] rounded-[2.5rem] bg-gradient-to-br from-white/20 via-transparent to-[#e300b4]/30 hover:to-[#ff00c8] transition-all duration-500 group">
                    <div className="bg-[#1a022d]/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden h-full">
                       <BlogCard blog={blog} index={i} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- COMMUNITY (Multi-Directional Glow Footer) --- */}
      <section className="relative z-10 py-32 bg-gradient-to-t from-[#0d0118] to-transparent border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-24">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#9b2dee] to-[#ff00c8] flex items-center justify-center mb-6 shadow-neon animate-spin-slow">
              <Globe size={40} className="text-white" />
            </div>
            <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter text-center">
              NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00c8] to-[#ff7700]">COMMUNITY</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
             {guestPosts.map((post, i) => (
               <div key={post._id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-[2rem] p-1 shadow-2xl hover:scale-[1.03] transition-transform">
                  <div className="bg-[#130121]/80 rounded-[1.9rem] p-4 h-full">
                    <GuestPostCard post={post} index={i} />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      <div id="about"><AboutPage /></div>
      <div id="contact"><ContactPage /></div>

      
    </div>
  );
}