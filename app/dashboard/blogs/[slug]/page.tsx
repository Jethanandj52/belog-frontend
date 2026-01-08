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
        const { data } = await axios.get(`https://belogbackend.vercel.app/blogs/${slug}`);
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
    <div className="min-h-screen flex items-center justify-center bg-[#0d0118]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-t-2 border-[#ff00c8] rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-b-2 border-[#9b2dee] rounded-full animate-spin-reverse"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">Loading Masterpiece...</p>
      </div>
    </div>
  );

  if (!blog) return <div className="text-center py-20 font-black text-[#ff00c8] bg-[#0d0118] min-h-screen">BLOG NOT FOUND</div>;

  return (
    <div className="bg-[#0d0118] min-h-screen pb-20 selection:bg-[#ff00c8] selection:text-white text-white relative overflow-x-hidden">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0 pointer-events-none" />
      
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] z-50 origin-left shadow-[0_0_10px_#ff00c8]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* --- FLOATING NAV --- */}
      <nav className="sticky top-0 z-40 bg-[#0d0118]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
          <Link href="/dashboard/blogs" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#ff00c8] transition-all">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex gap-2 md:gap-3">
            <button className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-[#ff00c8] border border-white/5 transition-all">
              <Share2 size={16} className="md:w-[18px]" />
            </button>
            <button className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-[#ff00c8] border border-white/5 transition-all">
              <Bookmark size={16} className="md:w-[18px]" />
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* --- HERO SECTION --- */}
        <header className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 bg-[#ff00c8]/10 border border-[#ff00c8]/20 text-[#ff00c8] rounded-full mb-6 md:mb-8 shadow-[0_0_20px_rgba(255,0,200,0.1)]"
          >
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{blog.categoryId?.name || "Insight"}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-[1000] text-white leading-[0.95] tracking-tighter mb-8 md:mb-12 uppercase italic break-words"
          >
            {blog.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white/40 mb-12 md:mb-16"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 shadow-xl overflow-hidden p-1">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorId?.username}`} className="rounded-xl bg-white/10" alt="avatar" />
              </div>
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-white/80">{blog.authorId?.username}</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest border-l border-white/10 pl-4 md:pl-0 md:border-none">
              <Calendar size={14} className="text-[#9b2dee]" /> {new Date(blog.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest border-l border-white/10 pl-4 md:pl-0 md:border-none">
              <Eye size={14} className="text-[#ff00c8]" /> {blog.views} Views
            </div>
          </motion.div>
        </header>

        {/* --- FEATURED IMAGE --- */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video md:aspect-[21/9] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <img src={blog.featuredImage} className="w-full h-full object-cover" alt="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118]/60 to-transparent" />
          </motion.div>
        </div>

        {/* --- MAIN CONTENT & GALLERY --- */}
        <main className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col gap-12 md:gap-20">
            
            {/* Article Text */}
            <article className="relative">
              <div className="absolute -left-4 md:-left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#ff00c8] via-transparent to-transparent hidden sm:block" />
              <div className="text-white/80 text-lg md:text-2xl leading-[1.7] md:leading-[1.8] whitespace-pre-wrap font-medium">
                <span className="text-6xl md:text-9xl font-[1000] text-[#ff00c8] float-left mr-3 md:mr-4 mt-1 md:mt-2 leading-none italic">
                  {blog.content.charAt(0)}
                </span>
                {blog.content.substring(1)}
              </div>
            </article>

            {/* --- MULTIPLE IMAGES GALLERY --- */}
            {blog.images && blog.images.length > 0 && (
              <section className="space-y-8 md:space-y-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                    <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-[#9b2dee]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-[1000] uppercase tracking-tighter italic">Project Gallery</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {blog.images.map((img: string, idx: number) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -10 }}
                      className={`rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl cursor-pointer ${idx === 0 ? 'sm:col-span-2' : ''}`}
                    >
                      <img src={img} className="w-full h-full object-cover max-h-[300px] md:max-h-[500px]" alt={`gallery-${idx}`} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 md:gap-3 py-8 md:py-12 border-y border-white/5">
              {blog.tags?.map((tag: string, i: number) => (
                <span key={i} className="px-4 py-2 md:px-6 md:py-2.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#ff00c8] hover:border-[#ff00c8]/50 transition-all">
                  # {tag}
                </span>
              ))}
            </div>

            {/* --- AUTHOR CARD --- */}
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 md:gap-12 group transition-all hover:border-white/20">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[3rem] bg-[#ff00c8] rotate-12 absolute inset-0 -z-10 opacity-20 group-hover:rotate-[15deg] transition-transform" />
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl p-2 bg-[#1a012e]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorId?.username}`} className="rounded-2xl" alt="author" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#ff00c8] mb-2 md:mb-3">Verified Author</p>
                <h4 className="text-2xl md:text-3xl font-[1000] text-white tracking-tighter mb-3 md:mb-4 italic uppercase">{blog.authorId?.username}</h4>
                <p className="text-white/40 leading-relaxed text-sm md:text-lg mb-6 md:mb-8">Expert in web architecture and creative storytelling. Building digital experiences in the neon world.</p>
                <button className="flex items-center gap-3 mx-auto md:mx-0 text-[10px] md:text-xs font-black uppercase tracking-widest text-white hover:text-[#ff00c8] transition-all group/btn">
                  See All Stories <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}