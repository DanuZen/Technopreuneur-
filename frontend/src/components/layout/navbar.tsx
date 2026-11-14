"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  FileCheck,
  Briefcase,
} from "lucide-react";
import { User } from "@/types";
import { api } from "@/lib/api";

export function Navbar({ floating = false }: { floating?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    api.removeToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      className={
        floating
          ? "w-full z-50 px-2.5 sm:px-4 flex flex-col items-center bg-transparent pointer-events-none"
          : "sticky top-0 w-full shrink-0 z-50 bg-transparent pt-2.5 sm:pt-3 pb-1.5 px-2.5 sm:px-4 flex flex-col items-center pointer-events-none"
      }
    >
      {/* Single Clean Pill Navbar matching the exact gap of the card below */}
      <div className="pointer-events-auto w-full bg-[#0e2647]/90 backdrop-blur-xl border border-white/15 text-white rounded-full shadow-lg shadow-[#051529]/20 px-4 sm:px-6 py-2 transition-all">
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
              title="Evaluasi CV & Skor ATS"
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
          <div className="hidden md:flex items-center gap-1.5 shrink-0 relative" ref={dropdownRef}>
            {user ? (
              <div className="relative">
                {/* Trigger Pill Button with Chevron */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/15 text-white px-3.5 py-1.5 rounded-full border border-white/10 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-expanded={userDropdownOpen}
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-300" />
                  <span className="font-semibold max-w-[120px] truncate">{user.name}</span>
                  <span className="uppercase text-[9px] bg-[#ce2731] text-white px-1.5 py-0.5 rounded-full font-mono font-bold">
                    {user.role}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Floating User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#0e2647]/95 backdrop-blur-2xl border border-white/15 text-white shadow-2xl p-2 z-50">
                    {/* User Profile Header */}
                    <div className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 mb-1.5">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-300 truncate mt-0.5">
                        {user.email || "Akun Terverifikasi"}
                      </div>
                      <span className="inline-block mt-1.5 uppercase text-[9px] bg-[#ce2731] text-white px-2 py-0.5 rounded-full font-mono font-bold">
                        Role: {user.role}
                      </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#faa9ab]" />
                        <span>Dashboard ATS</span>
                      </Link>
                      <Link
                        href="/evaluate"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
                      >
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        <span>Evaluasi CV 5D</span>
                      </Link>
                      <Link
                        href="/jobs"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
                      >
                        <Briefcase className="w-4 h-4 text-sky-400" />
                        <span>Pencocokan Lowongan</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="my-1.5 border-t border-white/10" />

                    {/* Logout Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar dari Akun</span>
                    </button>
                  </div>
                )}
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
                  className="text-xs font-semibold text-white bg-[#ce2731] hover:bg-[#b01e27] px-4 py-1.5 rounded-full shadow-sm transition flex items-center justify-center font-bold"
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
                  className="text-center text-sm font-medium text-white bg-[#ce2731] hover:bg-[#b01e27] py-2 rounded-full shadow font-bold"
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
