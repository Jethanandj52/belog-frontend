"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Loader2, Plus, X, Hash } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [status, setStatus] = useState("published");
  
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("https://belogbackend.vercel.app/categories");
      if (data.success) setCategories(data.categories);
    } catch (err) { console.error(err); }
  };

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setFeaturedPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !featuredImage || (!categoryId && !newCategoryName)) {
      alert("Please fill all mandatory fields!"); return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      let finalCategoryId = categoryId;

      if (isAddingNewCategory && newCategoryName) {
        const catRes = await axios.post("https://belogbackend.vercel.app/categories", 
          { name: newCategoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (catRes.data.success) {
          finalCategoryId = catRes.data.category._id;
        }
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("categoryId", finalCategoryId);
      formData.append("status", status);
      formData.append("featuredImage", featuredImage);
      galleryImages.forEach(file => formData.append("images", file));

      const { data } = await axios.post("https://belogbackend.vercel.app/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        alert("Masterpiece Published!");
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0118] text-white p-4 sm:p-6 md:p-8 relative selection:bg-[#ff00c8] selection:text-white overflow-x-hidden">
      {/* Radial Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[3.5rem] border border-white/10 p-5 sm:p-8 md:p-12 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
            <h2 className="text-3xl md:text-4xl font-[1000] uppercase tracking-tighter italic">
              New <span className="text-[#ff00c8]">Post</span>
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'published' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-orange-500 shadow-[0_0_10px_#f59e0b]'}`} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/60">{status}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Title */}
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Article Title</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full text-lg md:text-2xl font-bold p-5 md:p-6 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl focus:border-[#ff00c8]/50 outline-none transition-all placeholder:text-white/10" 
                placeholder="CATCHY TITLE..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Category Logic */}
              <div>
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Category</label>
                <AnimatePresence mode="wait">
                  {!isAddingNewCategory ? (
                    <motion.div 
                      key="select" 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 10 }}
                      className="flex gap-2 md:gap-3"
                    >
                      <select 
                        value={categoryId} 
                        onChange={(e) => setCategoryId(e.target.value)} 
                        className="flex-1 p-4 md:p-5 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#1a012e]">Select Category</option>
                        {categories.map((cat: any) => (<option key={cat._id} value={cat._id} className="bg-[#1a012e]">{cat.name}</option>))}
                      </select>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingNewCategory(true)}
                        className="p-4 md:p-5 bg-[#ff00c8]/10 text-[#ff00c8] rounded-xl md:rounded-2xl border border-[#ff00c8]/20 hover:bg-[#ff00c8] hover:text-white transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="input" 
                      initial={{ opacity: 0, x: 10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -10 }}
                      className="flex gap-2 md:gap-3"
                    >
                      <div className="relative flex-1">
                        <Hash className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-[#ff00c8]" size={16} />
                        <input 
                          autoFocus
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="w-full p-4 md:p-5 pl-12 md:pl-14 bg-[#ff00c8]/5 border-2 border-[#ff00c8]/20 rounded-xl md:rounded-2xl font-bold text-sm outline-none focus:border-[#ff00c8]/50"
                          placeholder="NEW CATEGORY..."
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {setIsAddingNewCategory(false); setNewCategoryName("");}}
                        className="p-4 md:p-5 bg-white/5 text-white/40 rounded-xl md:rounded-2xl border border-white/10 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status */}
              <div>
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Publication Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  className="w-full p-4 md:p-5 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl font-bold text-sm outline-none cursor-pointer appearance-none"
                >
                  <option value="published" className="bg-[#1a012e]">Published (Live)</option>
                  <option value="draft" className="bg-[#1a012e]">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Cover Photo</label>
              <input type="file" ref={featuredInputRef} className="hidden" accept="image/*" onChange={handleFeaturedChange} />
              <div 
                onClick={() => featuredInputRef.current?.click()} 
                className="w-full h-48 md:h-64 border-2 border-dashed border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center cursor-pointer overflow-hidden bg-white/5 transition-all hover:border-[#ff00c8]/30 group"
              >
                {featuredPreview ? (
                  <img src={featuredPreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="preview" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white/20 px-4 text-center">
                    <ImageIcon className="w-8 h-8 md:w-10 md:h-10" />
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Select Featured Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Multiple Gallery */}
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Project Gallery</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                <AnimatePresence>
                  {galleryPreviews.map((src, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative h-24 md:h-28 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-lg"
                    >
                      <img src={src} className="w-full h-full object-cover" alt="gallery" />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
                <button 
                  type="button" 
                  onClick={() => galleryInputRef.current?.click()} 
                  className="h-24 md:h-28 border-2 border-dashed border-white/10 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-white/20 hover:bg-white/5 hover:text-[#ff00c8] hover:border-[#ff00c8]/20 transition-all gap-1"
                >
                  <Plus size={20} />
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter">Add More</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Your Story</label>
              <textarea 
                rows={8} 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="w-full p-6 md:p-8 bg-white/5 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] outline-none resize-none font-medium leading-relaxed text-white/80 focus:border-[#ff00c8]/30 transition-all placeholder:text-white/10 text-sm md:text-base" 
                placeholder="TELL YOUR STORY..." 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 md:py-6 bg-white text-black rounded-xl md:rounded-2xl font-[1000] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-3 md:gap-4 hover:bg-[#ff00c8] hover:text-white transition-all shadow-[0_0_30px_rgba(255,0,200,0.2)] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4 md:w-5 md:h-5" />}
              {loading ? "TRANSMITTING DATA..." : "PUBLISH TO NETWORK"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}