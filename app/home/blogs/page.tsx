"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, Inbox, Sparkles } from "lucide-react";
import { BlogCard, BlogSkeleton } from "../../components/BlogCard";
import { GuestPostCard, GuestSkeleton } from "../../components/GuestPostCard";
import { motion, AnimatePresence } from "framer-motion";

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
        const [blogRes, catRes, guestRes] = await Promise.all([
          axios.get("https://belogbackend.vercel.app/blogs"),
          axios.get("https://belogbackend.vercel.app/categories"),
          axios.get("https://belogbackend.vercel.app/guest-posts")
        ]);

        let combinedData: any[] = [];

        if (blogRes.data.success) {
          combinedData = [...blogRes.data.blogs];
        }

        if (guestRes.data.success) {
          const approvedGuests = guestRes.data.posts
            .filter((p: any) => p.status === "approved")
            .map((p: any) => ({
              ...p,
              isGuest: true
            }));

          combinedData = [...combinedData, ...approvedGuests];
        }

        combinedData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setAllArticles(combinedData);

        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((item) => {
      const title =
        item.isGuest ? item.articleTitle || "" : item.title || "";

      const matchesSearch = title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const itemCatName =
        item.categoryId?.name || item.category?.name || "";

      const matchesCategory =
        selectedCategory === "All" || itemCatName === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allArticles]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white pb-32 relative overflow-x-hidden">

      {/* HEADER */}
      <header className="relative z-10 pt-24 md:pt-40 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Sparkles size={12} className="text-[#ff00c8]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                  Neural Archives
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-9xl font-[1000] tracking-tighter uppercase italic leading-[0.85]">
                The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] via-[#e300b4] to-[#ff00c8]">
                  Library
                </span>
              </h1>

              <p className="max-w-md text-white/40 text-sm md:text-lg font-bold italic border-l-2 border-[#e300b4] pl-6 uppercase">
                Accessing {allArticles.length} digital data streams.
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-[450px]">
              <div className="relative flex items-center bg-[#1a022d]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2">
                <div className="p-4 bg-gradient-to-br from-[#9b2dee] to-[#ff00c8] rounded-full">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="SEARCH ARCHIVES..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent px-6 outline-none font-black text-xs tracking-widest uppercase italic placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex overflow-x-auto gap-4 mt-12 pb-4">
            <FilterChip
              label="All Data"
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
            />
            {categories.map((cat) => (
              <FilterChip
                key={cat._id}
                label={cat.name}
                active={selectedCategory === cat.name}
                onClick={() => setSelectedCategory(cat.name)}
              />
            ))}
          </div>
        </div>
      </header>

      {/* GRID */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 mt-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <GuestSkeleton key={i} />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {filteredArticles.map((article, index) =>
                article.isGuest ? (
                  <GuestPostCard
                    key={article._id}
                    post={article}
                    index={index}
                  />
                ) : (
                  <BlogCard
                    key={article._id}
                    blog={article}
                    index={index}
                  />
                )
              )}
            </motion.div>
          ) : (
            <div className="py-40 text-center">
              <Inbox size={48} className="mx-auto text-white/10 mb-6" />
              <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter text-white/40">
                Archive Void
              </h3>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function FilterChip({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest italic transition-all ${
        active
          ? "bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] text-white"
          : "bg-white/5 text-white/40 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
