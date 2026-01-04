"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, LayoutGrid, Filter, Inbox } from "lucide-react";
import { BlogCard, BlogSkeleton } from "../components/BlogCard"; // Path check karlein

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search aur Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Blogs Fetch karein
        const blogRes = await axios.get("http://localhost:5000/blogs");
        // 2. Categories Fetch karein (Dropdown ke liye)
        const catRes = await axios.get("http://localhost:5000/categories");

        if (blogRes.data.success) setBlogs(blogRes.data.blogs);
        if (catRes.data.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || blog.categoryId?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* --- HEADER & FILTERS --- */}
      <header className="bg-white border-b border-slate-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-[1000] tracking-tighter text-slate-900 uppercase">
                The Library
              </h1>
              <p className="text-slate-400 font-medium italic">
                Explore {blogs.length} stories from our community creators.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-3 mt-10">
            <button 
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === "All" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat.name ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- BLOG GRID --- */}
      <main className="max-w-7xl mx-auto px-6 mt-16">
        {loading ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          // Real Data
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>
        ) : (
          // No Results State
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Inbox size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Articles Found</h3>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </main>
    </div>
  );
}