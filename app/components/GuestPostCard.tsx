"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Eye, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const GuestPostCard = ({ post, index }: { post: any; index: number }) => {
  
  const calculateReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  const description = post.articleContent 
    ? post.articleContent.substring(0, 100).replace(/<[^>]*>/g, '') + "..." 
    : "No preview available for this story.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full group relative"
    >
      {/* Outer Neon Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#9b2dee]/20 to-[#e300b4]/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

      <Link 
        href={`/home/guest-posts/${post.slug}`}
        className="relative flex flex-col h-full bg-[#1a022d]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all duration-500"
      >
        {/* Image Section */}
        <div className="relative h-60 overflow-hidden">
          <img 
            src={post.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
            alt={post.articleTitle}
          />
          
          {/* Labels */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-4 py-1.5 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white text-[9px] font-[1000] uppercase tracking-widest rounded-xl shadow-lg">
              Community
            </span>
          </div>

          {/* Views Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118] via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-white/70 text-[10px] font-black border border-white/10">
              <Eye size={12} className="text-[#e300b4]" /> Feed View
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
            <span className="flex items-center gap-1.5 text-[#9b2dee]">
              <Clock size={12}/> {calculateReadTime(post.articleContent)}
            </span>
            <span>•</span>
            <span>
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + " ago" : "Recent"}
            </span>
          </div>
          
          <h3 className="text-xl font-[1000] text-white mb-3 leading-tight tracking-tighter group-hover:text-[#e300b4] transition-colors line-clamp-2 italic uppercase">
            {post.articleTitle}
          </h3>
          
          <p className="text-white/40 font-medium line-clamp-2 mb-6 text-sm leading-relaxed">
            {description}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden p-0.5">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.name || 'Guest'}`}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Writer</span>
                <span className="text-xs font-black text-white/80">{post.name || "Guest"}</span>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-[#0d0118] transition-all transform group-hover:rotate-12">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const GuestSkeleton = () => (
  <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-4 h-[520px] animate-pulse">
    <div className="h-52 bg-white/5 rounded-[2rem] mb-6" />
    <div className="px-4 space-y-4">
      <div className="h-2 w-1/4 bg-white/5 rounded" />
      <div className="h-6 w-full bg-white/5 rounded" />
      <div className="h-12 w-full bg-white/5 rounded" />
      <div className="flex items-center gap-3 pt-6">
        <div className="w-10 h-10 rounded-xl bg-white/5" />
        <div className="h-4 w-24 bg-white/5 rounded" />
      </div>
    </div>
  </div>
);