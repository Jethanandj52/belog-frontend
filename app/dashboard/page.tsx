"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit3, Trash2, Eye, 
  FileText, TrendingUp, Inbox, Loader2, Zap
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    publishedCount: 0
  });

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const { data } = await axios.get("https://belogbackend.vercel.app/blogs");
      if (data.success) {
        const myBlogs = data.blogs.filter((b: any) => b.authorId?._id === userId);
        const views = myBlogs.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0);
        const published = myBlogs.filter((b: any) => b.status === "published").length;
        setBlogs(myBlogs);
        setStats({
          totalBlogs: myBlogs.length,
          totalViews: views,
          publishedCount: published
        });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://belogbackend.vercel.app/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0118] text-white  p-4 md:p-8 relative overflow-hidden">
      {/* Background Gradient Styling */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff00c8]/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-[1000] tracking-tighter uppercase italic">
              Creator <span className="text-[#ff00c8]">Dashboard</span>
            </h1>
            <p className="text-white/40 font-medium italic text-sm mt-1">Real-time insights for your content</p>
          </motion.div>
          
          <Link href="/dashboard/blogs/create">
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#ff00c8] hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95">
              <Plus size={18} /> Create New Post
            </button>
          </Link>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {loading ? (
            [1, 2, 3].map((i) => <StatSkeleton key={i} />)
          ) : (
            <>
              <StatCard 
                icon={<FileText size={24} className="text-[#ff00c8]" />} 
                label="My Articles" 
                value={stats.totalBlogs.toString()} 
                trend={`${stats.publishedCount} Published`} 
              />
              <StatCard 
                icon={<Eye size={24} className="text-[#9b2dee]" />} 
                label="Total Engagement" 
                value={stats.totalViews.toLocaleString()} 
                trend="Across all posts" 
              />
              <StatCard 
                icon={<Zap size={24} className="text-yellow-400" />} 
                label="Growth" 
                value="Stable" 
                trend="Analysis active" 
              />
            </>
          )}
        </div>

        {/* --- BLOG LIST --- */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-black text-xl uppercase tracking-tighter italic">Manage Content</h3>
            <div className="relative group w-full sm:w-auto">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
               <input className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none w-full sm:w-72 focus:border-[#ff00c8]/50 transition-all" placeholder="Quick search..." />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Article</th>
                  <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Stats</th>
                  <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase text-white/30 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [1, 2, 3].map((i) => <RowSkeleton key={i} />)
                ) : blogs.length > 0 ? (
                  <AnimatePresence>
                    {blogs.map((blog) => (
                      <motion.tr 
                        key={blog._id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img src={blog.featuredImage} className="w-14 h-14 rounded-xl object-cover border border-white/10" alt="post" />
                            <div className="flex flex-col">
                              <span className="font-bold text-white line-clamp-1">{blog.title}</span>
                              <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter mt-1">
                                {blog.categoryId?.name} • {new Date(blog.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-white font-bold text-xs">
                            <div className="p-1.5 bg-blue-500/10 rounded-md">
                               <Eye size={14} className="text-blue-400" />
                            </div>
                            {blog.views || 0}
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${blog.status === "published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"}`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-3">
                            <Link href={`/dashboard/blogs/edit/${blog._id}`}>
                              <button className="p-3 bg-white/5 text-white/50 hover:text-[#ff00c8] hover:bg-[#ff00c8]/10 rounded-xl transition-all border border-white/10"><Edit3 size={16} /></button>
                            </Link>
                            <button onClick={() => handleDelete(blog._id)} className="p-3 bg-white/5 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-white/10"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={4} className="p-24 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Inbox size={32} className="text-white/20" />
                      </div>
                      <p className="font-bold text-white/20 uppercase text-xs tracking-[0.3em]">Start your journey. Create a blog.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UPDATED HELPERS WITH DARK THEME ---

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-7 rounded-[2.5rem] border border-white/10 shadow-xl flex items-center gap-6 group hover:border-[#ff00c8]/30 transition-all">
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{label}</p>
        <div className="flex items-baseline gap-3">
          <h4 className="text-3xl font-[1000] tracking-tighter text-white">{value}</h4>
          <span className="text-[9px] font-black text-[#ff00c8] uppercase tracking-tighter bg-[#ff00c8]/10 px-2 py-0.5 rounded-md">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white/5 p-7 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
      <div className="w-14 h-14 bg-white/5 animate-pulse rounded-2xl" />
      <div className="space-y-3 flex-1">
        <div className="h-2 w-1/3 bg-white/5 animate-pulse rounded" />
        <div className="h-6 w-1/2 bg-white/10 animate-pulse rounded" />
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr>
      <td colSpan={4} className="p-6">
        <div className="h-16 w-full bg-white/5 animate-pulse rounded-2xl border border-white/5" />
      </td>
    </tr>
  );
}