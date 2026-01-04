"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Loader2, Plus, X, Hash } from "lucide-react";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState(""); // Nayi category ke liye state
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

      // --- STEP 1: Agar user ne nayi category likhi hai, toh pehle use create karein ---
      if (isAddingNewCategory && newCategoryName) {
        const catRes = await axios.post("https://belogbackend.vercel.app/categories", 
          { name: newCategoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (catRes.data.success) {
          finalCategoryId = catRes.data.category._id;
        }
      }

      // --- STEP 2: Blog post create karein ---
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
        <h2 className="text-2xl font-[1000] uppercase tracking-tighter mb-8">Create New Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg font-bold p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Catchy title..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Logic */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
              {!isAddingNewCategory ? (
                <div className="flex gap-2">
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)} 
                    className="flex-1 p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setIsAddingNewCategory(true)}
                    className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      autoFocus
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full p-4 pl-12 bg-blue-50/50 border-2 border-blue-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500"
                      placeholder="Type new category..."
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {setIsAddingNewCategory(false); setNewCategoryName("");}}
                    className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Cover Photo</label>
            <input type="file" ref={featuredInputRef} className="hidden" accept="image/*" onChange={handleFeaturedChange} />
            <div onClick={() => featuredInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center cursor-pointer overflow-hidden bg-slate-50 transition-all hover:border-blue-300">
              {featuredPreview ? <img src={featuredPreview} className="w-full h-full object-cover" /> : <ImageIcon size={30} className="text-slate-300" />}
            </div>
          </div>

          {/* Multiple Gallery */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Extra Gallery Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryPreviews.map((src, index) => (
                <div key={index} className="relative h-24 rounded-2xl overflow-hidden shadow-sm">
                  <img src={src} className="w-full h-full object-cover" />
                </div>
              ))}
              <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleGalleryChange} />
              <button type="button" onClick={() => galleryInputRef.current?.click()} className="h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all">
                <Plus size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Story</label>
            <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none resize-none" placeholder="Tell your story..." />
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-600 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            {loading ? "Processing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}