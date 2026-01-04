"use client";
import React from "react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
          <i className="fas fa-bell text-xl"></i>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all">
          <i className="fas fa-plus mr-2"></i>New Post
        </button>
      </div>
    </header>
  );
}
