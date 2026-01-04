"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Laptop, 
  Palette, 
  Briefcase, 
  Heart, 
  Camera, 
  Plane, 
  Layers,
  Sparkles 
} from "lucide-react";

export default function CategoryPill({ 
  name, 
  isActive 
}: { 
  name: string, 
  isActive: boolean 
}) {
  
  // Dynamic Styles Logic
  const getStyle = (categoryName: string) => {
    const n = categoryName.toLowerCase();
    if (n.includes("tech")) return { icon: <Laptop size={28} />, color: "text-blue-600", bg: "bg-blue-50", shadow: "shadow-blue-100" };
    if (n.includes("design")) return { icon: <Palette size={28} />, color: "text-purple-600", bg: "bg-purple-50", shadow: "shadow-purple-100" };
    if (n.includes("busines")) return { icon: <Briefcase size={28} />, color: "text-emerald-600", bg: "bg-emerald-50", shadow: "shadow-emerald-100" };
    if (n.includes("life")) return { icon: <Heart size={28} />, color: "text-pink-600", bg: "bg-pink-50", shadow: "shadow-pink-100" };
    if (n.includes("photo")) return { icon: <Camera size={28} />, color: "text-orange-600", bg: "bg-orange-50", shadow: "shadow-orange-100" };
    if (n.includes("travel")) return { icon: <Plane size={28} />, color: "text-cyan-600", bg: "bg-cyan-50", shadow: "shadow-cyan-100" };
    return { icon: <Layers size={28} />, color: "text-slate-600", bg: "bg-slate-50", shadow: "shadow-slate-100" };
  };

  const style = getStyle(name);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden group p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer
        ${isActive 
          ? `bg-white border-blue-500 shadow-2xl ${style.shadow} ring-4 ring-blue-50/50` 
          : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-xl shadow-sm"
        }
      `}
    >
      {/* Background Glow Effect on Hover */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${style.bg}`} />

      {/* Icon Container with Animation */}
      <motion.div 
        className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-colors duration-500 ${style.bg}`}
      >
        <span className={`${style.color} group-hover:scale-110 transition-transform duration-500`}>
          {style.icon}
        </span>
      </motion.div>

      {/* Text Section */}
      <div className="space-y-1">
        <h3 className={`text-lg font-[1000] tracking-tighter uppercase transition-colors duration-300 ${isActive ? "text-blue-600" : "text-slate-900"}`}>
          {name}
        </h3>
        
        <div className="flex items-center justify-center gap-1.5">
           {isActive && <Sparkles size={10} className="text-blue-500 animate-pulse" />}
           <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? "text-blue-400" : "text-slate-400"}`}>
             {isActive ? "Viewing" : "Explore"}
           </p>
        </div>
      </div>

      {/* Bottom Indicator Line */}
      <motion.div 
        initial={false}
        animate={{ width: isActive ? "40%" : "0%" }}
        className="h-1 bg-blue-600 mx-auto mt-4 rounded-full"
      />
    </motion.div>
  );
}