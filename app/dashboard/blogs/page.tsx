"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Search, Clock, ArrowUpRight, Images as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("https://belogbackend.vercel.app/blogs");
      if (data.success) {
        const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
        const myBlogs = data.blogs.filter((b: any) => b.authorId?._id === userId);
        setBlogs(myBlogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this masterpiece?")) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`https://belogbackend.vercel.app/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setBlogs(blogs.filter((blog: any) => blog._id !== id));
        alert("Blog deleted successfully!");
      }
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  const filteredBlogs = blogs.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0118] text-white p-4 sm:p-6 md:p-8 relative selection:bg-[#ff00c8] selection:text-white overflow-x-hidden">
      {/* Background Styling */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 md:mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[1000] uppercase tracking-tighter italic leading-tight">
              My <span className="text-[#ff00c8]">Articles</span>
            </h2>
            <p className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-2">Manage your stories & gallery</p>
          </motion.div>
          
          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ff00c8] transition-colors w-4 h-4 md:w-5 md:h-5" />
            <input 
              className="w-full pl-14 pr-6 py-3.5 md:py-4 bg-white/5 border border-white/10 rounded-2xl md:rounded-[1.5rem] text-xs font-bold outline-none focus:border-[#ff00c8]/50 transition-all backdrop-blur-xl placeholder:text-white/20" 
              placeholder="SEARCH POSTS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- BLOGS GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[1, 2, 3].map((i) => <BlogSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog: any, index: number) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden hover:border-[#ff00c8]/30 transition-all duration-500 shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                    <img 
                      src={blog.featuredImage || "https://via.placeholder.com/400"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" 
                      alt={blog.title}
                    />
                    
                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2">
                      <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#0d0118]/80 backdrop-blur-md text-[#ff00c8] text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-xl border border-[#ff00c8]/20">
                        {blog.categoryId?.name || "Uncategorized"}
                      </span>
                      {blog.images && blog.images.length > 0 && (
                        <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#9b2dee]/80 backdrop-blur-md text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/10 flex items-center gap-2">
                          <ImageIcon className="w-3 h-3" /> +{blog.images.length} Photos
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons Overlay - Always visible on mobile, hover on desktop */}
                    <div className="absolute inset-0 bg-black/40 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                      <Link href={`/dashboard/blogs/edit/${blog._id}`} className="p-3.5 md:p-4 bg-white text-black rounded-xl md:rounded-2xl hover:bg-[#ff00c8] hover:text-white transition-all transform hover:-translate-y-1 shadow-xl">
                        <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(blog._id)}
                        className="p-3.5 md:p-4 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl md:rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all transform hover:-translate-y-1 shadow-xl"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-1 relative">
                    <div className="flex items-center gap-3 text-white/30 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mb-3 md:mb-4">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-[#9b2dee]"/> {new Date(blog.createdAt).toLocaleDateString('en-GB')}</span>
                      <span className="h-1 w-1 bg-white/10 rounded-full" />
                      <span className={`uppercase ${blog.status === 'published' ? 'text-emerald-400' : 'text-orange-400'}`}>{blog.status}</span>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-[1000] text-white mb-3 md:mb-4 leading-tight group-hover:text-[#ff00c8] transition-colors line-clamp-2 italic uppercase">
                      {blog.title}
                    </h3>
                    
                    <p className="text-white/40 font-medium text-xs md:text-sm line-clamp-2 mb-6 md:mb-8 leading-relaxed">
                      {blog.content.substring(0, 90)}...
                    </p>

                    <div className="mt-auto pt-5 md:pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden p-1">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorId?.username}`} className="rounded-lg bg-white/10" alt="avatar" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/60">
                          {blog.authorId?.username || "You"}
                        </span>
                      </div>
                      <Link href={`/dashboard/blogs/${blog.slug}`} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#ff00c8] group-hover:text-white group-hover:border-[#ff00c8] transition-all transform group-hover:rotate-12">
                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* --- EMPTY STATE --- */}
        {!loading && filteredBlogs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 md:py-32 bg-white/5 rounded-[2rem] md:rounded-[4rem] border border-white/10 backdrop-blur-md mx-2"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 border border-white/5">
              <ImageIcon className="text-white/10 w-8 h-8 md:w-10 md:h-10" />
            </div>
            <p className="text-white/20 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs px-4">No articles matched your search</p>
            <Link href="/dashboard/blogs/create" className="inline-block mt-6 md:mt-8 px-6 py-3.5 md:px-8 md:py-4 bg-[#ff00c8] text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-xl md:rounded-2xl hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(255,0,200,0.2)]">
              Create Your First Post →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const BlogSkeleton = () => (
  <div className="bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/5 overflow-hidden p-4 md:p-5 h-full shadow-sm">
    <div className="h-56 sm:h-64 md:h-72 bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] animate-pulse mb-6 md:mb-8" />
    <div className="px-2 md:px-4 pb-4 md:pb-6 space-y-4 md:space-y-6">
      <div className="h-3 w-1/4 bg-white/5 rounded-full animate-pulse" />
      <div className="h-6 md:h-8 w-full bg-white/10 rounded-xl animate-pulse" />
      <div className="h-12 md:h-16 w-full bg-white/5 rounded-2xl md:rounded-3xl animate-pulse mt-4" />
    </div>
  </div>
);