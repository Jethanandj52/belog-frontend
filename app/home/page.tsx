"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
  Inbox,
  LayoutDashboard,
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

  // BLOGS
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // GUEST POSTS
  const [guestPosts, setGuestPosts] = useState<any[]>([]);

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
          const sortedBlogs = [...blogRes.data.blogs].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );
          setAllPosts(sortedBlogs);
        }

        if (guestRes.data.success) {
          setGuestPosts(
            guestRes.data.posts.filter((p: any) => p.status === "approved")
          );
        }
      } catch (err) {
        console.error("Home Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // BLOG FILTER
  const filteredBlogs = useMemo(() => {
    return allPosts.filter((b) => {
      const matchesSearch = b.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const catName = b.categoryId?.name || "";
      const matchesCat =
        selectedCategory === "All" || catName === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory, allPosts]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 overflow-x-hidden">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              The Future of Content
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[8rem] font-[950] tracking-tighter mb-8 leading-[0.85]"
          >
            WRITE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">
              DOMINATE.
            </span>
          </motion.h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 font-medium">
            Empowering creators with a premium, high-performance blogging
            experience.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl flex items-center gap-3 uppercase text-xs tracking-widest"
              >
                Go to Dashboard <LayoutDashboard size={18} />
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl flex items-center gap-3 uppercase text-xs tracking-widest"
              >
                Get Started <ArrowRight size={18} />
              </button>
            )}

            <button
              onClick={() => setDemoOpen(true)}
              className="px-10 py-5 bg-white border border-slate-100 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 uppercase text-xs tracking-widest shadow-sm"
            >
              <Play className="w-5 h-5 fill-blue-600 text-blue-600" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

 

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3].map((i) => (
                  <BlogSkeleton key={i} />
                ))}
              </div>
            ) : (
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredBlogs.map((blog, i) => (
                  <BlogCard key={blog._id} blog={blog} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* GUEST POSTS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-12">Community Guest Posts</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <GuestSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {guestPosts.map((post, i) => (
                <GuestPostCard key={post._id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div id="about">
        <AboutPage />
      </div>

      <div id="contact">
        <ContactPage />
      </div>

      <footer className="py-10 text-center border-t border-slate-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          © 2025 DOMINATE. Developed with Passion.
        </p>
      </footer>
    </div>
  );
}
