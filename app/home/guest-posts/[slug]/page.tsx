"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { Calendar, User, ArrowLeft, Globe, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function GuestPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Backend API calling using SLUG
        const { data } = await axios.get(`https://belogbackend.vercel.app/guest-posts/${slug}`);
        if (data.success) {
          setPost(data.post);
        }
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetail();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic animate-pulse text-slate-400 font-black uppercase tracking-widest">Loading Story...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-red-500">Post Not Found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/home/guest-posts" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
        </Link>
      </nav>

      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 pb-12 text-center">
        <div className="inline-block px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-8 border border-amber-100">
          Guest Contributor
        </div>
        
        <h1 className="text-4xl md:text-6xl font-[1000] tracking-tighter text-slate-900 leading-[1.1] mb-10 italic uppercase">
          {post.articleTitle}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-y border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold uppercase italic text-sm shadow-lg">
              {post.name?.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Written By</p>
              <p className="text-sm font-black text-slate-800 tracking-tight">{post.name}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-100 hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
              <Calendar size={18} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Published On</p>
              <p className="text-sm font-black text-slate-800 tracking-tight">
                {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-8 border-white">
          <img 
            src={post.featuredImage} 
            className="w-full h-full object-cover" 
            alt={post.articleTitle}
          />
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <article 
          className="prose prose-lg prose-slate max-w-none 
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
          prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:italic
          prose-strong:text-slate-900 prose-strong:font-black
          prose-img:rounded-[2rem]"
          dangerouslySetInnerHTML={{ __html: post.articleContent }} 
        />

        {/* Footer Info / Backlinks */}
        {(post.website || post.backlink) && (
          <div className="mt-20 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-[11px] font-[1000] uppercase tracking-[0.2em] text-slate-400 mb-6">About the Contributor</h4>
            <div className="flex flex-col gap-4">
              {post.website && (
                <a href={post.website} target="_blank" className="flex items-center gap-3 text-slate-600 hover:text-amber-600 transition-colors font-bold text-sm">
                  <Globe size={18} className="text-slate-400" /> Visit Official Website
                </a>
              )}
              {post.backlink && (
                <a href={post.backlink} target="_blank" className="flex items-center gap-3 text-slate-600 hover:text-amber-600 transition-colors font-bold text-sm">
                  <LinkIcon size={18} className="text-slate-400" /> {post.anchorText || "Read More Resources"}
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}