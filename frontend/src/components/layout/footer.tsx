import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#163861] bg-gradient-to-b from-[#0f2c56] via-[#0d264a] to-[#0a1e3b] text-white mt-24">
      <div className="max-w-[1400px] w-full mx-auto px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <Image
                  src="/logo-app-white.webp"
                  alt="Pasbana AI Logo"
                  width={32}
                  height={32}
                  className="rounded-lg object-contain shrink-0 group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="font-bold text-white tracking-tight text-lg">
                Pasbana<span className="text-[#ce2731]"> AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Berasal dari bahasa Minang &quot;pas bana&quot; (sangat cocok). Menghubungkan potensi talenta dengan kebutuhan spesifik industri secara presisi melalui evaluasi CV objektif dan pencocokan cerdas.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Kepatuhan Privasi UU PDP No. 27/2022</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3 font-mono">
              Produk
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/evaluate" className="hover:text-white transition">
                  Evaluasi CV Digital
                </Link>
              </li>
              <li>
                <Link href="/evaluate?tab=questionnaire" className="hover:text-white transition">
                  Kuesioner Terpandu
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard ATS
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition">
                  Pencarian Lowongan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3 font-mono">
              Akses Pengguna
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Daftar Pencari Kerja
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Daftar Pemberi Kerja
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Tentang Proyek
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3 font-mono">
              Tim Pengembang
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              <li>
                <span className="font-semibold text-white">Wira Fikri Ramadanu</span>
                <span className="block text-[11px] text-slate-400">23343023 · Frontend Lead</span>
              </li>
              <li className="pt-1">
                <span className="font-semibold text-white">M. Gilang Ramadhan</span>
                <span className="block text-[11px] text-slate-400">23346013 · Backend Lead</span>
              </li>
              <li className="pt-1">
                <span className="font-semibold text-white">Florensius Panca Gati</span>
                <span className="block text-[11px] text-slate-400">23343006 · Backend AI Lead</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Pasbana AI. Proyek Technopreneurship 2026.
          </p>
          <p className="text-[11px] text-slate-400">
            Arsitektur Zero Budget · 100% Free Tier Terverifikasi
          </p>
        </div>
      </div>
    </footer>
  );
}

