"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Play, Sparkles, Search, 
  Inbox, LayoutDashboard
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
import CategoryPill from "../components/CategoryPill";

export default function HomePage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Real Data States
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const router = useRouter();

  useEffect(() => {
    // Login Check
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch Blogs + Guest Posts
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [blogRes, catRes, guestRes] = await Promise.all([
          axios.get("http://localhost:5000/blogs"),
          axios.get("http://localhost:5000/categories"),
          axios.get("http://localhost:5000/guest-posts")
        ]);

        let combinedPosts: any[] = [];

        // Normal Blogs
        if (blogRes.data.success) {
          combinedPosts = [...blogRes.data.blogs];
        }

        // Guest Posts (approved only)
        if (guestRes.data.success) {
          const approvedGuests = guestRes.data.posts
            .filter((p: any) => p.status === "approved")
            .map((p: any) => ({
              _id: p._id,
              title: p.articleTitle,
              content: p.articleContent,
              images: [{ url: p.featuredImage }],
              author: { username: p.name },
              categoryId: p.category, // category filter ke liye
              createdAt: p.createdAt,
              slug: `guest-${p._id}`,
              isGuest: true
            }));

          combinedPosts = [...combinedPosts, ...approvedGuests];
        }

        // Latest first
        combinedPosts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setAllPosts(combinedPosts);

        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }

      } catch (err) {
        console.error("Home Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Filter Logic (Search + Category)
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

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">The Future of Content</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-[8rem] font-[950] tracking-tighter mb-8 leading-[0.85] text-slate-900">
            WRITE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">DOMINATE.</span>
          </motion.h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 font-medium">
            Empowering creators with a premium, high-performance blogging experience.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl flex items-center gap-3 uppercase text-xs tracking-widest">
                Go to Dashboard <LayoutDashboard size={18} />
              </Link>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl flex items-center gap-3 uppercase text-xs tracking-widest">
                Get Started <ArrowRight size={18} />
              </button>
            )}

            <button onClick={() => setDemoOpen(true)} className="px-10 py-5 bg-white border border-slate-100 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 uppercase text-xs tracking-widest shadow-sm">
              <Play className="w-5 h-5 fill-blue-600 text-blue-600" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY SECTION (UNCHANGED) ================= */}
      {/* SAME AS YOUR CODE – NO CHANGE */}

      {/* ================= BLOG FEED ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3].map(i => <BlogSkeleton key={i} />)}
              </div>
            ) : filteredBlogs.length > 0 ? (
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredBlogs.map((blog, i) => (
                  <div key={blog._id} className="relative">
                    {blog.isGuest && (
                      <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-400 text-black text-[9px] font-black uppercase rounded-lg shadow-xl">
                        Guest Post
                      </span>
                    )}
                    <BlogCard blog={blog} index={i} />
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="py-32 text-center">
                <Inbox size={64} className="mx-auto text-slate-100 mb-6" />
                <h3 className="text-2xl font-black uppercase text-slate-300">
                  No matching stories
                </h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div id="about"><AboutPage /></div>
      <div id="contact"><ContactPage /></div>

      <footer className="py-10 text-center border-t border-slate-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          © 2025 DOMINATE. Developed with Passion.
        </p>
      </footer>
    </div>
  );
}
