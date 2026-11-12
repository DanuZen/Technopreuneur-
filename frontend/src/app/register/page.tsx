"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User as UserIcon, Building2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { UserRole } from "@/types";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>("jobseeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pdpConsent, setPdpConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!pdpConsent) {
      setError("Anda wajib menyetujui persetujuan pemrosesan data (UU PDP) untuk melanjutkan.");
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
      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal mendaftar. Silakan coba kembali.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12 sm:px-6 animate-fade-in-up">
      <div className="bg-gradient-to-br from-white via-blue-50/40 to-slate-50 p-8 rounded-3xl border-2 border-blue-200/85 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
            <Image
              src="/logo-app-navy.webp"
              alt="Pasbana AI"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Daftar ke Pasbana<span className="text-[#ce2731]"> AI</span>
          </h1>
          <p className="text-xs text-slate-600">
            Mulai eksplorasi peluang karir atau publikasikan lowongan kerja Anda.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-blue-100/70 rounded-2xl border border-blue-200">
          <button
            type="button"
            onClick={() => setRole("jobseeker")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              role === "jobseeker"
                ? "bg-primary text-white shadow-sm"
                : "text-primary hover:text-secondary font-medium"
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            Pencari Kerja
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              role === "employer"
                ? "bg-primary text-white shadow-sm"
                : "text-primary hover:text-secondary font-medium"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Pemberi Kerja / HR
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              {role === "employer" ? "Nama Perusahaan / Rekruter" : "Nama Lengkap"}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "employer" ? "PT Solusi Digital Indonesia" : "Wira Fikri Ramadanu"}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* UU PDP Consent Box */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="pdp-consent"
                checked={pdpConsent}
                onChange={(e) => setPdpConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <label htmlFor="pdp-consent" className="text-xs text-slate-700 leading-snug">
                Saya memberikan persetujuan eksplisit untuk pengolahan data profil/CV saya sesuai dengan <span className="font-semibold text-primary">UU Pelindungan Data Pribadi (UU No. 27/2022)</span>. Data Anda tidak akan dibagikan ke pihak ketiga tanpa izin.
              </label>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Hak hapus data (Right to be Forgotten) dapat diakses kapan saja.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-secondary hover:bg-secondary-700 text-white font-semibold text-sm rounded-full shadow-lg shadow-secondary/25 transition flex items-center justify-center gap-2 disabled:opacity-60 min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Mendaftarkan...
              </>
            ) : (
              `Daftar Sebagai ${role === "employer" ? "Pemberi Kerja" : "Pencari Kerja"}`
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </main>
  );
}

