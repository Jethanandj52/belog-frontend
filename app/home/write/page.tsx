"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { UploadCloud, X, Send, Loader2, Plus, Hash, Globe, User, Mail, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function WritePage() {
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    articleTitle: "",
    articleContent: "",
    category: "",
    backlink: "",
    anchorText: ""
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://belogbackend.vercel.app/categories");
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please upload a cover image");
    if (isAddingNewCategory && !newCategoryName) return toast.error("Please enter a category name");
    if (!isAddingNewCategory && !formData.category) return toast.error("Please select a category");

    const toastId = toast.loading("Saving your post...");
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      let finalCategoryId = formData.category;
      if (isAddingNewCategory && newCategoryName) {
        const catRes = await axios.post(
          "https://belogbackend.vercel.app/categories", 
          { name: newCategoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (catRes.data.success) finalCategoryId = catRes.data.category._id;
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "category") data.append(key, value);
      });
      data.append("category", finalCategoryId);
      data.append("featuredImage", selectedFile);

      const res = await axios.post("https://belogbackend.vercel.app/guest-posts", data);

      if (res.data.success) {
        toast.success("Post submitted successfully!", { id: toastId });
        setFormData({ name: "", email: "", website: "", articleTitle: "", articleContent: "", category: "", backlink: "", anchorText: "" });
        setSelectedFile(null); setPreviewUrl(null); setNewCategoryName(""); setIsAddingNewCategory(false);
        fetchCategories();
      }
    } catch (err: any) {
      toast.error("Something went wrong. Try again.", { id: toastId });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0d0118] text-white pt-24 pb-20 px-6">
      <Toaster position="top-center" />
      
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1a012e_0%,_#0d0118_100%)] z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
            Write <span className="text-[#ff00c8]">Post</span>
          </h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Share your knowledge with our community</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Cover Image Upload */}
          <div className="group">
             <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 block ml-2">Main Cover Image</label>
             <div 
              onClick={() => !previewUrl && fileInputRef.current?.click()}
              className={`h-64 md:h-80 rounded-[2.5rem] border-2 border-dashed transition-all relative flex flex-col items-center justify-center overflow-hidden ${previewUrl ? 'border-transparent' : 'border-white/10 bg-white/5 hover:border-[#ff00c8]/50'}`}
             >
              {previewUrl ? (
                <>
                  <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-4 right-4 p-3 bg-red-500 rounded-2xl shadow-lg"><X size={20}/></button>
                </>
              ) : (
                <div className="text-center">
                  <UploadCloud size={40} className="text-[#ff00c8] mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase">Click to upload image</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
             </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[3rem] space-y-8">
            
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Full Name</label>
                  <div className="relative ">
                   
                    <input required placeholder="Your Name" className="simple-input " value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Email Address</label>
                  <div className="relative">
 
                    <input required type="email" placeholder="email@example.com" className="simple-input pl-14" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
               </div>
            </div>

            {/* Category & Links */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Choose Category</label>
                  {!isAddingNewCategory ? (
                    <div className="flex gap-2">
                      <select required className="simple-input cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {categories.map((c: any) => <option key={c._id} value={c._id} className="text-black">{c.name}</option>)}
                      </select>
                      <button type="button" onClick={() => setIsAddingNewCategory(true)} className="p-4 bg-[#ff00c8] rounded-xl"><Plus size={20} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input autoFocus className="simple-input border-[#ff00c8]/50" placeholder="New Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                      <button type="button" onClick={() => { setIsAddingNewCategory(false); setNewCategoryName(""); }} className="p-4 bg-red-500 rounded-xl"><X size={20} /></button>
                    </div>
                  )}
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Website (Optional)</label>
                  <div className="relative">
                   
                    <input placeholder="www.yourlink.com" className="simple-input pl-14" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                  </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="space-y-2 pt-4 border-t border-white/5">
               <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Post Title</label>
               <input required placeholder="What is your story about?" className="simple-input text-lg font-bold" value={formData.articleTitle} onChange={e => setFormData({...formData, articleTitle: e.target.value})} />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Post Content</label>
               <textarea required placeholder="Write your full story here..." rows={10} className="simple-input p-5 resize-none" value={formData.articleContent} onChange={e => setFormData({...formData, articleContent: e.target.value})} />
            </div>

            {/* Submit Button */}
            <button 
              disabled={submitting} 
              className="w-full h-16 rounded-2xl bg-[#ff00c8] text-white font-black uppercase tracking-widest hover:bg-[#e300b4] transition-all flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" /> : <>Submit Post <Send size={18} /></>}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .simple-input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          outline: none;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
          transition: 0.3s;
        }
        .simple-input:focus {
          border-color: #9a1b7eff;
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}