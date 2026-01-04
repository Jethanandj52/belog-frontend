"use client";
import React, { useEffect, useState } from "react";
import { TrendingUp, ArrowUpRight, Loader2, BarChart3, Users } from "lucide-react";
import axios from "axios";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dataStats, setDataStats] = useState({
    growth: 0,
    newReaders: 0,
    dailyViews: [0, 0, 0, 0, 0, 0, 0] // Last 7 days
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const { data } = await axios.get("http://localhost:5000/blogs");
        
        if (data.success) {
          const myBlogs = data.blogs.filter((b: any) => b.authorId?._id === userId);
          
          // --- Logic for Daily Views (Last 7 Days) ---
          const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
          }).reverse();

          const viewsByDay = last7Days.map(date => {
            return myBlogs
              .filter((b: any) => b.createdAt.startsWith(date))
              .reduce((acc: number, curr: any) => acc + (curr.views || 0), 0);
          });

          // --- Logic for Growth (Simple calculation based on views) ---
          const totalViews = myBlogs.reduce((acc: number, curr: any) => acc + (curr.views || 0), 0);
          const growthCalc = totalViews > 0 ? (viewsByDay[6] / totalViews) * 100 : 0;

          setDataStats({
            growth: parseFloat(growthCalc.toFixed(1)),
            newReaders: viewsByDay[6], // Today's views
            dailyViews: viewsByDay
          });
        }
      } catch (err) {
        console.error("Analytics Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  // Chart mein max value find karna taaki bars proportional rahein
  const maxViews = Math.max(...dataStats.dailyViews, 10); 

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Performance Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- GROWTH CARD --- */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
          <TrendingUp className="absolute -right-4 -bottom-4 w-40 h-40 text-white/5 group-hover:text-blue-500/10 transition-colors" />
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Monthly Growth</p>
          <h3 className="text-4xl font-black tracking-tighter mb-4">+{dataStats.growth}%</h3>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <ArrowUpRight size={14} /> {dataStats.newReaders} readers today
          </div>
        </div>

        {/* --- REAL-TIME CHART CARD --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">7-Day Engagement</p>
            <BarChart3 size={16} className="text-blue-600" />
          </div>
          
          <div className="flex items-end justify-between h-32 gap-3">
            {dataStats.dailyViews.map((views, i) => {
              const heightPercentage = (views / maxViews) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                   <div 
                    className="w-full bg-blue-50 rounded-t-xl hover:bg-blue-600 transition-all cursor-pointer group relative" 
                    style={{ height: `${Math.max(heightPercentage, 5)}%` }} // Min 5% height for visibility
                   >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-black shadow-xl z-10">
                        {views} Views
                      </div>
                   </div>
                   <span className="text-[8px] font-black text-slate-300 uppercase">Day {i+1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- EXTRA STATS (Bento Style) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-600 p-6 rounded-[2rem] text-white">
          <Users size={20} className="mb-4 opacity-50" />
          <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Top Device</p>
          <h4 className="text-xl font-black">Mobile (65%)</h4>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem]">
          <TrendingUp size={20} className="mb-4 text-purple-600" />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Avg. Session</p>
          <h4 className="text-xl font-black text-slate-900">03:42 min</h4>
        </div>
        <div className="bg-emerald-500 p-6 rounded-[2rem] text-white">
          <ArrowUpRight size={20} className="mb-4 opacity-50" />
          <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Bounce Rate</p>
          <h4 className="text-xl font-black">24.8%</h4>
        </div>
      </div>
    </div>
  );
}