"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { UserRole } from "@/types";
import { api } from "@/lib/api";
import { SplashScreen } from "@/components/ui/splash-screen";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("jobseeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pdpConsent, setPdpConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [splashActive, setSplashActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!pdpConsent) {
      setError("Anda wajib menyetujui persetujuan pemrosesan data untuk melanjutkan.");
      return;
    }

    setLoading(true);

    try {
      await api.register({
        name,
        email,
        password,
        role,
        pdpConsent,
      });
      setSplashActive(true);
    } catch {
      // Fallback sesi lokal apabila layanan backend sedang offline
      try {
        localStorage.setItem(
          "cm_user",
          JSON.stringify({
            id: `user-${Date.now()}`,
            name: name.trim(),
            email: email.trim(),
            role,
          })
        );
        localStorage.setItem("cm_token", "demo-session-token-pasbana");
      } catch {
        // ignore
      }
      setSplashActive(true);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {splashActive && (
        <SplashScreen
          isVisible={splashActive}
          variant="fade"
          message="Menyiapkan Akun Pasbana AI Anda..."
          subMessage="Mengarahkan ke ruang evaluasi CV & pencocokan karir"
          duration={1000}
          onFinish={() => {
            router.push(role === "employer" ? "/jobs" : "/evaluate");
          }}
        />
      )}

      <div className="min-h-dvh w-full flex flex-col lg:flex-row bg-white overflow-x-hidden login-slide-in-left">
        {/* LEFT COLUMN (50% Width): Rounded Box Showcase (Matching Splash Screen) */}
        <div className="hidden lg:flex w-1/2 min-h-screen p-4 xl:p-6 bg-white login-showcase-in-left">
          <div className="relative w-full h-full rounded-[32px] xl:rounded-[40px] bg-gradient-to-br from-[#0a1f3d] via-[#0f2c56] to-[#163c73] flex flex-col items-center justify-center p-10 xl:p-14 text-white overflow-hidden">
            {/* Soft Ambient Glow Orbs */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -right-28 w-96 h-96 rounded-full bg-[#ce2731]/25 blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_0%,transparent_62%)]" />

            {/* Centered Large Splash-Style Lockup */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-7 max-w-lg mx-auto">
              <div className="flex items-center gap-5 xl:gap-6">
                {/* Logo di Kiri */}
                <div className="relative w-20 h-20 xl:w-24 xl:h-24 shrink-0 drop-shadow-[0_20px_38px_rgba(0,0,0,0.35)]">
                  <Image
                    src="/logo-white.webp"
                    alt="Logo Pasbana"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Nama & Tagline Sejajar di Kanan */}
                <div className="flex flex-col justify-center space-y-2 text-left animate-fade-in-up delay-200">
                  <h2 className="text-4xl xl:text-5xl font-black tracking-[0.06em] text-white leading-none uppercase">
                    PASBANA
                  </h2>
                  <div className="w-full flex items-center justify-between gap-3">
                    <span className="w-6 h-1 rounded-full bg-[#ce2731] shrink-0" />
                    <p className="text-[10.5px] xl:text-xs font-bold text-white/85 uppercase tracking-[0.2em] leading-none whitespace-nowrap">
                      KARIR YANG PAS BANA
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm xl:text-base text-slate-200/90 font-medium leading-relaxed max-w-md animate-fade-in-up delay-300">
                Bergabung bersama ribuan talenta muda untuk mengukur kesiapan CV dan menjangkau karir impian.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 animate-fade-in-up delay-300">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white/95 backdrop-blur-xs">
                  Kuesioner CV Otomatis
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#ce2731] text-xs font-bold text-white shadow-sm">
                  Akses Gratis
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white/95 backdrop-blur-xs">
                  Rekomendasi Akurat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (50% Width): Clean Form Panel */}
        <div className="w-full lg:w-1/2 min-h-dvh p-6 sm:p-8 lg:p-10 xl:p-14 flex flex-col justify-between bg-white z-10 overflow-y-auto scrollbar-none">
          {/* Top Utility Header */}
          <div className="flex items-center justify-end animate-fade-in-up delay-100">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-500 hover:text-[#0f2c56] transition-colors"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>

          {/* Center Form Body */}
          <div className="max-w-md w-full mx-auto my-auto space-y-4 py-4">
            <div className="space-y-1 text-center animate-fade-in-up delay-200">
              <span className="inline-block px-3 py-1 rounded-full bg-[#0f2c56]/10 text-[#0f2c56] text-[10.5px] font-extrabold tracking-widest uppercase">
                REGISTRASI AKUN • PASBANA AI
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2c56] tracking-tight">
                Buat Akun Baru
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Mulai evaluasi CV 5 dimensi atau publikasikan lowongan kerja Anda
              </p>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl animate-fade-in-up delay-200">
              <button
                type="button"
                onClick={() => setRole("jobseeker")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  role === "jobseeker"
                    ? "bg-[#0f2c56] text-white shadow-2xs"
                    : "text-slate-600 hover:text-[#0f2c56]"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                Pencari Kerja
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  role === "employer"
                    ? "bg-[#0f2c56] text-white shadow-2xs"
                    : "text-slate-600 hover:text-[#0f2c56]"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Pemberi Kerja / HR
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 animate-fade-in-up delay-300">
              {/* Name Input */}
              <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#0f2c56]/50 focus-within:border-[#0f2c56] focus-within:ring-4 focus-within:ring-[#0f2c56]/10 focus-within:shadow-[0_8px_24px_-4px_rgba(15,44,86,0.18)] rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-2xs">
                <label
                  htmlFor="register-name"
                  className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#0f2c56] group-focus-within:font-extrabold z-10 leading-none select-none pointer-events-none"
                >
                  {role === "employer" ? "Nama Perusahaan / HR" : "Nama Lengkap"}
                </label>
                <div className="w-8 h-8 rounded-lg bg-[#0f2c56]/10 border border-[#0f2c56]/20 text-[#0f2c56] flex items-center justify-center shrink-0 mr-3 transition-all duration-300 group-focus-within:bg-[#0f2c56] group-focus-within:text-white">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "employer" ? "PT Nusantara Inovasi" : "Wira Fikri Ramadanu"}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-300 bg-transparent focus:outline-none"
                />
                {name.trim() && (
                  <div className="w-5 h-5 rounded-full bg-[#0f2c56]/10 text-[#0f2c56] flex items-center justify-center shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#0f2c56] via-[#ce2731] to-[#0f2c56] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
              </div>

              {/* Email Input */}
              <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#0f2c56]/50 focus-within:border-[#0f2c56] focus-within:ring-4 focus-within:ring-[#0f2c56]/10 focus-within:shadow-[0_8px_24px_-4px_rgba(15,44,86,0.18)] rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-2xs">
                <label
                  htmlFor="register-email"
                  className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#0f2c56] group-focus-within:font-extrabold z-10 leading-none select-none pointer-events-none"
                >
                  Alamat Email
                </label>
                <div className="w-8 h-8 rounded-lg bg-[#0f2c56]/10 border border-[#0f2c56]/20 text-[#0f2c56] flex items-center justify-center shrink-0 mr-3 transition-all duration-300 group-focus-within:bg-[#0f2c56] group-focus-within:text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-300 bg-transparent focus:outline-none"
                />
                <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#0f2c56] via-[#ce2731] to-[#0f2c56] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#0f2c56]/50 focus-within:border-[#0f2c56] focus-within:ring-4 focus-within:ring-[#0f2c56]/10 rounded-xl px-3 py-2.5 transition-all duration-300 shadow-2xs">
                  <label
                    htmlFor="register-password"
                    className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#0f2c56] z-10 leading-none select-none pointer-events-none"
                  >
                    Kata Sandi
                  </label>
                  <div className="w-7 h-7 rounded-lg bg-[#0f2c56]/10 border border-[#0f2c56]/20 text-[#0f2c56] flex items-center justify-center shrink-0 mr-2.5 transition-all duration-300 group-focus-within:bg-[#0f2c56] group-focus-within:text-white">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-300 bg-transparent focus:outline-none"
                  />
                  <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#0f2c56] via-[#ce2731] to-[#0f2c56] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
                </div>

                <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#0f2c56]/50 focus-within:border-[#0f2c56] focus-within:ring-4 focus-within:ring-[#0f2c56]/10 rounded-xl px-3 py-2.5 transition-all duration-300 shadow-2xs">
                  <label
                    htmlFor="register-confirm-password"
                    className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#0f2c56] z-10 leading-none select-none pointer-events-none"
                  >
                    Ulangi Sandi
                  </label>
                  <input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi"
                    className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-300 bg-transparent focus:outline-none pl-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Tampilkan atau sembunyikan kata sandi"
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#0f2c56] transition-colors ml-1 cursor-pointer shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#0f2c56] via-[#ce2731] to-[#0f2c56] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
                </div>
              </div>

              {/* Consent Box */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="pdp-consent"
                    checked={pdpConsent}
                    onChange={(e) => setPdpConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#0f2c56] rounded border-slate-300 focus:ring-[#0f2c56] cursor-pointer"
                  />
                  <label htmlFor="pdp-consent" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                    Saya menyetujui pemrosesan data profil/CV secara aman untuk evaluasi karir. Data Anda terlindungi dan dapat dihapus permanen kapan saja.
                  </label>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-700 font-semibold pl-6">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>Kendali penuh penghapusan data tersedia di akun Anda.</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-[#0f2c56] hover:bg-[#173d74] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#0f2c56]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sebagai {role === "employer" ? "Pemberi Kerja" : "Pencari Kerja"}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 pt-1">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-[#ce2731] font-bold hover:underline">
                Masuk Sekarang
              </Link>
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Pasbana AI - Platform Evaluasi CV &amp; Pencocokan Karir <br />
              © 2026 Pasbana AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
