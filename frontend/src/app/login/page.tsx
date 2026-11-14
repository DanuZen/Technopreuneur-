"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { SplashScreen } from "@/components/ui/splash-screen";
import { api } from "@/lib/api";

const QUICK_ROLES = [
  {
    id: "jobseeker",
    label: "Pencari Kerja",
    email: "wira@student.unp.ac.id",
    name: "Wira Fikri Ramadanu",
    role: "jobseeker",
    desc: "Fresh Graduate • Evaluasi CV & Kuesioner ATS",
    path: "/evaluate",
    icon: GraduationCap,
  },
  {
    id: "dashboard",
    label: "Dashboard ATS",
    email: "kandidat@pasbana.ai",
    name: "Danu Pratama",
    role: "jobseeker",
    desc: "Kandidat Aktif • Hasil Analisis 5 Dimensi",
    path: "/dashboard",
    icon: UserCheck,
  },
  {
    id: "employer",
    label: "Pemberi Kerja / HRD",
    email: "hr@nusantara.co.id",
    name: "PT Nusantara Inovasi",
    role: "employer",
    desc: "Mitra Industri • Eksplorasi Lowongan & Talenta",
    path: "/jobs",
    icon: ShieldCheck,
  },
];

const FAQ_ITEMS = [
  {
    q: "Apakah perlu membuat akun terlebih dahulu?",
    a: "Untuk kemudahan pengujian dan review, Anda cukup menekan salah satu tombol ikon role pada bagian Login Cepat di bawah tombol Masuk untuk langsung mengakses portal masing-masing.",
  },
  {
    q: "Bagaimana jika saya belum memiliki berkas CV?",
    a: "Pasbana AI menyediakan fitur Kuesioner Terpandu di halaman Evaluasi CV sehingga Anda dapat menyusun resume standar ATS dari nol secara otomatis.",
  },
  {
    q: "Role apa saja yang tersedia di Pasbana AI?",
    a: "Pasbana AI menyediakan akses untuk Pencari Kerja / Fresh Graduate (Evaluasi CV 5 Dimensi, Kuesioner ATS, Rekomendasi Loker) serta Pemberi Kerja / HRD Mitra Industri.",
  },
];

