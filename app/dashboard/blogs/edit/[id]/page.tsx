"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Save, Image as ImageIcon, Loader2, ChevronLeft, RefreshCcw } from "lucide-react";

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
        
        // Parallel requests for categories and the specific blog
        const [catRes, blogRes] = await Promise.all([
          axios.get("https://belogbackend.vercel.app/categories"),
          axios.get(`https://belogbackend.vercel.app/blogs`) // Get all and find by ID locally or add a GET BY ID route
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);

        // Blog data find karein (Assuming you use the slug route or a new GET BY ID route)
        // Note: Agar aapne backend mein getById nahi banaya, toh hum saare blogs mein se filter kar rahe hain
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

  // 3. Update Handler (Backend PUT Request)
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
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">
          <ChevronLeft size={16} /> Discard Changes
        </button>
        <h2 className="text-2xl font-[1000] uppercase tracking-tighter text-slate-900 italic">Edit Article</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Category</label>
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
              >
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Post Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Update Cover Photo</label>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-56 border-2 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center cursor-pointer overflow-hidden relative group"
            >
              {preview && <img src={preview} alt="preview" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <RefreshCcw className="text-white mb-2" size={24} />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Image</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Content</label>
            <textarea 
              rows={10} 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium leading-relaxed" 
            />
          </div>

          {/* Update Button */}
          <button 
            type="submit"
            disabled={updating}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
          >
            {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}