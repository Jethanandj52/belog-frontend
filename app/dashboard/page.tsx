"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit3, Trash2, Eye, 
  FileText, TrendingUp, Inbox, Loader2
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

  // 1. Fetch Real Data from Backend
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const { data } = await axios.get("http://localhost:5000/blogs");
      
      if (data.success) {
        // Sirf logged-in user ke blogs filter karein
        const myBlogs = data.blogs.filter((b: any) => b.authorId?._id === userId);
        
        // Calculate Stats
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

  // 2. Delete Blog Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 transition-all duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-[1000] tracking-tighter text-slate-900 uppercase">Creator Dashboard</h1>
          <p className="text-slate-500 font-medium italic text-sm">Real-time insights for your content</p>
        </div>
        
        <Link href="/dashboard/blogs/create">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-200 active:scale-95">
            <Plus size={18} /> Create New Post
          </button>
        </Link>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {loading ? (
          [1, 2, 3].map((i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard 
              icon={<FileText className="text-blue-600" />} 
              label="My Articles" 
              value={stats.totalBlogs.toString()} 
              trend={`${stats.publishedCount} Published`} 
            />
            <StatCard 
              icon={<Eye className="text-emerald-600" />} 
              label="Total Engagement" 
              value={stats.totalViews.toLocaleString()} 
              trend="Across all posts" 
            />
            <StatCard 
              icon={<TrendingUp className="text-purple-600" />} 
              label="Growth" 
              value="Stable" 
              trend="Analysis active" 
            />
          </>
        )}
      </div>

      {/* --- BLOG LIST --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-lg uppercase tracking-tighter">Manage Content</h3>
          <div className="relative group hidden sm:block">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none w-64" placeholder="Quick search..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Article</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Stats</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map((i) => <RowSkeleton key={i} />)
              ) : blogs.length > 0 ? (
                <AnimatePresence>
                  {blogs.map((blog) => (
                    <motion.tr 
                      key={blog._id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={blog.featuredImage} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 line-clamp-1">{blog.title}</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                              {blog.categoryId?.name} • {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-1 text-slate-600 font-bold text-xs">
                          <Eye size={14} className="text-blue-500" /> {blog.views || 0}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${blog.status === "published" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/blogs/edit/${blog._id}`}>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={16} /></button>
                          </Link>
                          <button onClick={() => handleDelete(blog._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Inbox size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Start your journey. Create a blog.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
      <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-[1000] tracking-tighter text-slate-900">{value}</h4>
          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
      <div className="w-14 h-14 bg-slate-100 animate-pulse rounded-2xl" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded" />
        <div className="h-6 w-3/4 bg-slate-200 animate-pulse rounded" />
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr>
      <td colSpan={4} className="p-6"><div className="h-12 w-full bg-slate-50 animate-pulse rounded-xl" /></td>
    </tr>
  );
}