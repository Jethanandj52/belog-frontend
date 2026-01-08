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

  const router = useRouter();
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white overflow-x-hidden relative selection:bg-[#ff00c8]/40">
      
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#9b2dee]/25 blur-[140px] rounded-full" />
        <div className="absolute top-[10%] -right-[5%] w-[50%] h-[50%] bg-[#e300b4]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] -left-[10%] w-[50%] h-[50%] bg-[#7c3aed]/15 blur-[130px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-[#4a0e6d]/30 blur-[160px] rounded-full" />
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* HERO SECTION - Responsive Centered */}
      <section className="relative z-10 pt-32 md:pt-48 pb-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-[#ff00c8] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
              Platform is Live
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-[1000] tracking-tighter leading-[0.9] mb-8 uppercase italic">
            WRITE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] via-[#e300b4] to-[#ff00c8] filter drop-shadow-[0_5px_15px_rgba(227,0,180,0.4)]">
              GROW.
            </span>
          </h1>
          
          <p className="max-w-xl text-slate-400 text-base md:text-lg mb-12 leading-relaxed border-l-0 lg:border-l-2 border-[#e300b4] lg:pl-6">
            A simple platform to read, write, and share quality content with people around the world.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <button
              onClick={() => isLoggedIn ? router.push("/dashboard") : setIsAuthOpen(true)}
              className="relative group w-full sm:w-auto px-12 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#9b2dee] to-[#e300b4] shadow-[0_0_30px_rgba(227,0,180,0.4)] hover:shadow-[#e300b4]/60 transition-all"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest text-white">
                {isLoggedIn ? "Go to Dashboard" : "Get Started"} <ArrowRight size={18} />
              </span>
            </button>
            <button 
              onClick={() => setDemoOpen(true)} 
              className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md"
            >
               <Play className="fill-white" size={16} /> Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right visual - Hidden on small mobile for centering focus */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="relative hidden lg:block h-[500px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#9b2dee] to-[#e300b4] blur-[120px] opacity-10" />
          <div className="relative bg-[#1a022d]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] h-full shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#ff00c8] shadow-[0_0_10px_#ff00c8]" />
                <div className="w-3 h-3 rounded-full bg-[#9b2dee]" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Content Feed
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative p-6">
              <motion.div animate={{ y: ["0%", "-50%"] }} transition={{ duration: 10, ease: "linear", repeat: Infinity }} className="space-y-6">
                {[...allPosts.slice(0, 5), ...guestPosts.slice(0, 5), ...allPosts.slice(0, 5), ...guestPosts.slice(0, 5)].map((post, idx) => (
                  <div key={`${post._id}-${idx}`} className="p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#ff00c8]/30 transition-all cursor-default">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[8px] font-[1000] uppercase tracking-widest px-2 py-1 rounded-md ${post.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#ff00c8]/10 text-[#ff00c8]'}`}>
                        {post.status ? 'Guest Post' : 'Official Blog'}
                      </span>
                      <span className="text-[9px] text-white/30 font-bold uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2 line-clamp-1 group-hover:text-[#ff00c8] transition-colors">{post.title}</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9b2dee] to-[#ff00c8] flex items-center justify-center text-[10px] font-black">{post.author?.username?.charAt(0) || "U"}</div>
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">{post.author?.username || "User"}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1a022d] via-transparent to-[#1a022d] opacity-80" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* SEARCH - Centered */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-20 md:mb-32">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 p-2 md:p-3 rounded-2xl md:rounded-[2.5rem] flex items-center shadow-2xl focus-within:ring-2 ring-[#e300b4]/50 transition-all">
          <div className="p-3 md:p-4 bg-gradient-to-br from-[#9b2dee] to-[#ff00c8] rounded-xl md:rounded-[1.8rem] shadow-neon animate-pulse shrink-0">
            <Zap size={20} className="fill-white text-white" />
          </div>
          <input 
            type="text" 
            placeholder="Search blogs and articles..."
            className="flex-1 bg-transparent border-none px-4 md:px-8 outline-none text-white font-bold placeholder:text-white/40 text-sm md:text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* BLOG FEED - Centered Headers */}
      <section className="relative z-10 py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter">
              Latest Blogs
            </h2>
            <div className="h-[2px] w-full md:flex-1 bg-gradient-to-r from-[#ff00c8] via-[#9b2dee] to-transparent" />
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {[1, 2, 3].map(i => <BlogSkeleton key={i} />)}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {filteredBlogs.map((blog, i) => (
                  <div key={blog._id} className="relative p-[2px] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-white/20 via-transparent to-[#e300b4]/30 hover:to-[#ff00c8] transition-all duration-500 h-full">
                    <div className="bg-[#1a022d]/90 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden h-full">
                       <BlogCard blog={blog} index={i} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* COMMUNITY - Fully Centered */}
      <section className="relative z-10 py-20 md:py-32 border-t border-white/10 bg-gradient-to-t from-[#0d0118] to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#9b2dee] to-[#ff00c8] flex items-center justify-center mb-6 shadow-neon">
              <Globe size={32} className="text-white" />
            </div>
            <h2 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter">
              Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00c8] to-[#ff7700]">Posts</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
             {guestPosts.map((post, i) => (
               <div key={post._id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-[2rem] shadow-2xl hover:scale-[1.03] transition-transform">
                  <GuestPostCard post={post} index={i} />
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