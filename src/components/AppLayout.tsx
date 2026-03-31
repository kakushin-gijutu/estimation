"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const noSidebarPaths = ["/", "/login"];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !noSidebarPaths.includes(pathname);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen print:block">
      <Sidebar />
      <main className="flex-1 min-w-0 print:w-full">{children}</main>
    </div>
  );
}
