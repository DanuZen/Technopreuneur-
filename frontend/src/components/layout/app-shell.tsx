"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Bagian side ini HANYA aktif ketika dalam dashboard evaluasi (/evaluate dan /dashboard)
  const isDashboardWorkspace =
    pathname.startsWith("/evaluate") || pathname.startsWith("/dashboard");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pasbana_sidebar_collapsed");
      if (stored !== null) {
        setIsDesktopCollapsed(stored === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pasbana_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Tampilan halaman publik / beranda: Navbar di atas + Konten landing + Footer
  if (!isDashboardWorkspace) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#fefefd] text-primary">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  // Tampilan khusus dashboard evaluasi (/evaluate dan /dashboard): Sidebar ala ChatGPT + Header
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#edf2f9] text-primary select-auto font-sans">
      {/* ChatGPT-style Collapsible AppSidebar */}
      <AppSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleDesktopCollapse={handleToggleDesktopCollapse}
      />

      {/* Main Workspace Stage (Rounded Clay Stage on Desktop) */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#fefefd] clay-stage lg:my-2 lg:mr-2 lg:rounded-[32px] relative isolate border border-blue-200/60 shadow-2xl shadow-primary/10">
        <AppHeader
          onToggleMobile={() => setIsMobileOpen((s) => !s)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopCollapse={handleToggleDesktopCollapse}
        />

        {/* Scrollable Viewport Content */}
        <main id="konten-utama" className="flex-1 overflow-y-auto scrollbar-halus">
          {children}
        </main>
      </div>
    </div>
  );
}
