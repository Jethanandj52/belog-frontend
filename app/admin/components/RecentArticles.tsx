"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Trash2, ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function RecentArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("https://belogbackend.vercel.app/blogs");
        if (res.data.success) setArticles(res.data.blogs.slice(0, 5));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchArticles();
  }, []);

  return (
    <div className="bg-[#11011A]/60 backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl overflow-hidden w-full max-w-full">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-[1000] italic uppercase tracking-tighter text-white">
            Recent <span className="text-[#9b2dee]">Operations</span>
          </h2>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">Live Database Feed</p>
        </div>
        <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#ff00c8] hover:text-white transition-colors group">
          Archive <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* TABLE FOR DESKTOP & CARDS FOR MOBILE */}
      <div className="w-full">
        {/* DESKTOP VIEW (Visible on md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <th className="pb-4 px-4">Article Interface</th>
                <th className="pb-4 px-4">Identity</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4 text-right">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles.map((a: any) => (
                <tr key={a._id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img src={a.featuredImage} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black italic tracking-tight text-white line-clamp-1">{a.title}</p>
                        <p className="text-[9px] text-[#9b2dee] font-bold uppercase tracking-wider">{a.categoryId?.name || "General"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-xs font-bold text-white/40 group-hover:text-white/70 transition-colors">@{a.authorId?.username}</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="px-3 py-1 text-[9px] font-black uppercase rounded-lg bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                      Syncing
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex justify-end gap-2">
                      <button title="Edit" className="p-2 bg-white/5 hover:bg-[#9b2dee] text-white/40 hover:text-white rounded-xl transition-all"><Edit3 size={14}/></button>
                      <button title="Delete" className="p-2 bg-white/5 hover:bg-red-600/20 hover:text-red-500 text-white/40 rounded-xl transition-all border border-transparent hover:border-red-500/50"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW (Visible on small screens only) */}
        <div className="md:hidden space-y-4">
          {articles.map((a: any) => (
            <div key={a._id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img src={a.featuredImage} className="w-12 h-12 rounded-lg object-cover border border-white/10" alt="" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black italic text-white line-clamp-1 uppercase">{a.title}</p>
                  <p className="text-[9px] text-[#9b2dee] font-bold uppercase">{a.categoryId?.name}</p>
                </div>
                <span className="text-[8px] font-black uppercase px-2 py-1 bg-[#00ff9d]/10 text-[#00ff9d] rounded-md border border-[#00ff9d]/20">Live</span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[10px] font-bold text-white/30">@{a.authorId?.username}</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/5 text-white/60 rounded-lg"><Edit3 size={14}/></button>
                  <button className="p-2 bg-white/5 text-red-400 rounded-lg"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-[#9b2dee] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}