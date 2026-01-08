"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  Plus,
  ArrowUpRight,
  Loader2,
  Trash2,
  Zap,
  Layers,
} from "lucide-react";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const API_BASE = "https://belogbackend.vercel.app/categories";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE, { headers });
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await axios.post(API_BASE, { name: newCatName }, { headers });
      if (res.data.success) {
        setCategories([...categories, res.data.category]);
        setNewCatName("");
        setIsAdding(false);
      }
    } catch (err) {
      console.error("Add category failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers });
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-12">
      {/* --- PREMIUM HEADER --- */}
      <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#130121]/50 backdrop-blur-3xl p-10 lg:p-14">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Layers size={16} className="text-[#9b2dee]" />
              <p className="text-[#9b2dee] font-black text-[10px] tracking-[0.4em] uppercase">
                Content Structure Engine
              </p>
            </div>
            <h2 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-none">
              Taxonomy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9b2dee] to-[#ff00c8]">Core</span>
            </h2>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="group relative px-8 py-4 bg-white text-black rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <Plus size={16} className="inline mr-2 group-hover:rotate-90 transition-transform" />
            Add New Segment
          </button>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#9b2dee]/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#ff00c8]/10 blur-[80px] rounded-full" />
      </div>

      {/* --- ADD CATEGORY FORM --- */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleAddCategory}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] rounded-[2.5rem] blur opacity-20" />
            <div className="relative bg-[#0d0118] border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Segment Name</label>
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. QUANTUM COMPUTING"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:border-[#9b2dee] transition-all placeholder:text-white/10 uppercase"
                />
              </div>
              <button className="w-full md:w-auto mt-6 md:mt-0 bg-gradient-to-r from-[#9b2dee] to-[#ff00c8] px-12 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-widest hover:shadow-[0_0_25px_rgba(155,45,238,0.4)] transition-all">
                Execute Creation
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* --- CATEGORIES GRID --- */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#9b2dee] mb-6" size={48} />
          <p className="text-[10px] tracking-[0.5em] uppercase font-black text-white/20 animate-pulse">
            Syncing Database...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              className="relative group rounded-[3rem] p-8 bg-white/[0.03] border border-white/5 backdrop-blur-md transition-all hover:bg-white/[0.07] hover:border-[#9b2dee]/30"
            >
              {/* Card Glow */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-[#9b2dee]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(cat._id)}
                className="absolute top-8 right-8 z-20 p-2 rounded-lg text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>

              {/* Icon Container */}
              <div className="relative w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-[#9b2dee] to-[#ff00c8] flex items-center justify-center shadow-[0_10px_30px_rgba(155,45,238,0.3)] mb-8 group-hover:rotate-[10deg] transition-transform">
                <Hash size={24} className="text-white" />
                <Zap size={10} className="absolute -top-1 -right-1 text-white fill-white" />
              </div>

              <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter text-white mb-2 leading-none">
                {cat.name}
              </h3>

              <div className="flex items-center gap-2 mb-10">
                <div className="h-1 w-1 rounded-full bg-[#9b2dee]" />
                <span className="text-[10px] font-black tracking-widest uppercase text-white/30">
                  {cat.postCount || 0} Data Points
                </span>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/20 group-hover:text-[#9b2dee] transition-colors">
                  Analyze Segment
                </span>
                <div className="p-2 rounded-full bg-white/5 text-white/30 group-hover:bg-[#9b2dee] group-hover:text-white transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}