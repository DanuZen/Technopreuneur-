import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Header & Hero */}
      <header className="text-center space-y-4 max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          CareerMatch AI Platform
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
          Ukur Kualitas CV Anda. Temukan Karir yang Benar-Benar Cocok.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          AI kami membaca CV Anda secara objektif, menyusun profil kompetensi terstruktur, dan merekomendasikan lowongan kerja yang relevan lengkap dengan alasan dan analisis kebutuhan skill.
        </p>
      </header>

      {/* Main Action Section: Upload Dropzone */}
      <section className="max-w-2xl mx-auto mb-16">
        <div className="p-8 sm:p-10 border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center cursor-pointer shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            Tarik file CV Anda ke sini atau klik untuk memilih
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Mendukung format PDF atau DOCX (Maksimal 5 MB)
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Pastikan CV berbasis teks digital, bukan hasil foto/scan dokumen.
          </div>
        </div>
      </section>

      {/* Preview Section: Visualisasi Fitur MVP */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg mb-2">Skor Kualitas CV</h3>
          <p className="text-sm text-slate-600">
            Dapatkan evaluasi 5 dimensi: struktur, kejelasan, pencapaian terukur, relevansi skill, dan kelengkapan.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg mb-2">Profil Terstruktur</h3>
          <p className="text-sm text-slate-600">
            Hasil ekstraksi otomatis dapat Anda koreksi langsung sebelum profil dikunci untuk pencarian lowongan.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <ArrowRight className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800 text-lg mb-2">Rekomendasi Presisi</h3>
          <p className="text-sm text-slate-600">
            Pencocokan 2-tahap (vektor + LLM) menyajikan persentase kecocokan beserta daftar gap skill yang perlu Anda pelajari.
          </p>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="border-t border-slate-200 pt-8 text-center text-xs text-slate-500 space-y-2">
        <p>CareerMatch AI — Proyek Technopreneurship 2026</p>
        <p className="font-medium text-slate-600">
          Tim Pengembang: Wira Fikri Ramadanu (23343023) · Muhammad Gilang Ramadhan (23346013) · Florensius Panca Gati (23343006)
        </p>
      </footer>
    </main>
  );
}

