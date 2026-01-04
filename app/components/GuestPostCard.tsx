"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Eye, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/* ======================================================
   GUEST POST CARD - Pure Independent Component
   (Removed all blog-related logic and paths)
====================================================== */

export const GuestPostCard = ({ post, index }: { post: any; index: number }) => {
  
  // Content length se reading time nikalna
  const calculateReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  // Article content se HTML tags remove karke short description banana
  const description = post.articleContent 
    ? post.articleContent.substring(0, 100).replace(/<[^>]*>/g, '') + "..." 
    : "No preview available for this guest story.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      {/* IMPORTANT: Link path changed to /home/guest-posts/
          and slug format updated to match your backend (guest-ID)
      */}
      <Link 
       href={`/home/guest-posts/${post.slug}`}
        className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500"
      >
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={post.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
            alt={post.articleTitle}
          />
          
          {/* Labels */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="px-5 py-2.5 bg-amber-400 text-black text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl">
              Community Guest
            </span>
            <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/20">
              {post.category?.name || "Uncategorized"}
            </span>
          </div>

          {/* Quick Stat */}
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/10 group-hover:bg-amber-500/40 transition-colors">
              <Eye size={12} className="text-amber-300" /> Community View
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 flex flex-col flex-1">
          <div className="flex items-center gap-4 text-slate-400 text-[9px] font-black uppercase tracking-widest mb-5">
            <span className="flex items-center gap-1.5 text-amber-600">
              <Clock size={12}/> {calculateReadTime(post.articleContent)}
            </span>
            <span>•</span>
            <span>
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + " ago" : "Recently"}
            </span>
          </div>
          
          <h3 className="text-2xl font-[1000] text-slate-900 mb-4 leading-[1.2] tracking-tighter group-hover:text-amber-600 transition-colors line-clamp-2 italic uppercase">
            {post.articleTitle}
          </h3>
          
          <p className="text-slate-500 font-medium line-clamp-2 mb-8 text-sm leading-relaxed">
            {description}
          </p>

          {/* Guest Author Footer */}
          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 overflow-hidden flex items-center justify-center">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.name || 'Guest'}`}
                  alt="guest-avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contributor</span>
                <span className="text-xs font-black text-slate-800">{post.name || "Anonymous Guest"}</span>
              </div>
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all transform group-hover:rotate-12 shadow-sm">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* =========================
    GUEST SKELETON
========================= */
export const GuestSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 h-[550px] animate-pulse">
    <div className="h-60 bg-slate-100 rounded-[2rem] mb-8" />
    <div className="px-6 space-y-4">
      <div className="h-3 w-1/4 bg-slate-100 rounded" />
      <div className="h-8 w-full bg-slate-100 rounded" />
      <div className="h-20 w-full bg-slate-100 rounded" />
      <div className="flex items-center gap-3 pt-6">
        <div className="w-10 h-10 rounded-2xl bg-slate-100" />
        <div className="h-4 w-24 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);

/* =========================
   GUEST SKELETON
========================= */
 