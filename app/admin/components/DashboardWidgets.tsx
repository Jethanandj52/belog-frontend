"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, FileText, Clock, Loader2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardWidgets() {
  const [stats, setStats] = useState({ totalViews: 0, activePosts: 0, pendingGuests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://belogbackend.vercel.app/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });

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

  const widgetConfig = [
    { 
      title: "Neural Views", 
      value: stats.totalViews.toLocaleString(), 
      icon: <Eye size={22} />, 
      color: "#9b2dee",
      shadow: "shadow-[0_0_20px_rgba(155,45,238,0.2)]"
    },
    { 
      title: "Active Data", 
      value: stats.activePosts, 
      icon: <FileText size={22} />, 
      color: "#ff00c8",
      shadow: "shadow-[0_0_20px_rgba(255,0,200,0.2)]"
    },
    { 
      title: "Pending Sync", 
      value: stats.pendingGuests, 
      icon: <Clock size={22} />, 
      color: "#e300b4",
      shadow: "shadow-[0_0_20px_rgba(227,0,180,0.2)]"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-full">
      {widgetConfig.map((w, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`group relative bg-[#11011A]/60 backdrop-blur-xl border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 overflow-hidden hover:border-white/10 transition-all duration-500 ${w.shadow}`}
        >
          {/* Top Decorative Line */}
          <div 
            className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700" 
            style={{ backgroundColor: w.color }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 truncate">
                {w.title}
              </p>
              {loading ? (
                <Loader2 className="animate-spin text-white/20" size={24} />
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-[1000] italic tracking-tighter text-white">
                    {w.value}
                  </p>
                  <TrendingUp size={14} className="text-[#00ff9d] opacity-50 hidden sm:block" />
                </div>
              )}
            </div>
            
            {/* Dynamic Icon Box */}
            <div 
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-[10deg]"
              style={{ backgroundColor: `${w.color}15`, color: w.color }}
            >
              {w.icon}
            </div>
          </div>
          
          {/* Hover Glow Effect */}
          <div 
            className="absolute -bottom-12 -right-12 w-32 h-32 blur-[50px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: w.color }}
          />
        </motion.div>
      ))}
    </div>
  );
}