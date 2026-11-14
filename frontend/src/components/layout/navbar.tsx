"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { User } from "@/types";
import { api } from "@/lib/api";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("cm_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const handleLogout = () => {
    api.removeToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="w-full shrink-0 z-50 pt-2.5 sm:pt-3 pb-1 px-3 sm:px-6 flex flex-col items-center">
      {/* Single Clean Pill Navbar (No Nested Pill-in-Pill) */}
      <div className="w-full max-w-5xl bg-[#0e2647] text-white rounded-full shadow-md shadow-[#0a1d37]/15 px-3.5 sm:px-5 py-2 transition-all">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pl-1 pr-2 py-0.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full shrink-0"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <Image
                src="/logo-app-white.webp"
                alt="Pasbana AI Logo"
                width={32}
                height={32}
                className="rounded-full object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight text-sm sm:text-base leading-none">
                Pasbana<span className="text-[#ce2731] font-bold"> AI</span>
              </span>
              <span className="text-[9px] text-slate-300 tracking-wider mt-0.5 hidden sm:inline">
                Karir yang Pas Bana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Single Flat Row Inside Pill) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className="text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition"
            >
              Beranda
            </Link>
            <Link
              href="/evaluate"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition"
              title="Evaluasi CV &amp; Skor ATS"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-beacon shrink-0" aria-hidden="true" />
              <span>Skor ATS</span>
            </Link>
            <Link
              href="/jobs"
              className="text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition"
              title="Pencocokan Lowongan AI"
            >
              Pencocokan AI
            </Link>
            <Link
              href="/evaluate"
              className="text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition"
              title="Blind Scoring Bebas Bias"
            >
              Blind Scoring
            </Link>
            <Link
              href="/about"
              className="text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition"
            >
              Tentang Kami
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs bg-white/10 text-white px-3 py-1.5 rounded-full">
                  <UserIcon className="w-3.5 h-3.5 text-slate-300" />
                  <span className="font-medium max-w-[110px] truncate">{user.name}</span>
                  <span className="uppercase text-[9px] bg-secondary text-white px-1.5 py-0.5 rounded-full font-mono font-semibold">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-full transition cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 px-3.5 py-1.5 rounded-full transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold text-white bg-secondary hover:bg-secondary-700 px-4 py-1.5 rounded-full shadow-sm transition flex items-center justify-center"
                >
                  Daftar Akun
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-200 hover:bg-white/10 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Floating Dropdown Card */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 w-full max-w-sm rounded-3xl bg-[#0e2647]/95 backdrop-blur-xl text-white shadow-2xl px-5 py-4 space-y-2.5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-white py-1"
          >
            Beranda
          </Link>
          <Link
            href="/evaluate"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-white py-1"
          >
            Evaluasi CV &amp; Skor ATS
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-white py-1"
          >
            Dashboard ATS
          </Link>
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-white py-1"
          >
            Pencocokan Lowongan AI
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-white py-1"
          >
            Tentang Kami
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">
                  {user.name} ({user.role})
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-400 font-medium py-1 cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/15 py-2 rounded-full"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-white bg-secondary hover:bg-secondary-700 py-2 rounded-full shadow"
                >
                  Daftar Akun
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
