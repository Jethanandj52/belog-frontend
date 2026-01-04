"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { UploadCloud, X, Send, Loader2, Plus, Hash } from "lucide-react";

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
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
    
    // Validations
    if (!selectedFile) return toast.error("Featured image is required");
    if (isAddingNewCategory && !newCategoryName) return toast.error("Please enter a new category name");
    if (!isAddingNewCategory && !formData.category) return toast.error("Please select a category");

    const toastId = toast.loading("Submitting your post...");
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      let finalCategoryId = formData.category;

      // STEP 1: Handle New Category
      if (isAddingNewCategory && newCategoryName) {
        const catRes = await axios.post(
          "http://localhost:5000/categories", 
          { name: newCategoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (catRes.data.success) {
          finalCategoryId = catRes.data.category._id;
        }
      }

      // STEP 2: Prepare FormData for Guest Post
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("website", formData.website);
      data.append("articleTitle", formData.articleTitle);
      data.append("articleContent", formData.articleContent);
      data.append("category", finalCategoryId); 
      data.append("featuredImage", selectedFile);
      // Optional fields
      data.append("backlink", formData.backlink);
      data.append("anchorText", formData.anchorText);

      const res = await axios.post("http://localhost:5000/guest-posts", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Submitted! We will email you after review.", { id: toastId });
        
        // RESET FORM
        setFormData({
          name: "", email: "", website: "", articleTitle: "",
          articleContent: "", category: "", backlink: "", anchorText: ""
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setNewCategoryName("");
        setIsAddingNewCategory(false);
        fetchCategories(); // Refresh list
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Submission failed";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 text-black">
      <div className="max-w-4xl mx-auto px-4">
        
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase italic">Submit Story</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Become a guest contributor</p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Banner Image</label>
            <div 
              onClick={() => !previewUrl && fileInputRef.current?.click()}
              className={`h-64 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center relative cursor-pointer transition-all ${previewUrl ? 'border-transparent shadow-xl' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} className="w-full h-full object-cover rounded-[2rem]" alt="preview" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-4 right-4 bg-white p-2 rounded-xl text-red-500 shadow-xl hover:scale-110 transition-transform"><X size={20}/></button>
                </>
              ) : (
                <div className="text-center">
                  <UploadCloud size={40} className="mx-auto text-blue-500 mb-3" />
                  <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Upload high quality cover</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Name</label>
               <input required placeholder="Jhon Doe" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-blue-500/10 focus:bg-white transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
               <input required type="email" placeholder="jhon@example.com" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-blue-500/10 focus:bg-white transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          {/* Category & Website */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
              {!isAddingNewCategory ? (
                <div className="flex gap-2">
                  <select 
                    required={!isAddingNewCategory}
                    className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none font-bold cursor-pointer border-2 border-transparent focus:bg-white" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Topic</option>
                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <button type="button" onClick={() => setIsAddingNewCategory(true)} className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:scale-105 transition-transform"><Plus size={20} /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                    <input autoFocus className="w-full p-4 pl-12 bg-blue-50 border-2 border-blue-100 rounded-2xl font-bold outline-none" placeholder="New Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                  </div>
                  <button type="button" onClick={() => { setIsAddingNewCategory(false); setNewCategoryName(""); }} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><X size={20} /></button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Personal Website</label>
              <input placeholder="https://yourwebsite.com" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-blue-500/10 focus:bg-white transition-all" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
            </div>
          </div>

          {/* Title & Content */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Article Title</label>
            <input required placeholder="Enter a catchy headline..." className="w-full p-4 bg-slate-50 rounded-2xl font-black text-xl outline-none border-2 border-transparent focus:border-blue-500/10 focus:bg-white transition-all" value={formData.articleTitle} onChange={e => setFormData({...formData, articleTitle: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Body Content</label>
            <textarea required placeholder="Share your knowledge with the world..." rows={10} className="w-full p-6 bg-slate-50 rounded-[2rem] outline-none font-bold border-2 border-transparent focus:border-blue-500/10 focus:bg-white transition-all resize-none" value={formData.articleContent} onChange={e => setFormData({...formData, articleContent: e.target.value})} />
          </div>

          <button 
            disabled={submitting} 
            className="w-full py-6 bg-slate-900 hover:bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest transition-all flex justify-center items-center gap-3 disabled:bg-slate-200 disabled:text-slate-400 shadow-xl"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <>Send Article For Review <Send size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}