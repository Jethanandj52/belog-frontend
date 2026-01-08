"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, MessageCircle, Send, X, Sparkles,
  ChevronLeft, ChevronRight, Share2, Zap, CornerDownRight 
} from "lucide-react";
import { format } from "date-fns";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`https://belogbackend.vercel.app/blogs/${slug}`);
      if (res.data.success) setBlog(res.data.blog);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (slug) fetchBlog(); }, [slug]);

  const handleLike = async () => {
    try {
      const res = await axios.put(`https://belogbackend.vercel.app/blogs/${blog._id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setBlog({ ...blog, likes: new Array(res.data.likesCount) });
      }
    } catch (err) { alert("Please login to like"); }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`https://belogbackend.vercel.app/blogs/${blog._id}/comment`, { text: commentText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBlog({ ...blog, comments: res.data.comments });
      setCommentText("");
    } catch (err) { alert("Login required to comment"); }
  };

  const allImages = blog?.images ? [blog.featuredImage, ...blog.images] : [blog?.featuredImage];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0118] text-white">
      <Zap className="text-[#9b2dee] animate-bounce mb-4" size={40} />
      <span className="font-black uppercase tracking-[0.3em] text-xs opacity-50 text-white">Loading Story...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white relative selection:bg-[#ff00c8]/30">
      
      {/* --- BACKGROUND GLOWS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#9b2dee]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[#e300b4]/10 blur-[100px] rounded-full" />
      </div>

      <article className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-32">
        {/* Header Section */}
        <header className="mb-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles size={14} className="text-[#e300b4]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#9b2dee]">
              {blog.categoryId?.name}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-[1000] leading-[0.9] mb-10 tracking-tighter uppercase italic italic">
            {blog.title}
          </h1>

          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9b2dee] to-[#e300b4] p-[1px]">
              <div className="w-full h-full bg-[#0d0118] rounded-xl flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${blog.authorId?.username}`} className="w-full h-full object-cover" alt="avatar" />
              </div>
            </div>
            <div className="text-left">
              <p className="font-[1000] text-sm uppercase tracking-widest">{blog.authorId?.username}</p>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-tighter mt-1">
                {format(new Date(blog.createdAt), 'MMM dd, yyyy')} • {blog.views} views
              </p>
            </div>
          </div>
        </header>

        {/* Hero Image Section */}
        <div 
          className="relative group cursor-pointer mb-20 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
          onClick={() => { setCurrentImgIndex(0); setIsGalleryOpen(true); }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0118]/80 z-10 opacity-60" />
          <img src={blog.featuredImage} className="w-full h-auto group-hover:scale-105 transition-transform duration-1000" alt="Featured" />
          {allImages.length > 1 && (
            <div className="absolute bottom-8 right-8 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              + {allImages.length - 1} More Views
            </div>
          )}
        </div>

        {/* Content Area - Glassmorphism */}
        <div className="relative mb-24">
          <div className="absolute -inset-4 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] -z-10 border border-white/5" />
          <div 
            className="prose prose-invert prose-lg max-w-none p-8 md:p-12 text-white/70 font-medium leading-relaxed italic-headings"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </div>

        {/* Interactions Bar */}
        <div className="flex items-center justify-between py-8 border-y border-white/5 mb-20">
          <div className="flex gap-10">
            <button onClick={handleLike} className="group flex items-center gap-3">
              <div className={`p-3 rounded-2xl transition-all ${isLiked ? "bg-red-500/20" : "bg-white/5 group-hover:bg-white/10"}`}>
                <Heart size={22} className={isLiked ? "fill-red-500 text-red-500" : "text-white/40"} />
              </div>
              <span className="font-black text-sm tracking-widest">{blog.likes?.length || 0}</span>
            </button>
            <div className="group flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-2xl">
                <MessageCircle size={22} className="text-white/40" />
              </div>
              <span className="font-black text-sm tracking-widest">{blog.comments?.length || 0}</span>
            </div>
          </div>
          <button className="p-3 bg-white/5 rounded-2xl hover:bg-[#9b2dee]/20 transition-all">
            <Share2 size={22} className="text-white/40" />
          </button>
        </div>

        {/* Comments - Dark Metaverse Style */}
        <section className="space-y-12">
          <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter">The Conversation</h3>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] rounded-3xl blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
            <div className="relative flex gap-4 bg-[#1a012e]/50 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
              <div className="w-12 h-12 rounded-full bg-white/5 flex-shrink-0 border border-white/5" />
              <div className="flex-1 relative">
                <textarea 
                  value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-transparent border-none focus:ring-0 outline-none h-20 text-sm text-white placeholder:text-white/20 resize-none font-bold"
                />
                <button onClick={handleComment} className="absolute bottom-0 right-0 p-3 bg-gradient-to-r from-[#9b2dee] to-[#e300b4] text-white rounded-2xl shadow-lg hover:scale-105 transition-all">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {blog.comments?.map((c: any) => (
              <div key={c._id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-5">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.user?.username}`} className="w-12 h-12 rounded-2xl border border-white/10" alt="u" />
                  <div className="flex-1">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] rounded-tl-none hover:border-white/20 transition-all">
                      <p className="font-black text-[10px] uppercase tracking-widest mb-2 text-[#9b2dee]">{c.user?.username}</p>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">{c.text}</p>
                    </div>
                    <div className="flex gap-6 mt-3 px-2">
                      <button onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#e300b4] transition-colors">Reply</button>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/10">{format(new Date(c.createdAt), 'MMM dd')}</span>
                    </div>

                    {/* Replies - Sub Cards */}
                    {c.replies?.map((r: any) => (
                      <div key={r._id} className="mt-4 flex gap-4 ml-6 pl-6 border-l border-white/5">
                        <CornerDownRight size={14} className="text-[#9b2dee] mt-1" />
                        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex-1 hover:border-white/10">
                          <p className="font-black text-[9px] uppercase tracking-widest text-white/40 mb-1">{r.user?.username}</p>
                          <p className="text-sm text-white/60 font-medium">{r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* Styles for content alignment */}
      <style jsx global>{`
        .italic-headings h1, .italic-headings h2, .italic-headings h3 {
          font-style: italic;
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: -0.05em;
        }
      `}</style>
    </div>
  );
}