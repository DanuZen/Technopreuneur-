"use client";

import React, { useState, useEffect, Suspense } from "react";
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

  // Bagian side ini aktif ketika dalam ruang kerja (/[role]/dashboard, /evaluate, /onboarding, dan /dashboard)
  const isDashboardWorkspace =
    /^\/(user|company|admin)\/dashboard(\/|$)/.test(pathname) ||
    pathname.startsWith("/evaluate") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/dashboard");

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

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Halaman autentikasi (/login dan /register): Fit-viewport pada desktop, responsif pada mobile
  if (isAuthPage) {
    return (
      <main className="h-auto md:h-dvh md:overflow-hidden viewport-shell w-full bg-white text-primary">
        {children}
      </main>
    );
  }

  // Halaman full-slide (/ , /jobs, /about): Terkunci 1 layar penuh dengan Navbar melayang & Reveal Sidebar di mobile
  const isFullSlidePage =
    pathname === "/" || pathname === "/jobs" || pathname === "/about";

  if (isFullSlidePage) {
    return (
      <div className="flex h-dvh w-full overflow-hidden bg-[#edf2f9] lg:bg-[#fefefd] text-primary select-none relative">
        <Suspense fallback={null}>
          <AppSidebar
            variant="public"
            isMobileOpen={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
            isDesktopCollapsed={false}
            onToggleDesktopCollapse={() => {}}
          />
        </Suspense>

        <div
          className={`flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden bg-[#fefefd] relative z-20 isolate transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left lg:translate-x-0 lg:scale-100 ${
            isMobileOpen
              ? "translate-x-[232px] sm:translate-x-[256px] scale-[0.84] rounded-[28px] shadow-[0_24px_60px_rgba(15,44,86,0.22)] ring-1 ring-[#0f2c56]/10"
              : "translate-x-0 scale-100 rounded-none"
          }`}
        >
          {isMobileOpen && (
            <div
              role="button"
              tabIndex={0}
              aria-label="Tutup menu dan kembali ke halaman"
              onClick={() => setIsMobileOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setIsMobileOpen(false);
              }}
              className="absolute inset-0 z-50 lg:hidden cursor-pointer"
            />
          )}
          <Navbar
            isMobileOpen={isMobileOpen}
            onToggleMobile={() => setIsMobileOpen((s) => !s)}
          />
          <main className="flex-1 min-h-0 w-full overflow-hidden relative">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Tampilan halaman publik lainnya (/apply): Pill Navbar + Konten + Footer + Reveal Sidebar di mobile
  if (!isDashboardWorkspace) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden bg-[#edf2f9] lg:bg-[#fefefd] text-primary relative">
        <Suspense fallback={null}>
          <AppSidebar
            variant="public"
            isMobileOpen={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
            isDesktopCollapsed={false}
            onToggleDesktopCollapse={() => {}}
          />
        </Suspense>

        <div
          className={`flex flex-1 flex-col justify-between min-w-0 bg-[#fefefd] relative z-20 isolate transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left lg:translate-x-0 lg:scale-100 ${
            isMobileOpen
              ? "translate-x-[232px] sm:translate-x-[256px] scale-[0.84] rounded-[28px] shadow-[0_24px_60px_rgba(15,44,86,0.22)] ring-1 ring-[#0f2c56]/10 overflow-hidden h-dvh"
              : "translate-x-0 scale-100 rounded-none"
          }`}
        >
          {isMobileOpen && (
            <div
              role="button"
              tabIndex={0}
              aria-label="Tutup menu dan kembali ke halaman"
              onClick={() => setIsMobileOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setIsMobileOpen(false);
              }}
              className="absolute inset-0 z-50 lg:hidden cursor-pointer"
            />
          )}
          <Navbar
            isMobileOpen={isMobileOpen}
            onToggleMobile={() => setIsMobileOpen((s) => !s)}
          />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    );
  }

  // Tampilan khusus dashboard evaluasi: Fit-Viewport 3-Layer Flex + Clean Scroll
  return (
    <div className="flex h-dvh w-full overflow-hidden viewport-shell bg-[#edf2f9] text-primary select-auto font-sans relative">
      {/* ChatGPT-style Collapsible AppSidebar (Reveal pattern on mobile) */}
      <Suspense fallback={null}>
        <AppSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopCollapse={handleToggleDesktopCollapse}
        />
      </Suspense>

      {/* Main Workspace Stage (Steps back with Reveal animation on mobile, Rounded Clay Stage on Desktop) */}
      <div
        className={`flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden bg-[#fefefd] clay-stage lg:my-2 lg:mr-2 lg:rounded-[32px] relative z-20 isolate transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left lg:translate-x-0 lg:scale-100 ${
          isMobileOpen
            ? "translate-x-[232px] sm:translate-x-[256px] scale-[0.84] rounded-[28px] shadow-[0_24px_60px_rgba(15,44,86,0.22)] ring-1 ring-[#0f2c56]/10"
            : "translate-x-0 scale-100 rounded-none shadow-2xl shadow-primary/10"
        }`}
      >
        {isMobileOpen && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Tutup menu dan kembali ke halaman"
            onClick={() => setIsMobileOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsMobileOpen(false);
            }}
            className="absolute inset-0 z-50 lg:hidden cursor-pointer"
          />
        )}
        <AppHeader
          isMobileOpen={isMobileOpen}
          onToggleMobile={() => setIsMobileOpen((s) => !s)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopCollapse={handleToggleDesktopCollapse}
        />

        {/* Viewport Content */}
        <main
          id="konten-utama"
          className="flex-1 min-h-0 overflow-y-auto scrollbar-none pt-3.5 lg:pt-0"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
