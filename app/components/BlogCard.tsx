"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Eye, Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const BlogCard = ({ blog, index }: { blog: any; index: number }) => {
  
  // Safe Read Time Calculation
  const calculateReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  // Safe Description/Content logic
  const description = blog.metaDescription || 
                      (blog.content ? blog.content.substring(0, 100).replace(/<[^>]*>/g, '') + "..." : "No description available.");

  // Stats Logic (Backend arrays ki length nikalne ke liye)
  const likesCount = blog.likes?.length || 0;
  const commentsCount = blog.comments?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Link 
        href={`/home/blogs/${blog.slug}`} 
        className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={blog.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
            alt={blog.title}
          />
          
          {/* Category Tag */}
          <div className="absolute top-6 left-6">
            <span className="px-5 py-2.5 bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl">
              {blog.categoryId?.name || "Uncategorized"}
            </span>
          </div>

          {/* Floating Stats Bar */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/10 transition-colors group-hover:bg-blue-600/40">
              <Eye size={12} className="text-blue-300" /> {blog.views || 0}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/10 transition-colors group-hover:bg-red-600/40">
              <Heart size={12} className="text-red-300" /> {likesCount}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/10 transition-colors group-hover:bg-green-600/40">
              <MessageCircle size={12} className="text-green-300" /> {commentsCount}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10 flex flex-col flex-1">
          <div className="flex items-center gap-4 text-slate-400 text-[9px] font-black uppercase tracking-widest mb-5">
            <span className="flex items-center gap-1.5 text-blue-600">
              <Clock size={12}/> {calculateReadTime(blog.content)}
            </span>
            <span>•</span>
            <span>
              {blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt)) + " ago" : "Recently"}
            </span>
          </div>
          
          <h3 className="text-2xl font-[1000] text-slate-900 mb-4 leading-[1.2] tracking-tighter group-hover:text-blue-600 transition-colors line-clamp-2 italic">
            {blog.title}
          </h3>
          
          <p className="text-slate-500 font-medium line-clamp-2 mb-8 text-sm leading-relaxed">
            {description}
          </p>

          {/* Footer Area */}
          <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
               <img
  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${blog.authorId?.username || 'user'}`}
  alt="avatar"
/>

              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Writer</span>
                <span className="text-xs font-black text-slate-800">{blog.authorId?.username || "Anonymous"}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden p-4 h-[550px]">
      <div className="h-60 bg-slate-100 rounded-[2rem] animate-pulse mb-8" />
      <div className="px-6 space-y-4">
        <div className="flex gap-2">
           <div className="h-6 w-20 bg-slate-50 rounded-full animate-pulse" />
           <div className="h-6 w-20 bg-slate-50 rounded-full animate-pulse" />
        </div>
        <div className="h-3 w-1/4 bg-slate-100 rounded animate-pulse" />
        <div className="h-8 w-full bg-slate-100 rounded animate-pulse" />
        <div className="h-20 w-full bg-slate-100 rounded animate-pulse" />
        <div className="flex items-center gap-3 pt-6">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
};