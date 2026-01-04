"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  Plus,
  Layers,
  ArrowUpRight,
  Loader2,
  Trash2,
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
  const [token, setToken] = useState<string | null>(null); // ✅ client-side token

  const API_BASE = "https://belogbackend.vercel.app/categories";

  // ✅ Fetch token from localStorage client-side
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
    if (token) fetchCategories(); // ✅ only fetch after token is available
  }, [token]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await axios.post(API_BASE, { name: newCatName }, { headers });
    if (res.data.success) {
      setCategories([...categories, res.data.category]);
      setNewCatName("");
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await axios.delete(`${API_BASE}/${id}`, { headers });
    setCategories(categories.filter((c) => c._id !== id));
  };

  return (
    <div className="p-8 min-h-screen bg-[#0a0a0c] space-y-10">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-[#1b1b22] to-[#0f0f14] p-10">
        <h2 className="text-5xl font-black italic uppercase tracking-tight">
          Taxonomy
        </h2>
        <p className="text-purple-500 font-bold text-xs tracking-[0.35em] uppercase mt-2">
          Content Structure Engine
        </p>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="absolute right-10 bottom-10 bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-600 transition"
        >
          <Plus size={16} className="inline mr-2" />
          Add Segment
        </button>

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      {/* ADD FORM */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCategory}
            className="overflow-hidden"
          >
            <div className="bg-[#15151b] border border-purple-500/20 rounded-[2rem] p-6 flex gap-4">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Cyber Security"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 font-bold outline-none focus:border-purple-500"
              />
              <button className="bg-purple-600 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-500 transition">
                Create
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* GRID */}
      {loading ? (
        <div className="py-24 flex flex-col items-center opacity-40">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="text-xs tracking-[0.4em] uppercase font-black">
            Loading Categories
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="relative group rounded-[2.5rem] p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-purple-500/40 transition-all"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-purple-600/10 opacity-0 group-hover:opacity-100 blur-2xl transition" />

              {/* Delete */}
              <button
                onClick={() => handleDelete(cat._id)}
                className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition"
              >
                <Trash2 size={16} />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-xl mb-6">
                <Hash size={22} />
              </div>

              <h3 className="text-2xl font-black italic uppercase tracking-tight">
                {cat.name}
              </h3>

              <span className="inline-block mt-3 px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black tracking-widest uppercase">
                {cat.postCount || 0} Posts
              </span>

              <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 group-hover:text-purple-500 transition">
                  Manage
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-slate-500 group-hover:text-purple-500 transition"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
