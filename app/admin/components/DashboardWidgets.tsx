"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, FileText, Clock, Loader2 } from "lucide-react";

export default function DashboardWidgets() {
  const [stats, setStats] = useState({ totalViews: 0, activePosts: 0, pendingGuests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Console log check karne ke liye ki data aa raha hai ya nahi
        console.log("Stats Data:", res.data);

        if (res.data.success) {
          setStats({
            totalViews: res.data.totalViews || 0,
            activePosts: res.data.activePosts || 0,
            pendingGuests: res.data.pendingGuests || 0
          });
        }
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchStats();
  }, []);

  // Tailwind dynamic classes fix karne ke liye object mapping
  const widgetConfig = [
    { 
      title: "Total Views", 
      value: stats.totalViews.toLocaleString(), 
      icon: <Eye size={24} />, 
      theme: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5" 
    },
    { 
      title: "Active Posts", 
      value: stats.activePosts, 
      icon: <FileText size={24} />, 
      theme: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5" 
    },
    { 
      title: "Pending Guests", 
      value: stats.pendingGuests, 
      icon: <Clock size={24} />, 
      theme: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {widgetConfig.map((w, idx) => (
        <div key={idx} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{w.title}</p>
              {loading ? (
                <Loader2 className="animate-spin text-slate-700" size={20} />
              ) : (
                <p className="text-4xl font-black italic tracking-tighter text-white">
                  {w.value}
                </p>
              )}
            </div>
            
            {/* Yahan classes fix ho gayi hain */}
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 ${w.theme}`}>
              {w.icon}
            </div>
          </div>
          
          {/* Subtle Glow Background */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-current opacity-[0.03] blur-3xl rounded-full" />
        </div>
      ))}
    </div>
  );
}