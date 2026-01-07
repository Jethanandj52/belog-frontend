"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, Inbox, Sparkles } from "lucide-react";
import { BlogCard, BlogSkeleton } from "../../components/BlogCard";

export default function BlogListPage() {
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Dono APIs se data fetch karna
        const [blogRes, catRes, guestRes] = await Promise.all([
          axios.get("https://belogbackend.vercel.app/blogs"),
          axios.get("https://belogbackend.vercel.app/categories"),
          axios.get("https://belogbackend.vercel.app/guest-posts")
        ]);

        let combinedData: any[] = [];

        // 1. Normal Blogs ko array mein daalna
        if (blogRes.data.success) {
          combinedData = [...blogRes.data.blogs];
        }

        // 2. Guest Posts ko map karke normal blogs jaisa banana
        if (guestRes.data.success) {
          const approvedGuests = guestRes.data.posts
            .filter((p: any) => p.status === "approved") // Sirf approved wali
            .map((p: any) => ({
              ...p,
              // Yahan fields match kar rahe hain hum
              title: p.articleTitle,         
              image: p.featuredImage,        
              content: p.articleContent,     
              author: { username: p.name },  // Author object structure match karna
              isGuest: true                  // Pehchan ke liye ke ye guest post hai
            }));
          
          combinedData = [...combinedData, ...approvedGuests];
        }

        // 3. Newest First sorting
        combinedData.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setAllArticles(combinedData);
        if (catRes.data.success) setCategories(catRes.data.categories);
        
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic (Search + Category)
  const filteredArticles = useMemo(() => {
    return allArticles.filter((item) => {
      const title = item.title || "";
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category check (Normal blogs aur Guest posts dono ke liye)
      const itemCatName = item.categoryId?.name || item.category?.name || "";
      const matchesCategory = selectedCategory === "All" || itemCatName === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allArticles]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-100 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                <Sparkles size={12} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Premium Content</span>
              </div>
              <h1 className="text-6xl font-[1000] tracking-tighter text-slate-900 uppercase leading-none">
                The Library
              </h1>
              <p className="text-slate-400 font-medium italic">
                Discover {allArticles.length} curated stories from our elite creators.
              </p>
            </div>

            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text"
                placeholder="Search articles & authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-sm transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-3 mt-12">
            <button 
              onClick={() => setSelectedCategory("All")}
              className={`px-8 py-3 rounded-2xl text-[10px] font-[1000] uppercase tracking-[0.2em] transition-all ${
                selectedCategory === "All" 
                ? "bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-105" 
                : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-[1000] uppercase tracking-[0.2em] transition-all ${
                  selectedCategory === cat.name 
                  ? "bg-blue-600 text-white shadow-2xl shadow-blue-100 scale-105" 
                  : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- GRID SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 mt-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => <BlogSkeleton key={i} />)}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((article, index) => (
              <div key={article._id} className="relative">
                {/* Guest Badge agar post guest wali hai */}
                {article.isGuest && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-400 text-black text-[9px] font-black uppercase rounded-lg shadow-xl">
                    Guest Post
                  </div>
                )}
                <BlogCard blog={article} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8">
              <Inbox size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">No Articles Found</h3>
            <p className="text-slate-400 mt-2">Try searching for something else or change the category.</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All")}}
              className="mt-8 text-blue-600 font-bold underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}