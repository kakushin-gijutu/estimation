"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const navItems = [
  { href: "/estimate", label: "見積書一覧" },
  { href: "/estimate/new", label: "新規作成" },
  { href: "/estimate/companies", label: "会社管理" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-56 bg-gray-800 text-white h-screen flex flex-col shrink-0 sticky top-0 print:hidden">
      <div className="px-5 py-5 border-b border-gray-700">
        <h1 className="text-lg font-bold tracking-widest mt-0.5">
          <span className="text-white">R</span>
          <span className="text-gray-500">-</span>
          <span className="text-white">H</span>
          <span className="text-gray-500">-</span>
          <span className="text-white">Y</span>
        </h1>
        <p className="text-[9px] tracking-[0.25em] text-gray-500 uppercase mt-0.5">
          Estimate
        </p>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/estimate"
              ? pathname === "/estimate"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-gray-700 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-3">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 text-left transition-colors"
        >
          ログアウト
        </button>
      </div>
      <div className="px-5 py-4 border-t border-gray-700 text-[10px] text-gray-500">
        合同会社RHY
      </div>
    </aside>
  );
}
