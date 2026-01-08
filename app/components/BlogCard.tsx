"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const BlogCard = ({ blog, index }: { blog: any; index: number }) => {
  
  const calculateReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  const description = blog.metaDescription || 
                      (blog.content ? blog.content.substring(0, 85).replace(/<[^>]*>/g, '') + "..." : "No description available.");

  const likesCount = blog.likes?.length || 0;
  const commentsCount = blog.comments?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative h-full"
    >
      {/* Invisible Glow Behind Card on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

      <Link 
        href={`/home/blogs/${blog.slug}`} 
        className="relative flex flex-col h-full bg-[#0d0118]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500"
      >
        {/* Top Image Section */}
        <div className="relative h-56 m-3 overflow-hidden rounded-[1.8rem]">
          <img 
            src={blog.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643"} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
            alt={blog.title}
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118]/80 via-transparent to-transparent" />
          
          {/* Category Pill */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              {blog.categoryId?.name || "Topic"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-8 pt-2 flex flex-col flex-1">
          {/* Time & Date */}
          <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-[0.1em] mb-4">
            <span className="flex items-center gap-1.5 text-[#e300b4]">
              <Clock size={12}/> {calculateReadTime(blog.content)}
            </span>
            <span>•</span>
            <span>{blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt)) + " ago" : "Just now"}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 leading-snug tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all line-clamp-2">
            {blog.title}
          </h3>
          
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-6 font-medium italic">
            "{description}"
          </p>

          {/* Bottom Bar */}
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Simple Stats */}
              <div className="flex items-center gap-1.5 text-white/30 text-xs font-bold">
                <Heart size={14} className="group-hover:text-[#e300b4] transition-colors" /> {likesCount}
              </div>
              <div className="flex items-center gap-1.5 text-white/30 text-xs font-bold">
                <MessageCircle size={14} className="group-hover:text-[#9b2dee] transition-colors" /> {commentsCount}
              </div>
            </div>

            {/* Author Small Icon */}
            <div className="flex items-center gap-2">
               <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${blog.authorId?.username || 'user'}`}
                alt="user"
                className="w-6 h-6 rounded-lg bg-white/5 p-0.5 border border-white/10"
              />
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">{blog.authorId?.username || "Guest"}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const BlogSkeleton = () => {
  return (
    <div className="bg-[#0d0118]/40 border border-white/5 rounded-[2.5rem] p-3 h-[480px] animate-pulse">
      <div className="h-52 bg-white/5 rounded-[1.8rem] mb-6" />
      <div className="px-6 space-y-4">
        <div className="h-2 w-20 bg-white/5 rounded" />
        <div className="h-6 w-full bg-white/10 rounded" />
        <div className="h-12 w-full bg-white/5 rounded" />
        <div className="flex justify-between pt-8">
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-6 w-6 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
};