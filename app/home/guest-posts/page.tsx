"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { GuestPostCard, GuestSkeleton } from "../../components/GuestPostCard";

export default function GuestPostsLibrary() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("https://belogbackend.vercel.app/guest-posts");
        if (data.success) {
          // Sirf approved posts dikhayein
          const approved = data.posts.filter((p: any) => p.status === "approved");
          setPosts(approved);
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-[1000] tracking-tighter uppercase italic text-slate-900 mb-4">
          Community <span className="text-amber-500">Stories</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          Insights and articles shared by our global guest contributors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          Array(6).fill(0).map((_, i) => <GuestSkeleton key={i} />)
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <GuestPostCard key={index} post={post} index={index} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-400 font-bold italic">
            No guest stories published yet.
          </div>
        )}
      </div>
    </div>
  );
}