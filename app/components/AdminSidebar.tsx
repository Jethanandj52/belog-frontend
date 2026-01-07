import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen border-r p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-4 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/guest-posts">Guest Posts</Link>
        <Link href="/categories">Categories</Link>
      </nav>
    </aside>
  );
}