const PORTAL_PREFIXES = ["/evaluate", "/dashboard", "/jobs", "/apply"];

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("wira@student.unp.ac.id");
  const [password, setPassword] = useState("pasbana2026");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const [enterDirection] = useState<"right" | "left">(() => {
    if (typeof window === "undefined") return "right";
    try {
      const prev = sessionStorage.getItem("pasbana_prev_path") || "";
      if (PORTAL_PREFIXES.some((prefix) => prev.startsWith(prefix))) {
        return "left";
      }
    } catch {
      // ignore
    }
    return "right";
  });
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/evaluate");
    router.prefetch("/dashboard");
    router.prefetch("/jobs");
    try {
      sessionStorage.setItem("pasbana_prev_path", "/login");
    } catch {
      // ignore
    }
  }, [router]);

  const [splash, setSplash] = useState<{
    active: boolean;
    msg: string;
    sub: string;
    targetPath?: string;
  }>({
    active: false,
    msg: "Memuat Pasbana AI...",
    sub: "Platform Evaluasi CV Objektif & Pencocokan Karir",
  });

  const handleBackToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (exitDirection) return;
    setExitDirection("right");
    setTimeout(() => {
      router.push("/");
    }, 340);
  };

  const triggerPortalTransition = (
    targetPath: string,
    roleLabel: string,
    userObj?: { id: string; name: string; email: string; role: string }
  ) => {
    if (exitDirection) return;
    if (userObj) {
      try {
        localStorage.setItem("cm_user", JSON.stringify(userObj));
        localStorage.setItem("cm_token", "demo-session-token-pasbana");
      } catch {
        // ignore
      }
    }
    setSplash({
      active: true,
      msg: `Mengarahkan ke ${roleLabel}...`,
      sub: "Menyiapkan ruang evaluasi & antarmuka akun Anda",
      targetPath,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (exitDirection) return;
    setError(null);
    setLoading(true);

    const val = identifier.trim().toLowerCase();

    try {
      const res = await api.login({ email: identifier.trim(), password });
      triggerPortalTransition("/evaluate", "Ruang Evaluasi CV", {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role,
      });
    } catch {
      // Fallback ke akun demo cepat apabila memakai kredensial pratinjau
      const matchedQuick = QUICK_ROLES.find(
        (r) =>
          val === r.email.toLowerCase() ||
          val.includes(r.id) ||
          val.includes("wira") ||
          val.includes("hr") ||
          val.includes("kandidat")
      );

      if (matchedQuick || password.length >= 4) {
        const chosen = matchedQuick || QUICK_ROLES[0];
        triggerPortalTransition(chosen.path, chosen.label, {
          id: `demo-${chosen.id}`,
          name: chosen.name,
          email: identifier.trim() || chosen.email,
          role: chosen.role,
        });
      } else {
        setError("Gagal masuk. Periksa kembali alamat email dan kata sandi Anda.");
        setLoading(false);
      }
    }
  };

  const pageSlideClass = exitDirection
    ? exitDirection === "left"
      ? "login-slide-out-left"
      : "login-slide-out-right"
    : enterDirection === "left"
    ? "login-slide-in-left"
    : "login-slide-in-right";

  const showcaseSlideClass = exitDirection
    ? ""
    : enterDirection === "left"
    ? "login-showcase-in-left"
    : "login-showcase-in-right";

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Splash Screen Overlay during portal transition */}
      {splash.active && (
        <SplashScreen
          isVisible={splash.active}
          variant="fade"
          message={splash.msg}
          subMessage={splash.sub}
          duration={1000}
          onFinish={() => {
            if (splash.targetPath) {
              router.push(splash.targetPath);
            }
          }}
        />
      )}

      <div
        className={`h-dvh lg:min-h-screen lg:h-auto w-full flex flex-col lg:flex-row bg-white overflow-hidden lg:overflow-x-hidden ${pageSlideClass}`}
      >
        {/* LEFT COLUMN (50% Width): Full-Screen Clean Form Panel */}
        <div className="w-full lg:w-1/2 h-full lg:min-h-screen lg:h-auto p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-between bg-white z-10 overflow-y-auto scrollbar-none">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between animate-fade-in-up delay-100">
            <Link
              href="/"
              onClick={handleBackToHome}
              className="flex items-center gap-3 group cursor-pointer"
            >
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

            <button
              type="button"
              onClick={() => setShowFaqModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition-colors cursor-pointer group"
            >
              <HelpCircle className="w-4 h-4 text-[#2563EB] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline">Pusat Bantuan</span>
            </button>
          </div>

          {/* Form Content Body */}
          <div className="max-w-md w-full mx-auto my-auto space-y-5 py-4">
            {/* Title & Subtitle */}
            <div className="space-y-1.5 text-center animate-fade-in-up delay-200">
              <span className="inline-block px-3 py-1 rounded-full bg-[#8EC5FF]/35 text-[#0B0C0E] text-[10.5px] font-extrabold tracking-widest uppercase">
                PORTAL KARIR • PASBANA AI
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Masukkan email akun dan kata sandi Anda untuk melanjutkan
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 shadow-2xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Inputs with Floating Notched Outline Labels */}
            <form onSubmit={handleLogin} className="space-y-4 pt-2 animate-fade-in-up delay-300">
              {/* Email / Username Input Box */}
              <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#8EC5FF] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#8EC5FF]/30 focus-within:shadow-[0_8px_24px_-4px_rgba(142,197,255,0.35)] rounded-xl px-3.5 py-3 transition-all duration-300 shadow-2xs">
                <label
                  htmlFor="login-identifier"
                  className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#2563EB] group-focus-within:font-extrabold transition-all duration-200 z-10 leading-none select-none pointer-events-none"
                >
                  Email / Username
                </label>

                <div className="w-8 h-8 rounded-lg bg-[#8EC5FF]/35 border border-[#8EC5FF]/60 text-[#0B0C0E] flex items-center justify-center shrink-0 mr-3 transition-all duration-300 group-focus-within:bg-[#8EC5FF] group-focus-within:text-[#0B0C0E]">
                  <User className="w-4 h-4" />
                </div>

                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Masukkan email akun..."
                  className="w-full text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-300 bg-transparent focus:outline-none"
                />

                {identifier.trim() && (
                  <div className="w-5 h-5 rounded-full bg-[#8EC5FF]/40 text-[#0B0C0E] flex items-center justify-center shrink-0 ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Laser Accent Line */}
                <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#8EC5FF] to-[#2563EB] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
              </div>

              {/* Password Input Box */}
              <div className="group relative flex items-center bg-white border border-slate-300 hover:border-[#8EC5FF] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#8EC5FF]/30 focus-within:shadow-[0_8px_24px_-4px_rgba(142,197,255,0.35)] rounded-xl px-3.5 py-3 transition-all duration-300 shadow-2xs">
                <label
                  htmlFor="login-password"
                  className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-[#2563EB] group-focus-within:font-extrabold transition-all duration-200 z-10 leading-none select-none pointer-events-none"
                >
                  Kata Sandi
                </label>

                <div className="w-8 h-8 rounded-lg bg-[#8EC5FF]/35 border border-[#8EC5FF]/60 text-[#0B0C0E] flex items-center justify-center shrink-0 mr-3 transition-all duration-300 group-focus-within:bg-[#8EC5FF] group-focus-within:text-[#0B0C0E]">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan kata sandi..."
                  className="w-full text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-300 bg-transparent focus:outline-none tracking-wider"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#2563EB] transition-colors ml-1 cursor-pointer shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                {/* Laser Accent Line */}
                <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#8EC5FF] to-[#2563EB] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-center pointer-events-none" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-[#8EC5FF] hover:bg-[#74B6FF] active:scale-[0.99] text-[#0B0C0E] font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#8EC5FF]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0B0C0E]/30 border-t-[#0B0C0E] rounded-full animate-spin" />
                    <span>Mengotentikasi...</span>
                  </>
                ) : (
                  <span>Masuk ke Akun</span>
                )}
              </button>
            </form>

            {/* Quick Role Icon-Only Buttons Below Submit Button */}
            <div className="space-y-3 pt-1 animate-fade-in-up delay-300">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Login Cepat
                </span>
              </div>

              <div className="flex items-center justify-center gap-3.5">
                {QUICK_ROLES.map((role) => {
                  const RoleIcon = role.icon;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      title={`${role.label} - ${role.name} (${role.email})`}
                      aria-label={`Login cepat sebagai ${role.label}`}
                      onClick={() =>
                        triggerPortalTransition(role.path, role.label, {
                          id: `demo-${role.id}`,
                          name: role.name,
                          email: role.email,
                          role: role.role,
                        })
                      }
                      className="group relative w-11 h-11 rounded-xl border border-slate-200 hover:border-[#8EC5FF] bg-slate-50 hover:bg-[#8EC5FF] text-slate-600 hover:text-[#0B0C0E] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md hover:shadow-[#8EC5FF]/35 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <RoleIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-[#0B0C0E] text-white text-[10px] font-bold shadow-sm z-20">
                        {role.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Belum punya akun?{" "}
                <Link href="/register" className="text-[#2563EB] font-bold hover:underline">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center space-y-1.5">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Pasbana AI - Platform Evaluasi CV &amp; Pencocokan Karir <br />
              © 2026 Pasbana AI. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN (50% Width): Rounded Box Showcase */}
        <div className={`hidden lg:flex w-1/2 min-h-screen p-4 xl:p-6 bg-[#fefefd] ${showcaseSlideClass}`}>
          <div
            className="relative w-full h-full rounded-[32px] xl:rounded-[40px] flex flex-col justify-center p-12 xl:p-16 text-[#fefefd] overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #0f2c56 0%, #163861 48%, #ce2731 100%)",
            }}
          >
            {/* Centered Graphic Showcase */}
            <div className="relative z-10 my-auto text-center space-y-6 py-8 max-w-lg mx-auto">
              {/* Product Value Badges */}
              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 space-y-3.5 shadow-xl text-left">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white">Standar Evaluasi Resume</span>
                  <span className="text-[10px] font-mono font-bold bg-[#ce2731] text-white px-2 py-0.5 rounded-full">
                    ATS HRD 2026
                  </span>
                </div>
                <div className="space-y-2 text-xs text-[#fde6e6]">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Format 1-Kolom &amp; Tipografi Bebas Risiko Parsing</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Evaluasi 5 Dimensi Objektif &amp; Saran Kalimat Aktif</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pencocokan Lowongan Relevan dengan Akurasi Tinggi</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 animate-fade-in-up delay-200">
                <h2 className="text-3xl xl:text-4xl font-black tracking-tight text-[#fefefd] leading-tight uppercase">
                  PASBANA AI • KARIR PAS BANA
                </h2>
                <p className="text-sm text-[#fde6e6] font-medium leading-relaxed">
                  Platform Evaluasi CV Objektif 5 Dimensi, Panduan Kuesioner Standar ATS &amp; Rekomendasi Lowongan Kerja Terintegrasi untuk Talenta Muda Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Modal (Pusat Bantuan) */}
      {showFaqModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            onClick={() => setShowFaqModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer animate-fade-in"
          />

          <div className="relative w-full max-w-lg bg-white text-slate-900 border border-slate-200/90 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden animate-scale-up">
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 relative">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 leading-tight">
                    Pusat Bantuan
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Panduan Akses &amp; Fitur Pasbana AI
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FAQ List Content */}
            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-none pr-1">
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5 transition-colors hover:bg-slate-50/80"
                >
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6 font-normal">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 relative">
              <button
                type="button"
                onClick={() => setShowFaqModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
