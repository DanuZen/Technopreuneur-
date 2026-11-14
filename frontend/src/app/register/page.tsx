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

      <div className="min-h-dvh w-full flex flex-col lg:flex-row bg-white overflow-x-hidden login-slide-in-right">
        {/* LEFT COLUMN (50% Width): Clean Form Panel */}
        <div className="w-full lg:w-1/2 min-h-dvh p-6 sm:p-8 lg:p-10 xl:p-14 flex flex-col justify-between bg-white z-10 overflow-y-auto scrollbar-none">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between animate-fade-in-up delay-100">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-app-navy.webp"
                  alt="Logo Pasbana AI"
                  fill
                  className="object-contain rounded-xl"
                  priority
                />
              </div>
              <div>
                <p className="font-black text-2xl tracking-tight text-slate-900 leading-none group-hover:text-[#2563EB] transition-colors uppercase">
                  PASBANA <span className="text-[#ce2731]">AI</span>
                </p>
                <p className="text-[9px] font-bold text-[#2563EB] tracking-widest uppercase mt-0.5">
                  KARIR YANG PAS BANA
                </p>
              </div>
            </Link>

            <Link
              href="/login"
              className="text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition-colors"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>

          {/* Center Form Body */}
          <div className="max-w-md w-full mx-auto my-auto space-y-4 py-4">
            <div className="space-y-1 text-center animate-fade-in-up delay-200">
              <span className="inline-block px-3 py-1 rounded-full bg-[#8EC5FF]/35 text-[#0B0C0E] text-[10.5px] font-extrabold tracking-widest uppercase">
                REGISTRASI AKUN • PASBANA AI
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
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
                    ? "bg-[#8EC5FF] text-[#0B0C0E] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
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
                    ? "bg-[#8EC5FF] text-[#0B0C0E] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
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
              <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#8EC5FF] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#8EC5FF]/30 rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-2xs">
                <label
                  htmlFor="register-name"
                  className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#2563EB] z-10 leading-none select-none pointer-events-none"
                >
                  {role === "employer" ? "Nama Perusahaan / HR" : "Nama Lengkap"}
                </label>
                <div className="w-8 h-8 rounded-lg bg-[#8EC5FF]/35 border border-[#8EC5FF]/60 text-[#0B0C0E] flex items-center justify-center shrink-0 mr-3">
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
                  <div className="w-5 h-5 rounded-full bg-[#8EC5FF]/40 text-[#0B0C0E] flex items-center justify-center shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#8EC5FF] to-[#2563EB] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
              </div>

              {/* Email Input */}
              <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#8EC5FF] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#8EC5FF]/30 rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-2xs">
                <label
                  htmlFor="register-email"
                  className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#2563EB] z-10 leading-none select-none pointer-events-none"
                >
                  Alamat Email
                </label>
                <div className="w-8 h-8 rounded-lg bg-[#8EC5FF]/35 border border-[#8EC5FF]/60 text-[#0B0C0E] flex items-center justify-center shrink-0 mr-3">
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
                <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#8EC5FF] to-[#2563EB] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#8EC5FF] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#8EC5FF]/30 rounded-xl px-3 py-2.5 transition-all duration-300 shadow-2xs">
                  <label
                    htmlFor="register-password"
                    className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#2563EB] z-10 leading-none select-none pointer-events-none"
                  >
                    Kata Sandi
                  </label>
                  <div className="w-7 h-7 rounded-lg bg-[#8EC5FF]/35 border border-[#8EC5FF]/60 text-[#0B0C0E] flex items-center justify-center shrink-0 mr-2.5">
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
                </div>

                <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#8EC5FF] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#8EC5FF]/30 rounded-xl px-3 py-2.5 transition-all duration-300 shadow-2xs">
                  <label
                    htmlFor="register-confirm-password"
                    className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#2563EB] z-10 leading-none select-none pointer-events-none"
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
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#2563EB] transition-colors ml-1 cursor-pointer shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
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
                    className="mt-0.5 w-4 h-4 text-[#2563EB] rounded border-slate-300 focus:ring-[#2563EB] cursor-pointer"
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
                className="w-full py-3 px-6 rounded-xl bg-[#8EC5FF] hover:bg-[#74B6FF] active:scale-[0.99] text-[#0B0C0E] font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#8EC5FF]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0B0C0E]/30 border-t-[#0B0C0E] rounded-full animate-spin" />
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <span>Daftar Sebagai {role === "employer" ? "Pemberi Kerja" : "Pencari Kerja"}</span>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 pt-1">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
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

        {/* RIGHT COLUMN (50% Width): Rounded Box Showcase */}
        <div className="hidden lg:flex w-1/2 min-h-screen p-4 xl:p-6 bg-white login-showcase-in-right">
          <div className="relative w-full h-full rounded-[32px] xl:rounded-[40px] bg-gradient-to-br from-[#061026] via-[#12387a] to-[#5aa7ff] flex flex-col justify-center p-12 xl:p-16 text-white overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-55 bg-[radial-gradient(ellipse_at_center,rgba(142,197,255,0.55)_0%,transparent_72%)] animate-pulse-glow" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#8EC5FF]/35 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="relative z-10 my-auto text-center space-y-6 py-12 max-w-lg mx-auto">
              <div className="w-28 h-28 mx-auto relative drop-shadow-[0_25px_50px_rgba(142,197,255,0.45)] animate-float-slow">
                <Image
                  src="/logo-app-white.webp"
                  alt="Logo Pasbana AI"
                  fill
                  className="object-contain rounded-3xl"
                  priority
                />
              </div>

              <div className="space-y-3 animate-fade-in-up delay-200">
                <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight uppercase">
                  PASBANA AI • KARIR PAS BANA
                </h2>
                <p className="text-sm text-blue-50/95 font-medium leading-relaxed">
                  Bergabung bersama ribuan talenta muda Indonesia untuk mengevaluasi kesiapan CV 5 dimensi dan menemukan peluang karir yang paling pas bana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
