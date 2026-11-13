"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.login({ email, password });
      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal masuk. Periksa kembali email dan password Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12 sm:px-6 animate-fade-in-up">
      <div className="bg-white p-8 rounded-3xl clay-card shadow-2xl space-y-6">
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
            Masuk ke Pasbana<span className="text-[#ce2731]"> AI</span>
          </h1>
          <p className="text-xs text-slate-600">
            Akses analisa CV, kuesioner terpandu, dan rekomendasi lowongan presisi.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#edf2f9] rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="block text-xs font-semibold text-primary uppercase tracking-wider">
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#edf2f9] rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-[#163861] text-white font-semibold text-sm rounded-full shadow-md shadow-primary/25 transition flex items-center justify-center gap-2 disabled:opacity-60 min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Memverifikasi...
              </>
            ) : (
              "Masuk ke Akun"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 text-center text-xs text-slate-600">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-secondary font-bold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </main>
  );
}

