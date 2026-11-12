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
    <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur-md border-b border-primary-800 text-white shadow-lg transition-all">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <Image
                src="/logo-app-white.webp"
                alt="Pasbana AI Logo"
                width={32}
                height={32}
                className="rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg leading-tight">
                Pasbana<span className="text-[#ce2731] font-bold"> AI</span>
              </span>
              <span className="text-[10px] text-slate-300 tracking-wider">
                Karir yang Pas Bana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              Beranda
            </Link>
            <Link
              href="/evaluate"
              className="text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              Evaluasi CV
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              Dashboard ATS
            </Link>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              Cari Lowongan
            </Link>
            <Link
              href="/about"
              className="text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              Tentang Kami
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20">
                  <UserIcon className="w-3.5 h-3.5 text-slate-300" />
                  <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                  <span className="uppercase text-[9px] bg-secondary text-white px-1.5 py-0.5 rounded font-mono font-semibold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-lg transition"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-200 hover:text-white px-3 py-2 rounded-full transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-semibold text-white bg-secondary hover:bg-secondary-700 px-4 py-2 rounded-full shadow-md shadow-secondary/25 transition min-h-[36px] flex items-center justify-center"
                >
                  Daftar Akun
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-primary-800 bg-primary px-4 pt-2 pb-4 space-y-3">
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
            Evaluasi CV
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
            Cari Lowongan
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-white py-1"
          >
            Tentang Kami
          </Link>
          <div className="pt-2 border-t border-primary-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">{user.name} ({user.role})</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-400 font-medium py-1"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-slate-200 border border-white/20 py-2 rounded-full"
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
