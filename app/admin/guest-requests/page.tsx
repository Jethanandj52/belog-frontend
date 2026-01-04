"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Mail, Globe, Loader2, Inbox, Trash2, ExternalLink } from "lucide-react";
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

  // Auth Headers (Ensure token exists)
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  // 1. Fetch Submissions
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/guest-posts`, getHeaders());
      if (res.data.success) {
        // Filter only pending for the main review view
        setPosts(res.data.posts.filter((p: GuestPost) => p.status === "pending"));
      }
    } catch (err: any) {
      setError("Failed to sync with secure server.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // 2. Handle Approve/Reject
  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await axios.put(`${API_BASE}/guest-posts/${id}/status`, { status }, getHeaders());
      if (res.data.success) {
        // Remove from list with animation
        setPosts(posts.filter(p => p._id !== id));
      }
    } catch (err) {
      alert("Unauthorized or Network Error");
    }
  };

  // 3. Handle Delete
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
    <div className="min-h-screen bg-[#0a0a0c] p-6 lg:p-10  ">
      
      {/* HEADER */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-center bg-[#16161a] border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-4xl font-[950] italic uppercase tracking-tighter">Content Pipeline</h2>
          <p className="text-purple-400 font-bold mt-2 uppercase tracking-[0.3em] text-[10px]">
            {loading ? "Scanning for transmissions..." : `${posts.length} Pending Validations`}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </motion.div>

      {/* CONTENT GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-40">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Deciphering Requests...</p>
        </div>
      ) : posts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-[#16161a] rounded-[3rem] border border-dashed border-white/10">
          <Inbox size={64} className="mx-auto text-slate-800 mb-6" />
          <h3 className="text-2xl font-black uppercase italic text-slate-600">No Pending Alerts</h3>
          <button onClick={fetchPosts} className="mt-4 text-purple-500 text-[10px] font-black uppercase tracking-widest hover:underline">Re-Scan Network</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-[#16161a] p-8 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between group hover:border-purple-500/30 transition-all duration-500"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="px-4 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
                        {post.category?.name || "Uncategorized"}
                      </span>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                        Sent by: <span className="  italic">{post.name}</span>
                      </p>
                    </div>
                    <button onClick={() => deletePost(post._id)} className="p-3 bg-white/5 text-slate-600 hover:bg-rose-600 hover:  rounded-2xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black   leading-tight italic uppercase tracking-tighter group-hover:text-purple-400 transition-colors">
                    {post.articleTitle}
                  </h3>

                  <div className="flex flex-wrap gap-4 py-4 border-y border-white/5">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                      <Mail size={14} className="text-purple-500"/> {post.email}
                    </div>
                    {post.website && (
                      <a href={post.website} target="_blank" className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-blue-400 transition-colors">
                        <Globe size={14} className="text-blue-500"/> {post.website.replace("https://", "")} <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => updateStatus(post._id, "rejected")}
                    className="flex-1 py-5 bg-white/5 text-slate-400 hover:bg-rose-600/20 hover:text-rose-500 hover:border-rose-500/50 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18}/> Decline
                  </button>
                  <button 
                    onClick={() => updateStatus(post._id, "approved")}
                    className="flex-1 py-5 bg-white text-black hover:bg-purple-600 hover:  rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18}/> Authorization
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