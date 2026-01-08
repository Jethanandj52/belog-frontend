"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Sparkles, Inbox, Zap } from "lucide-react";
import { BlogCard, BlogSkeleton } from "../components/BlogCard";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const blogRes = await axios.get("https://belogbackend.vercel.app/blogs");
        const catRes = await axios.get("https://belogbackend.vercel.app/categories");

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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || blog.categoryId?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white pb-32 relative overflow-hidden">
      
      {/* --- BACKGROUND GLOW EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-5%] w-[30%] h-[40%] bg-[#e300b4]/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* --- HEADER SECTION --- */}
        <header className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#e300b4] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Knowledge Base</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter text-white uppercase italic leading-[0.85]">
                  The <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] via-[#e300b4] to-[#ff00c8]">Library</span>
                </h1>
                <p className="text-white/40 font-medium italic text-lg max-w-md">
                  Explore {blogs.length} stories from our community creators.
                </p>
              </div>

              {/* Search Bar - Glassmorphism */}
              <div className="relative w-full lg:w-[450px] group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                <div className="relative flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
                  <Search className="ml-5 text-white/30" size={20} />
                  <input 
                    type="text"
                    placeholder="Search the archives..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-6 py-5 bg-transparent outline-none font-bold text-sm text-white placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Category Chips - Scrollable */}
            <div className="flex items-center gap-4 mt-16 overflow-x-auto pb-4 no-scrollbar">
              <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
                <Zap size={14} className="text-[#9b2dee]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Filters:</span>
              </div>
              
              <button 
                onClick={() => setSelectedCategory("All")}
                className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-[1000] uppercase tracking-widest transition-all duration-300 border ${
                  selectedCategory === "All" 
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                  : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                All Topics
              </button>

              {categories.map((cat) => (
                <button 
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-[1000] uppercase tracking-widest transition-all duration-300 border ${
                    selectedCategory === cat.name 
                    ? "bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white border-transparent shadow-[0_0_20px_rgba(227,0,180,0.3)]" 
                    : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* --- BLOG GRID --- */}
        <main className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredBlogs.map((blog, index) => (
                <BlogCard key={blog._id} blog={blog} index={index} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto mb-8">
                <Inbox size={40} className="text-white/10" />
              </div>
              <h3 className="text-2xl font-[1000] text-white uppercase tracking-tighter italic">No Data Found</h3>
              <p className="text-white/30 text-sm mt-3 tracking-widest uppercase">The archives are empty for this search.</p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("All")}}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#9b2dee] hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}