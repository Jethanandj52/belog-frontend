"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { Calendar, ArrowLeft, Globe, Link as LinkIcon, Zap, ShieldCheck, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GuestPostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await axios.get(`https://belogbackend.vercel.app/guest-posts/${slug}`);
        if (data.success) setPost(data.post);
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetail();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0118]">
      <div className="flex flex-col items-center gap-4">
        <Zap className="text-amber-500 animate-pulse" size={48} />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Verifying Protocol...</p>
      </div>
    </div>
  );

  if (!post) return <div className="min-h-screen flex items-center justify-center bg-[#0d0118] font-black uppercase text-red-500">Post Not Found</div>;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white selection:bg-amber-500/30 pb-32">
      
      {/* GLOWING BACKGROUND DECOR */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#9b2dee]/5 blur-[120px] rounded-full" />
      </div>

      {/* TOP NAV */}
      <nav className="relative z-10 max-w-5xl mx-auto px-6 py-10 flex justify-between items-center">
        <Link href="/home/guest-posts" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-amber-400 transition-all">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
          Back to Archives
        </Link>
        <Share2 size={18} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
      </nav>

      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-[1000] uppercase tracking-[0.3em] rounded-full mb-10"
        >
          <ShieldCheck size={14} /> External Contributor
        </motion.div>
        
        <h1 className="text-5xl md:text-8xl font-[1000] tracking-tighter leading-[0.9] mb-12 italic uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
          {post.articleTitle}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-10 border-y border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0d0118] font-[1000] uppercase italic text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {post.name?.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Data By</p>
              <p className="text-base font-[1000] text-white uppercase italic tracking-tight">{post.name}</p>
            </div>
          </div>

          <div className="h-10 w-px bg-white/5 hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
              <Calendar size={20} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Broadcast</p>
              <p className="text-base font-[1000] text-white uppercase italic tracking-tight">
                {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURED IMAGE WITH CYBER FRAME */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
        <div className="relative p-1 md:p-2 rounded-[3.5rem] bg-gradient-to-br from-amber-500/40 via-transparent to-[#9b2dee]/40">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[3rem] shadow-2xl">
            <img 
              src={post.featuredImage} 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
              alt={post.articleTitle}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118] via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <article 
          className="prose prose-invert prose-xl max-w-none 
          prose-p:text-white/60 prose-p:leading-relaxed prose-p:italic prose-p:font-medium
          prose-headings:text-white prose-headings:font-[1000] prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
          prose-strong:text-amber-500 prose-strong:font-black
          prose-img:rounded-[2.5rem] prose-img:border prose-img:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.articleContent }} 
        />

        {/* EXTERNAL LINKS SECTION (FOOTER) */}
        {(post.website || post.backlink) && (
          <div className="mt-24 p-1 rounded-[3rem] bg-gradient-to-r from-amber-500/20 to-transparent group">
            <div className="p-8 md:p-12 bg-[#1a022d]/80 backdrop-blur-2xl rounded-[2.8rem] border border-white/5">
              <h4 className="text-[10px] font-[1000] uppercase tracking-[0.4em] text-amber-500 mb-8 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-amber-500/30"></span> Origin Source
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.website && (
                  <a href={post.website} target="_blank" className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group/link">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover/link:scale-110 transition-transform">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase mb-1">Contributor Site</p>
                      <p className="text-sm font-black text-white uppercase italic tracking-wider">Launch Terminal</p>
                    </div>
                  </a>
                )}
                
                {post.backlink && (
                  <a href={post.backlink} target="_blank" className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-[#9b2dee]/50 hover:bg-[#9b2dee]/5 transition-all group/link">
                    <div className="p-3 bg-[#9b2dee]/10 rounded-xl text-[#9b2dee] group-hover/link:scale-110 transition-transform">
                      <LinkIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/30 uppercase mb-1">Deep Link</p>
                      <p className="text-sm font-black text-white uppercase italic tracking-wider truncate">
                        {post.anchorText || "Explore Protocol"}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAV BAR (Mobile Optimization) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] bg-[#1a022d]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex justify-around items-center">
         <ArrowLeft size={20} className="text-white/40" onClick={() => router.back()} />
         <div className="h-6 w-px bg-white/10" />
         <span className="text-[10px] font-black uppercase text-amber-500">Guest Post</span>
         <div className="h-6 w-px bg-white/10" />
         <Share2 size={20} className="text-white/40" />
      </div>

    </div>
  );
}