"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Trash2, CheckCircle, ExternalLink } from "lucide-react";

export default function RecentArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/blogs"); // Public or Admin API
        if (res.data.success) setArticles(res.data.blogs.slice(0, 5)); // Only top 5
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchArticles();
  }, []);

  return (
    <div className="bg-[#16161a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Recent Operations</h2>
        <button className="text-[10px] font-black uppercase tracking-widest text-purple-500  transition-colors">View Archive</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="pb-4 px-4">Article</th>
              <th className="pb-4 px-4">Identity</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {articles.map((a: any) => (
              <tr key={a._id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="py-5 px-4">
                  <div className="flex items-center gap-4">
                    <img src={a.featuredImage} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    <div>
                      <p className="text-sm font-black italic line-clamp-1">{a.title}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{a.categoryId?.name || "General"}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <span className="text-xs font-bold text-slate-400">{a.authorId?.username}</span>
                </td>
                <td className="py-5 px-4">
                  <span className="px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Live
                  </span>
                </td>
                <td className="py-5 px-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-white/5 hover:bg-purple-600 text-slate-400 hover rounded-xl transition-all"><Edit3 size={14}/></button>
                    <button className="p-2 bg-white/5 hover:bg-rose-600 text-slate-400 hover rounded-xl transition-all"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}