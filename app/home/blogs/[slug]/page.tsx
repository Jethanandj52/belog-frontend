"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, MessageCircle, Send, X, 
  ChevronLeft, ChevronRight, Share2, CornerDownRight, Zap, Eye, Calendar
} from "lucide-react";
import { format } from "date-fns";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
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
      if (res.data.success) {
        setBlog(res.data.blog);
      }
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

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(`https://belogbackend.vercel.app/blogs/${blog._id}/comment/${commentId}/reply`, { text: replyText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBlog({ ...blog, comments: res.data.comments });
      setReplyText("");
      setReplyingTo(null);
    } catch (err) { alert("Login required to reply"); }
  };

  const allImages = blog?.images ? [blog.featuredImage, ...blog.images] : [blog?.featuredImage];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0118]">
      <div className="flex flex-col items-center gap-4">
        <Zap className="text-[#ff00c8] animate-pulse" size={48} />
        <p className="text-white font-black italic uppercase tracking-widest text-xs">Decrypting Story...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_50%,_#1a012e_0%,_#0d0118_100%)] text-white relative selection:bg-[#ff00c8]/40">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-[#9b2dee]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-[#e300b4]/10 blur-[150px] rounded-full" />
      </div>

      {/* TOP NAV / BACK BUTTON */}
      {/* <nav className="sticky top-0 z-[100] bg-[#1a012e]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 group">
            <ChevronLeft size={20} className="text-[#ff00c8] group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50 group-hover:opacity-100 transition-opacity">Back to Vault</span>
          </button>
          <Share2 size={18} className="text-white/40 hover:text-[#ff00c8] cursor-pointer" />
        </div>
      </nav> */}

      <article className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 pt-12 pb-32">
        {/* HEADER */}
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Zap size={12} className="text-[#ff00c8]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff00c8]">{blog.categoryId?.name}</span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-[1000] leading-[0.9] mb-12 uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
            {blog.title}
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/40">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${blog.authorId?.username}`} className="w-8 h-8 rounded-lg" alt="av" />
              <p className="font-black italic uppercase text-[10px] tracking-widest text-white">{blog.authorId?.username}</p>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar size={14} className="text-[#9b2dee]" /> {format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
              <span className="flex items-center gap-2"><Eye size={14} className="text-[#e300b4]" /> {blog.views} Nodes</span>
            </div>
          </div>
        </header>

        {/* FEATURED IMAGE WITH CYBER BORDER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative p-[2px] rounded-[2.5rem] bg-gradient-to-br from-white/20 via-transparent to-[#ff00c8]/40 mb-20 group cursor-zoom-in"
          onClick={() => { setCurrentImgIndex(0); setIsGalleryOpen(true); }}
        >
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <img src={blog.featuredImage} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Featured" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118] via-transparent to-transparent opacity-60" />
            {allImages.length > 1 && (
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase italic tracking-widest">
                + {allImages.length - 1} Visuals
              </div>
            )}
          </div>
        </motion.div>

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-invert prose-lg max-w-none 
              prose-p:text-white/70 prose-p:leading-relaxed prose-p:italic
              prose-headings:font-[1000] prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
              prose-strong:text-[#ff00c8] prose-strong:font-black
              prose-img:rounded-[2rem] prose-img:border prose-img:border-white/10
              mb-20" 
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />

          {/* REACTIONS */}
          <div className="flex items-center gap-8 py-10 border-y border-white/5 mb-24">
            <button onClick={handleLike} className="flex items-center gap-3 group">
              <div className={`p-4 rounded-2xl transition-all duration-300 ${isLiked ? 'bg-[#ff00c8] shadow-[0_0_20px_rgba(255,0,200,0.4)]' : 'bg-white/5 hover:bg-white/10'}`}>
                <Heart size={24} className={isLiked ? "fill-white text-white" : "text-white/40 group-hover:text-white"} />
              </div>
              <div className="text-left leading-none">
                <p className="text-[14px] font-[1000] italic uppercase">{blog.likes?.length || 0}</p>
                <p className="text-[10px] uppercase font-black text-white/30 tracking-widest mt-1">Applause</p>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-white/5">
                <MessageCircle size={24} className="text-white/40" />
              </div>
              <div className="text-left leading-none">
                <p className="text-[14px] font-[1000] italic uppercase">{blog.comments?.length || 0}</p>
                <p className="text-[10px] uppercase font-black text-white/30 tracking-widest mt-1">Transmissions</p>
              </div>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <section className="space-y-12">
            <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter">Transmissions</h3>
            
            {/* INPUT */}
            <div className="flex flex-col md:flex-row gap-6 mb-16">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=user`} className="w-12 h-12 rounded-2xl border border-white/10" alt="me" />
              <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] rounded-3xl blur opacity-10 group-focus-within:opacity-40 transition" />
                <textarea 
                  value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  placeholder="ENCODE NEW MESSAGE..."
                  className="relative w-full p-6 bg-[#1a022d]/80 backdrop-blur-xl border border-white/10 rounded-3xl outline-none focus:border-white/30 h-32 text-xs font-bold tracking-widest uppercase italic placeholder:text-white/10"
                />
                <button onClick={handleComment} className="absolute bottom-4 right-4 p-4 bg-[#ff00c8] text-white rounded-2xl hover:scale-110 transition shadow-lg shadow-[#ff00c8]/20">
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* LIST */}
            <div className="space-y-12">
              {blog.comments?.map((c: any) => (
                <div key={c._id} className="group">
                  <div className="flex gap-6">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.user?.username}`} className="w-12 h-12 rounded-2xl" alt="u" />
                    <div className="flex-1 space-y-3">
                      <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] rounded-tl-none relative">
                        <div className="flex justify-between items-center mb-4">
                          <p className="font-[1000] italic uppercase text-[10px] tracking-widest text-[#ff00c8]">{c.user?.username}</p>
                          <span className="text-[9px] font-black text-white/20 uppercase">{format(new Date(c.createdAt), 'MMM dd')}</span>
                        </div>
                        <p className="text-sm text-white/70 italic leading-relaxed">{c.text}</p>
                      </div>
                      
                      <div className="flex gap-6 px-4">
                        <button onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)} className="text-[10px] font-black uppercase italic tracking-widest text-white/30 hover:text-[#ff00c8]">Reply</button>
                      </div>

                      {/* REPLIES */}
                      {c.replies?.map((r: any) => (
                        <div key={r._id} className="flex gap-4 ml-6 pt-4 border-l-2 border-white/5 pl-8">
                          <CornerDownRight size={16} className="text-white/10 mt-1" />
                          <div className="bg-[#ff00c8]/5 border border-[#ff00c8]/10 p-4 rounded-2xl flex-1">
                             <p className="font-[1000] italic uppercase text-[9px] tracking-widest text-[#9b2dee] mb-2">{r.user?.username}</p>
                             <p className="text-sm text-white/60 italic">{r.text}</p>
                          </div>
                        </div>
                      ))}

                      {/* REPLY INPUT */}
                      {replyingTo === c._id && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-6 flex gap-3 ml-6">
                          <input 
                            autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)}
                            placeholder="REPLY TO NODE..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase italic tracking-widest outline-none focus:border-[#ff00c8]"
                          />
                          <button onClick={() => handleReply(c._id)} className="p-4 bg-white text-black rounded-2xl hover:bg-[#ff00c8] hover:text-white transition"><Send size={14} /></button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      {/* GALLERY OVERLAY */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#0d0118]/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setIsGalleryOpen(false)}
          >
            <button className="absolute top-10 right-10 text-white/40 hover:text-white"><X size={40} /></button>
            <motion.img 
               key={currentImgIndex} src={allImages[currentImgIndex]} 
               className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}