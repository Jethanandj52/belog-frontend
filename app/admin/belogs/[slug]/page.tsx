"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, MessageCircle, Send, Home, Layers, X, 
  ChevronLeft, ChevronRight, Share2, Bookmark, CornerDownRight 
} from "lucide-react";
import { format } from "date-fns";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Interaction States
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // Stores Comment ID

  // Gallery States
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/blogs/${slug}`);
      if (res.data.success) {
        setBlog(res.data.blog);
        // Check if current user (from localstorage/context) liked it
        // setIsLiked(res.data.blog.likes.includes(currentUserId));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (slug) fetchBlog(); }, [slug]);

  // --- Handlers ---
  const handleLike = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/blogs/${blog._id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setBlog({ ...blog, likes: new Array(res.data.likesCount) }); // Sync count
      }
    } catch (err) { alert("Please login to like"); }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/blogs/${blog._id}/comment`, { text: commentText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBlog({ ...blog, comments: res.data.comments });
      setCommentText("");
    } catch (err) { alert("Login required to comment"); }
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(`http://localhost:5000/blogs/${blog._id}/comment/${commentId}/reply`, { text: replyText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBlog({ ...blog, comments: res.data.comments });
      setReplyText("");
      setReplyingTo(null);
    } catch (err) { alert("Login required to reply"); }
  };

  const allImages = blog?.images ? [blog.featuredImage, ...blog.images] : [blog?.featuredImage];
  const nextImg = () => setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
  const prevImg = () => setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white italic text-slate-400">Loading Story...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Post Not Found</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">{blog.categoryId?.name}</div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-8">{blog.title}</h1>
          <div className="flex items-center justify-center gap-3 mb-8">
           <img
  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${blog.authorId?.username || 'user'}`}
  alt="avatar" className="w-10 rounded"
/>
            <div className="text-left">
              <p className="font-bold text-sm leading-none">{blog.authorId?.username}</p>
              <p className="text-[11px] text-slate-400 mt-1">{format(new Date(blog.createdAt), 'MMM dd, yyyy')} • {blog.views} views</p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative group cursor-zoom-in mb-12" onClick={() => { setCurrentImgIndex(0); setIsGalleryOpen(true); }}>
          <img src={blog.featuredImage} className="w-full h-auto rounded-3xl shadow-xl" alt="Featured" />
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-[10px] font-bold">
              + {allImages.length - 1} Images
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none prose-slate mb-20" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {/* Reactions Bar */}
        <div className="flex items-center gap-6 py-6 border-y border-slate-100 mb-12">
          <button onClick={handleLike} className="flex items-center gap-2 hover:scale-110 transition-transform">
            <Heart size={24} className={isLiked ? "fill-red-500 text-red-500" : "text-slate-400"} />
            <span className="font-bold text-sm">{blog.likes?.length || 0}</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400">
            <MessageCircle size={24} />
            <span className="font-bold text-sm">{blog.comments?.length || 0}</span>
          </div>
        </div>

        {/* Comments Section */}
        <section className="space-y-10">
          <h3 className="text-2xl font-black">Comments</h3>
          
          {/* New Comment Input */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0" />
            <div className="flex-1 relative">
              <textarea 
                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 outline-none h-24 text-sm"
              />
              <button onClick={handleComment} className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-8">
            {blog.comments?.map((c: any) => (
              <div key={c._id} className="space-y-4">
                <div className="flex gap-4">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.user?.username}`} className="w-10 h-10 rounded-full" alt="u" />
                  <div className="flex-1">
                    <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none relative">
                      <p className="font-bold text-xs mb-1 text-blue-600">{c.user?.username}</p>
                      <p className="text-sm text-slate-700">{c.text}</p>
                    </div>
                    <div className="flex gap-4 mt-2 px-2">
                      <button onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)} className="text-[11px] font-bold text-slate-400 hover:text-blue-600">Reply</button>
                      <span className="text-[11px] text-slate-300">{format(new Date(c.createdAt), 'MMM dd')}</span>
                    </div>

                    {/* Replies Logic */}
                    {c.replies?.length > 0 && (
                      <div className="mt-4 space-y-4 border-l-2 border-slate-100 ml-2 pl-6">
                        {c.replies.map((r: any) => (
                          <div key={r._id} className="flex gap-3">
                            <CornerDownRight size={14} className="text-slate-300 mt-1" />
                            <div className="bg-blue-50/50 p-3 rounded-2xl flex-1">
                               <p className="font-bold text-[10px] text-slate-900">{r.user?.username}</p>
                               <p className="text-sm text-slate-600">{r.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply Input */}
                    {replyingTo === c._id && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex gap-2 pl-6">
                        <input 
                          autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs outline-none focus:border-blue-400"
                        />
                        <button onClick={() => handleReply(c._id)} className="p-2 bg-slate-900 text-white rounded-full"><Send size={12} /></button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* Gallery Modal - Pehle wala logic (Same as before) */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setIsGalleryOpen(false)}
          >
            <button onClick={() => setIsGalleryOpen(false)} className="absolute top-6 right-6 p-3 text-white"><X size={30} /></button>
            <motion.img 
               key={currentImgIndex} src={allImages[currentImgIndex]} 
               className="max-w-full max-h-[75vh] object-contain rounded-lg"
               onClick={(e) => e.stopPropagation()} 
            />
            {/* Nav and Thumbs logic... */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}