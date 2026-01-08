"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Mail, Globe, Loader2, Inbox, Trash2, ExternalLink, Zap } from "lucide-react";
import axios from "axios";

interface GuestPost {
  _id: string;
  name: string;
  email: string;
  articleTitle: string;
  website?: string;
  category?: { name: string };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function GuestRequests() {
  const [posts, setPosts] = useState<GuestPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://belogbackend.vercel.app";

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/guest-posts`, getHeaders());
      if (res.data.success) {
        setPosts(res.data.posts.filter((p: GuestPost) => p.status === "pending"));
      }
    } catch (err: any) {
      setError("Failed to sync with secure server.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await axios.put(`${API_BASE}/guest-posts/${id}/status`, { status }, getHeaders());
      if (res.data.success) {
        setPosts(posts.filter(p => p._id !== id));
      }
    } catch (err) {
      alert("Unauthorized or Network Error");
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("Purge this data from records?")) return;
    try {
      await axios.delete(`${API_BASE}/guest-posts/${id}`, getHeaders());
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      alert("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden">
      
      {/* HEADER - Responsive Padding & Typography */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#11011A]/80 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#9b2dee] fill-[#9b2dee]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Inbound Signal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-[1000] italic uppercase tracking-tighter text-white">
            Content <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Pipeline</span>
          </h2>
          <p className="text-[#ff00c8] font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">
            {loading ? "Scanning for transmissions..." : `${posts.length} Pending Validations`}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#9b2dee]/10 rounded-full blur-3xl -mr-10 -mt-10 md:-mr-20 md:-mt-20"></div>
      </motion.div>

      {/* CONTENT GRID - Responsive Columns */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-40">
          <Loader2 className="animate-spin mb-4 text-[#9b2dee]" size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Deciphering Requests...</p>
        </div>
      ) : posts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 md:py-24 bg-[#11011A]/40 rounded-[2rem] md:rounded-[3rem] border border-dashed border-white/10">
          <Inbox size={48} className="mx-auto text-white/10 mb-6" />
          <h3 className="text-xl md:text-2xl font-black uppercase italic text-white/20">No Pending Alerts</h3>
          <button onClick={fetchPosts} className="mt-4 text-[#9b2dee] text-[10px] font-black uppercase tracking-widest hover:text-[#ff00c8] transition-colors">Re-Scan Network</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#11011A]/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between group hover:border-[#9b2dee]/30 transition-all duration-500 w-full"
              >
                <div className="space-y-5 md:space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <span className="px-3 py-1.5 bg-[#9b2dee]/10 text-[#9b2dee] border border-[#9b2dee]/20 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
                        {post.category?.name || "Uncategorized"}
                      </span>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-3 truncate">
                        Origin: <span className="text-white/60 italic">{post.name}</span>
                      </p>
                    </div>
                    <button onClick={() => deletePost(post._id)} className="shrink-0 p-3 bg-white/5 text-white/20 hover:bg-red-600/20 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-500/30">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="text-xl md:text-2xl font-[1000] text-white leading-tight italic uppercase tracking-tighter group-hover:text-[#ff00c8] transition-colors line-clamp-2">
                    {post.articleTitle}
                  </h3>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 py-4 border-y border-white/5">
                    <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-white/40 truncate max-w-full">
                      <Mail size={14} className="text-[#9b2dee] shrink-0"/> <span className="truncate">{post.email}</span>
                    </div>
                    {post.website && (
                      <a href={post.website} target="_blank" className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-white/40 hover:text-[#ff00c8] transition-colors truncate max-w-full">
                        <Globe size={14} className="text-[#ff00c8] shrink-0"/> <span className="truncate">{post.website.replace("https://", "")}</span> <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS - Stacks on Mobile */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                  <button 
                    onClick={() => updateStatus(post._id, "rejected")}
                    className="flex-1 py-4 sm:py-5 bg-white/5 text-white/40 hover:bg-red-600/10 hover:text-red-500 hover:border-red-500/40 rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18}/> Decline
                  </button>
                  <button 
                    onClick={() => updateStatus(post._id, "approved")}
                    className="flex-1 py-4 sm:py-5 bg-white text-black hover:bg-[#ff00c8] hover:text-white rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18}/> Authorize
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}