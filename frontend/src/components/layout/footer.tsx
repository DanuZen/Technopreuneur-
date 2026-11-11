import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <span className="font-bold text-slate-900 tracking-tight text-lg">
              CareerMatch<span className="text-blue-600"> AI</span>
            </span>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Platform bimbingan karir dan pencocokan lowongan kerja cerdas berbasis AI dua tahap. Membantu fresh graduate mengukur kualitas CV atau membuat CV baru secara otomatis.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kepatuhan Privasi UU PDP No. 27/2022
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 font-mono">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-blue-600 transition">
                  Pencarian Lowongan
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-600 transition">
                  Daftar Sebagai Pelamar
                </Link>
              </li>
              <li>
                <Link href="/register?role=employer" className="hover:text-blue-600 transition">
                  Pasang Lowongan (HR)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3 font-mono">
              Tim Pengembang
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-mono">
              <li>
                <span className="font-semibold text-slate-800">Wira Fikri Ramadanu</span>
                <span className="block text-slate-500">23343023 · Frontend Lead</span>
              </li>
              <li className="pt-1">
                <span className="font-semibold text-slate-800">M. Gilang Ramadhan</span>
                <span className="block text-slate-500">23346013 · Backend Lead</span>
              </li>
              <li className="pt-1">
                <span className="font-semibold text-slate-800">Florensius Panca Gati</span>
                <span className="block text-slate-500">23343006 · Backend AI Lead</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} CareerMatch AI. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="flex items-center gap-1">
            Dibangun dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Proyek Technopreneurship 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
