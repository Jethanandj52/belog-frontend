"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Eye, Heart, MessageCircle, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const BlogCard = ({ blog, index }: { blog: any; index: number }) => {
  
  const calculateReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  const description = blog.metaDescription || 
                      (blog.content ? blog.content.substring(0, 100).replace(/<[^>]*>/g, '') + "..." : "Neural data incoming...");

  const likesCount = blog.likes?.length || 0;
  const commentsCount = blog.comments?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full w-full"
    >
      <Link 
        href={`/admin/blogs/${blog.slug}`} 
        className="group flex flex-col h-full bg-[#11011A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden hover:border-[#ff00c8]/40 hover:shadow-[0_0_30px_rgba(255,0,200,0.1)] transition-all duration-500 relative"
      >
        {/* Neon Glow Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#9b2dee]/5 to-[#ff00c8]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Image Container */}
        <div className="relative h-52 md:h-64 overflow-hidden shrink-0">
          <img 
            src={blog.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0" 
            alt={blog.title}
          />
          
          {/* Category Tag */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
            <span className="px-3 py-1.5 md:px-5 md:py-2.5 bg-[#0d0118]/80 backdrop-blur-md text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] rounded-xl border border-white/10 shadow-2xl">
              {blog.categoryId?.name || "Uncategorized"}
            </span>
          </div>

          {/* Floating Stats Bar - Adaptive Grid */}
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex flex-wrap items-center gap-2 max-w-[90%]">
            {[
              { icon: Eye, val: blog.views || 0, color: "blue" },
              { icon: Heart, val: likesCount, color: "red" },
              { icon: MessageCircle, val: commentsCount, color: "green" }
            ].map((stat, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[9px] md:text-[10px] font-bold border border-white/10 transition-colors group-hover:bg-${stat.color}-600/20`}>
                <stat.icon size={12} className={`text-${stat.color}-400`} /> {stat.val}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10 flex flex-col flex-1 relative z-10">
          <div className="flex items-center gap-3 text-white/40 text-[9px] font-black uppercase tracking-widest mb-4">
            <span className="flex items-center gap-1.5 text-[#9b2dee]">
              <Clock size={12}/> {calculateReadTime(blog.content)}
            </span>
            <span className="opacity-30">•</span>
            <span>
              {blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt)) + " ago" : "Active"}
            </span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-[1000] text-white mb-3 md:mb-4 leading-[1.2] tracking-tighter group-hover:text-[#ff00c8] transition-colors line-clamp-2 italic uppercase">
            {blog.title}
          </h3>
          
          <p className="text-white/50 font-medium line-clamp-2 mb-6 md:mb-8 text-xs md:text-sm leading-relaxed">
            {description}
          </p>

          {/* Footer Area */}
          <div className="mt-auto pt-6 md:pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#1a012e] border border-white/10 shadow-sm overflow-hidden flex items-center justify-center">
                <img
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${blog.authorId?.username || 'user'}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/20">Uploader</span>
                <span className="text-[10px] md:text-xs font-bold text-white/80 truncate max-w-[80px] md:max-w-full">{blog.authorId?.username || "Admin"}</span>
              </div>
            </div>
            
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#ff00c8] group-hover:text-white group-hover:shadow-[0_0_15px_#ff00c8] transition-all transform group-hover:rotate-12">
              <ArrowUpRight size={20} className="md:size-[22px]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const BlogSkeleton = () => {
  return (
    <div className="bg-[#11011A] border border-white/5 rounded-[2.5rem] overflow-hidden p-4 h-[500px] md:h-[550px] animate-pulse">
      <div className="h-52 md:h-60 bg-white/5 rounded-[2rem] mb-8" />
      <div className="px-6 space-y-4">
        <div className="flex gap-2">
           <div className="h-6 w-20 bg-white/5 rounded-full" />
           <div className="h-6 w-20 bg-white/5 rounded-full" />
        </div>
        <div className="h-3 w-1/4 bg-white/5 rounded" />
        <div className="h-8 w-full bg-white/5 rounded" />
        <div className="h-20 w-full bg-white/5 rounded" />
        <div className="flex items-center gap-3 pt-6">
          <div className="w-10 h-10 rounded-2xl bg-white/5" />
          <div className="h-4 w-24 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
};