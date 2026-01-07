"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardWidgets from "./components/DashboardWidgets";
import RecentArticles from "./components/RecentArticles";

export default function AdminPage() {
  return (
    <div className="  flex">
      {/* <Sidebar /> */}
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* <Header /> */}
        <div className="">
          <DashboardWidgets />
          <RecentArticles />
        </div>
      </main>
    </div>
  );
}
