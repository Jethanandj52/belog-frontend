"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Save, Image as ImageIcon, Loader2, ChevronLeft, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // --- States ---
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("published");
  const [categories, setCategories] = useState([]);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Categories & Original Blog Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [catRes, blogRes] = await Promise.all([
          axios.get("https://belogbackend.vercel.app/categories"),
          axios.get(`https://belogbackend.vercel.app/blogs`)
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);

        const currentBlog = blogRes.data.blogs.find((b: any) => b._id === id);
        
        if (currentBlog) {
          setTitle(currentBlog.title);
          setContent(currentBlog.content);
          setCategoryId(currentBlog.categoryId?._id || "");
          setStatus(currentBlog.status);
          setPreview(currentBlog.featuredImage);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        alert("Failed to load blog data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Image Change Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 3. Update Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    formData.append("status", status);
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    try {
      const { data } = await axios.put(`https://belogbackend.vercel.app/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        alert("Masterpiece updated successfully!");
        router.push("/dashboard/blogs");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0118]">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-t-2 border-[#ff00c8] rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-b-2 border-[#9b2dee] rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Fetching Original Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0118] text-white p-4 md:p-8 relative selection:bg-[#ff00c8] selection:text-white">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#ff00c8] transition-all">
            <ChevronLeft size={16} /> Discard Changes
          </button>
          <h2 className="text-4xl font-[1000] uppercase tracking-tighter italic text-white">
            Edit <span className="text-[#ff00c8]">Article</span>
          </h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-6 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Title */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Article Title</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold p-6 bg-white/5 border border-white/5 rounded-2xl focus:border-[#ff00c8]/50 outline-none transition-all text-white placeholder:text-white/20" 
                placeholder="Enter title..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Category</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl focus:border-[#ff00c8]/50 outline-none font-bold text-sm text-white appearance-none cursor-pointer"
                >
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id} className="bg-[#1a012e] text-white">{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Post Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl focus:border-[#ff00c8]/50 outline-none font-bold text-sm text-white appearance-none cursor-pointer"
                >
                  <option value="published" className="bg-[#1a012e] text-white">Published</option>
                  <option value="draft" className="bg-[#1a012e] text-white">Draft</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Cover Photo</label>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-72 border-2 border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center cursor-pointer overflow-hidden relative group transition-all hover:border-[#ff00c8]/30 bg-white/[0.02]"
              >
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/20">
                    <ImageIcon size={40} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Select Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-[#0d0118]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                  <RefreshCcw className="text-[#ff00c8] mb-2 animate-spin-slow" size={32} />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Masterpiece Image</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff00c8] mb-3 block ml-2">Content Body</label>
              <textarea 
                rows={12} 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-8 bg-white/5 border border-white/5 rounded-3xl focus:border-[#ff00c8]/50 outline-none resize-none font-medium leading-[1.8] text-white/80 placeholder:text-white/20" 
                placeholder="Write your story..."
              />
            </div>

            {/* Update Button */}
            <button 
              type="submit"
              disabled={updating}
              className="w-full py-6 bg-white text-black rounded-2xl font-[1000] uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-[#ff00c8] hover:text-white transition-all shadow-[0_0_30px_rgba(255,0,200,0.2)] disabled:opacity-50 active:scale-[0.98]"
            >
              {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {updating ? "Processing Changes..." : "Push Updates"}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}