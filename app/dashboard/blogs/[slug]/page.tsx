"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { 
  Clock, 
  Eye, 
  Tag, 
  ChevronLeft, 
  Share2, 
  Bookmark,
  Calendar,
  LayoutGrid,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/blogs/${slug}`);
        if (data.success) {
          setBlog(data.blog);
        }
      } catch (err) {
        console.error("Error fetching blog details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlogDetail();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Masterpiece...</p>
      </div>
    </div>
  );

  if (!blog) return <div className="text-center py-20 font-bold">Blog Not Found</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* --- FLOATING NAV --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
          <Link href="/dashboard/blogs" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="max-w-4xl mx-auto px-6 pt-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full mb-8"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">{blog.categoryId?.name || "Insight"}</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-7xl font-[1000] text-slate-900 leading-[1] tracking-tighter mb-10"
        >
          {blog.title}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 text-slate-400 mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorId?.username}`} alt="avatar" />
            </div>
            <span className="text-sm font-bold text-slate-900">{blog.authorId?.username}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Calendar size={14} className="text-blue-600" /> {new Date(blog.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Eye size={14} className="text-blue-600" /> {blog.views} Views
          </div>
        </motion.div>
      </header>

      {/* --- FEATURED IMAGE --- */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/10"
        >
          <img src={blog.featuredImage} className="w-full h-full object-cover" alt="hero" />
        </motion.div>
      </div>

      {/* --- MAIN CONTENT & GALLERY --- */}
      <main className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col gap-16">
          
          {/* Article Text */}
          <article className="prose prose-slate lg:prose-xl max-w-none">
            <p className="text-2xl leading-relaxed text-slate-600 font-medium mb-12 first-letter:text-7xl first-letter:font-black first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left">
              {blog.content.split('.')[0]}.
            </p>
            <div className="text-slate-800 text-lg leading-[2] whitespace-pre-wrap">
               {blog.content.substring(blog.content.indexOf('.') + 1)}
            </div>
          </article>

          {/* --- MULTIPLE IMAGES GALLERY --- */}
          {blog.images && blog.images.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <LayoutGrid size={20} className="text-blue-600" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Project Gallery</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.images.map((img: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className={`rounded-[2rem] overflow-hidden shadow-md cursor-zoom-in ${idx === 0 ? 'md:col-span-2' : ''}`}
                  >
                    <img src={img} className="w-full h-full object-cover max-h-[400px]" alt={`gallery-${idx}`} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 py-10 border-t border-slate-100">
            {blog.tags?.map((tag: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
                # {tag}
              </span>
            ))}
          </div>

          {/* --- AUTHOR CARD --- */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-28 h-28 rounded-[2.5rem] bg-blue-600 rotate-6 absolute inset-0 -z-10 opacity-20" />
              <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorId?.username}`} alt="author" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Author Insight</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tighter mb-3">{blog.authorId?.username}</h4>
              <p className="text-slate-500 leading-relaxed mb-6">Expert in web architecture and creative storytelling. Building digital experiences at Task-Hive.</p>
              <button className="flex items-center gap-2 mx-auto md:mx-0 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-all">
                All Stories <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}