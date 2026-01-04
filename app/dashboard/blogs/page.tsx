"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Search, Clock, User, ArrowUpRight, Loader2, Images } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch User's Blogs from Backend
  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/blogs");
      if (data.success) {
        // LocalStorage se logged-in user ki ID nikaalna
        const userId = localStorage.getItem("userId");
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

  // 2. Delete Blog Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this masterpiece?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`http://localhost:5000/blogs/${id}`, {
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

  // Filtered Blogs for Search
  const filteredBlogs = blogs.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h2 className="text-3xl font-[1000] uppercase tracking-tighter text-slate-900">My Articles</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage your stories & gallery</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm" 
            placeholder="SEARCH POSTS..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- BLOGS GRID --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => <BlogSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredBlogs.map((blog: any, index: number) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col h-full bg-white text-black rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={blog.featuredImage || "https://via.placeholder.com/400"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={blog.title}
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm w-fit">
                      {blog.categoryId?.name || "Uncategorized"}
                    </span>
                    {blog.images && blog.images.length > 0 && (
                      <span className="px-4 py-2 bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm flex items-center gap-2 w-fit">
                        <Images size={12} /> +{blog.images.length} Photos
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <Link href={`/dashboard/blogs/edit/${blog._id}`} className="p-3 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all">
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="p-3 bg-white text-red-600 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(blog.createdAt).toLocaleDateString('en-GB')}</span>
                    <span className="h-1 w-1 bg-slate-200 rounded-full" />
                    <span className="uppercase">{blog.status}</span>
                  </div>
                  
                  <h3 className="text-xl font-[1000] text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-8 italic">
                    "{blog.content.substring(0, 90)}..."
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User size={14} className="text-slate-600" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                        {blog.authorId?.username || "You"}
                      </span>
                    </div>
                    <Link href={`/dashboard/blogs/${blog.slug}`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                      <ArrowUpRight size={18} />
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
        <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-inner">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Images className="text-slate-200" size={32} />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">No articles matched your search</p>
          <Link href="/dashboard/blogs/create" className="inline-block mt-6 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">
            Create Your First Post →
          </Link>
        </div>
      )}
    </div>
  );
}

// --- SKELETON LOADER ---
const BlogSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden p-4 h-full shadow-sm">
    <div className="h-64 bg-slate-50 rounded-[2rem] animate-pulse mb-8" />
    <div className="px-4 pb-6 space-y-4">
      <div className="h-3 w-1/4 bg-slate-100 rounded-full animate-pulse" />
      <div className="h-6 w-full bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-10 w-full bg-slate-50 rounded-2xl animate-pulse mt-2" />
    </div>
  </div>
);