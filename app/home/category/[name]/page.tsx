"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Inbox, Sparkles } from "lucide-react";
import { BlogCard, BlogSkeleton } from "../../../components/BlogCard";

export default function CategoryPage() {
  const { name } = useParams(); // URL se category name nikalne ke liye
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]); // type added for safety
  const [loading, setLoading] = useState(true);

  // ✅ Client-side effect only
  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        setLoading(true);
        // Backend API jo category ke hisaab se filter kare
        const res = await axios.get(`http://localhost:5000/blogs?category=${name}`);
        if (res.data.success) {
          setBlogs(res.data.blogs);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error("Error fetching category blogs:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (name) fetchCategoryBlogs();
  }, [name]);

  // ✅ Decode category name safely
  const decodedName = typeof name === "string" ? decodeURIComponent(name) : "";

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back Button & Header */}
        <div className="mb-16">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            BACK TO EXPLORE
          </button>

          <div className="flex items-center gap-3 text-blue-600 font-black text-[11px] uppercase tracking-[0.4em] mb-4">
            <Sparkles size={16} /> 
            Category Collection
          </div>

          <h1 className="text-6xl md:text-8xl font-[1000] tracking-tightest italic text-slate-950 uppercase leading-none">
            {decodedName}<span className="text-blue-600">.</span>
          </h1>

          <p className="text-slate-500 mt-6 text-lg font-medium italic">
            Showing all stories filed under {decodedName}
          </p>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => <BlogSkeleton key={i} />)}
          </div>
        ) : blogs.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {blogs.map((blog, i) => (
              <BlogCard key={i} blog={blog} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="py-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
            <Inbox size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-black text-slate-400 uppercase">No stories in this category yet</h3>
          </div>
        )}
      </div>
    </div>
  );
}
