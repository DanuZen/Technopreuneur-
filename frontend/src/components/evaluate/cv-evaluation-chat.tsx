"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
  FileText,
  Edit3,
  ShieldCheck,
} from "lucide-react";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  type: "text" | "analysis";
  text: string;
  timestamp: string;
}

interface CvEvaluationChatProps {
  analysis: CVAnalysisResult;
}

const UPLOAD_QUICK_QUESTIONS = [
  "Bagaimana cara menaikkan skor terendah saya?",
  "Apakah struktur CV saya sudah ramah ATS?",
  "Skill apa yang sebaiknya saya tonjolkan?",
  "Contoh kalimat pencapaian yang terukur?",
];

const ONBOARDING_QUICK_QUESTIONS = [
  "Skill apa lagi yang wajib ditambahkan untuk posisi target saya?",
  "Bantu buatkan 3 poin pengalaman proyek untuk posisi ini",
  "Bagaimana cara menaikkan skor substansi terendah saya?",
  "Bagaimana cara memperkuat kredibilitas & portofolio fresh graduate?",
];

function isOnboardingAnalysis(analysis: CVAnalysisResult): boolean {
  return (
    analysis.source === "onboarding" ||
    analysis.cvId.startsWith("cv-gen-") ||
    (!analysis.fileName && analysis.cvId.includes("gen"))
  );
}

function getDimensionList(analysis: CVAnalysisResult, isOnboarding: boolean) {
  if (isOnboarding) {
    return [
      {
        label: "Kesesuaian Target Posisi",
        shortLabel: "Target",
        score: analysis.dimensions.structure,
      },
      {
        label: "Kedalaman Narasi Pengalaman",
        shortLabel: "Narasi",
        score: analysis.dimensions.clarity,
      },
      {
        label: "Bukti Dampak & Angka",
        shortLabel: "Dampak",
        score: analysis.dimensions.measurableImpact,
      },
      {
        label: "Kekuatan Kata Kerja Aksi",
        shortLabel: "Kata Aksi",
        score: analysis.dimensions.skillRelevance,
      },
      {
        label: "Kredibilitas & Portofolio",
        shortLabel: "Portofolio",
        score: analysis.dimensions.completeness,
      },
    ];
  }
  return [
    {
      label: "Struktur & Format ATS",
      shortLabel: "Struktur",
      score: analysis.dimensions.structure,
    },
    {
      label: "Kejelasan Bahasa",
      shortLabel: "Kejelasan",
      score: analysis.dimensions.clarity,
    },
    {
      label: "Dampak Terukur",
      shortLabel: "Dampak",
      score: analysis.dimensions.measurableImpact,
    },
    {
      label: "Relevansi Skill",
      shortLabel: "Relevansi",
      score: analysis.dimensions.skillRelevance,
    },
    {
      label: "Kelengkapan Profil",
      shortLabel: "Kelengkapan",
      score: analysis.dimensions.completeness,
    },
  ];
}

function buildContextualAnswer(question: string, analysis: CVAnalysisResult): string {
  const q = question.toLowerCase();
  const isOnboarding = isOnboardingAnalysis(analysis);
  const dims = getDimensionList(analysis, isOnboarding).map((d) => ({
    key: d.label,
    score: d.score,
  }));
  const lowestDim = [...dims].sort((a, b) => a.score - b.score)[0];
  const targetRole = analysis.profile.headline || "Posisi Target Anda";
  const techSkills = analysis.profile.skills?.technical?.join(", ") || "skill teknis utama Anda";
  const topRec =
    analysis.recommendations?.[0] ||
    "Tambahkan metrik angka pada setiap pengalaman kerja atau proyek.";

  if (q.includes("poin pengalaman") || q.includes("3 poin") || q.includes("proyek")) {
    return `Berikut 3 contoh poin pengalaman proyek berpola Kata Kerja Aksi + Teknologi + Dampak Angka untuk posisi ${targetRole}: 1) Mengembangkan aplikasi web modular menggunakan ${techSkills} yang mempercepat waktu muat halaman hingga 35%. 2) Merancang dan mengintegrasikan antarmuka responsif bersama tim beranggotakan 4 orang untuk 150+ pengguna uji coba. 3) Mengoptimalkan struktur kode dan alur pengujian sehingga menurunkan temuan bug fungsional sebesar 25%.`;
  }

  if (q.includes("kredibilitas") || q.includes("portofolio") || q.includes("fresh graduate")) {
    return `Skor Kredibilitas & Portofolio Anda saat ini adalah ${analysis.dimensions.completeness}/100. Untuk memperkuat profil fresh graduate pada posisi ${targetRole}: 1) Cantumkan tautan GitHub, LinkedIn, atau demo proyek aktif. 2) Lengkapi minimal 4 sampai 5 keahlian teknis inti dan 2 sampai 3 Soft Skills pendukung. 3) Pastikan nomor telepon/WhatsApp dan email profesional tertulis lengkap di header CV.`;
  }

  if (q.includes("skor") || q.includes("naik") || q.includes("rendah") || q.includes("tingkat")) {
    return `Dimensi dengan skor paling berpotensi ditingkatkan saat ini adalah ${lowestDim.key} (${lowestDim.score}/100). Saran prioritas untuk CV ${analysis.profile.fullName}: ${topRec} Dengan melengkapi bagian ini melalui tombol Edit Isi Data CV, skor total (${analysis.overallScore}/100) dapat meningkat signifikan.`;
  }

  if (q.includes("ats") || q.includes("struktur") || q.includes("format")) {
    if (isOnboarding) {
      return `Karena CV Anda dibuat melalui Kuesioner Onboarding Pasbana, tata letak dokumen sudah 100% menggunakan format 1-kolom standar ATS. Fokus penilaian pada jalur ini adalah Kesesuaian Target Posisi (${analysis.dimensions.structure}/100) dan Kedalaman Narasi Pengalaman (${analysis.dimensions.clarity}/100).`;
    }
    return `Skor Struktur & Format ATS Anda saat ini adalah ${analysis.dimensions.structure}/100. ${
      analysis.dimensions.structure >= 85
        ? "Format dokumen sudah terbaca rapi oleh sistem parser ATS. Pastikan tetap menggunakan layout 1-kolom tanpa tabel kompleks atau grafik."
        : "Disarankan menyederhanakan tata letak menjadi 1-kolom standar tanpa kotak teks atau kolom ganda agar parser ATS membaca semua informasi secara akurat."
    }`;
  }

  if (q.includes("skill") || q.includes("keahlian") || q.includes("tonjol") || q.includes("wajib")) {
    return `Untuk target posisi ${targetRole}, keahlian teknis yang sudah tercatat di profil Anda adalah: ${techSkills}. ${topRec}`;
  }

  if (q.includes("terukur") || q.includes("kalimat") || q.includes("contoh") || q.includes("dampak")) {
    return `Untuk meningkatkan Bukti Dampak & Angka (saat ini ${analysis.dimensions.measurableImpact}/100), gunakan pola Kata Kerja Aksi + Tugas + Hasil Angka. Contoh: "Mengoptimalkan komponen antarmuka Next.js sehingga mempercepat waktu muat halaman hingga 35% dan menurunkan bounce rate 18%."`;
  }

  if (q.includes("kekuatan") || q.includes("kelebihan") || q.includes("bagus")) {
    const strengthsText = analysis.strengths.slice(0, 2).join(" ");
    return `Kekuatan utama pada CV Anda saat ini: ${strengthsText}`;
  }

  return `Berdasarkan hasil evaluasi CV ${analysis.profile.fullName} (skor ${analysis.overallScore}/100), fokus utama yang paling berdampak untuk ditingkatkan adalah ${lowestDim.key} (${lowestDim.score}/100). Rekomendasi utama: ${topRec}`;
}

export function CvEvaluationChat({ analysis }: CvEvaluationChatProps) {
  const isOnboarding = isOnboardingAnalysis(analysis);
  const cvDisplayName = analysis.fileName
    ? analysis.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim()
    : analysis.profile.fullName;

  const initialUserText = isOnboarding
    ? `Tolong evaluasi kesiapan isi CV baru saya untuk posisi ${
        analysis.profile.headline || "Target Karir"
      } (${analysis.profile.fullName})`
    : `Tolong analisis dokumen CV saya: ${cvDisplayName}`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-user-upload",
      sender: "user",
      type: "text",
      text: initialUserText,
      timestamp: "Baru saja",
    },
    {
      id: "msg-ai-analysis",
      sender: "assistant",
      type: "analysis",
      text: "Berikut hasil evaluasi 5 dimensi untuk CV Anda:",
      timestamp: "Baru saja",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: `msg-user-${analysis.cvId}`,
        sender: "user",
        type: "text",
        text: initialUserText,
        timestamp: "Baru saja",
      },
      {
        id: `msg-ai-${analysis.cvId}`,
        sender: "assistant",
        type: "analysis",
        text: "Berikut hasil evaluasi 5 dimensi untuk CV Anda:",
        timestamp: "Baru saja",
      },
    ]);
  }, [analysis.cvId, initialUserText]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      type: "text",
      text: trimmed,
      timestamp: "Sekarang",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    let replyText = "";
    try {
      const res = await api.chatCV({
        cvId: analysis.cvId,
        question: trimmed,
        overallScore: analysis.overallScore,
        dimensions: analysis.dimensions,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
      });
      replyText = res.answer || buildContextualAnswer(trimmed, analysis);
    } catch {
      replyText = buildContextualAnswer(trimmed, analysis);
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: "assistant",
      type: "text",
      text: replyText.replace(/\*\*/g, ""),
      timestamp: "Sekarang",
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const dimensionList = getDimensionList(analysis, isOnboarding);
  const quickQuestions = isOnboarding
    ? ONBOARDING_QUICK_QUESTIONS
    : UPLOAD_QUICK_QUESTIONS;

  const isHighReady = analysis.overallScore >= 85;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3">

      {/* Chat Messages Thread (Only this section scrolls) */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none space-y-5 py-2 pr-1">
        {messages.map((msg) => {
          if (msg.sender === "user") {
            return (
              <div key={msg.id} className="flex justify-end items-start gap-2.5">
                <div className="max-w-xl rounded-2xl rounded-tr-sm bg-[#0f2c56] text-white px-4 py-3 text-xs sm:text-sm font-medium leading-relaxed">
                  {msg.text}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 text-[#0f2c56] flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            );
          }

          if (msg.type === "analysis") {
            const cx = 160;
            const cy = 132;
            const maxR = 68;
            const labelR = 94;
            const ringLevels = [0.25, 0.5, 0.75, 1];
            const getPoint = (index: number, ratio: number) => {
              const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
              return {
                x: cx + maxR * ratio * Math.cos(angle),
                y: cy + maxR * ratio * Math.sin(angle),
              };
            };
            const scorePolygonPoints = dimensionList
              .map((dim, idx) => {
                const pt = getPoint(idx, Math.max(0.1, Math.min(1, dim.score / 100)));
                return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
              })
              .join(" ");

            const ringCircumference = 2 * Math.PI * 26;
            const ringOffset =
              ringCircumference - (Math.min(100, Math.max(0, analysis.overallScore)) / 100) * ringCircumference;

            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                  <Image
                    src="/logo-navy.webp"
                    alt="Pasbana AI"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 max-w-4xl space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 sm:p-5 space-y-4">
                    {/* Solid Navy Hero Summary */}
                    <div className="bg-[#0f2c56] text-white rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ce2731] text-white text-[10px] font-bold uppercase tracking-wider">
                          {isOnboarding
                            ? "Evaluasi Kesiapan Konten CV Baru"
                            : "Hasil Audit Dokumen CV ATS"}
                        </span>
                        <h2 className="text-lg sm:text-xl font-extrabold text-white pt-1">
                          {analysis.profile.fullName}
                        </h2>
                        <p className="text-xs text-white/75">
                          {analysis.profile.headline || "Kandidat Profesional Muda"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3.5 bg-white text-[#0f2c56] px-4 py-2.5 rounded-2xl shrink-0">
                        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 64 64" className="w-14 h-14 -rotate-90" aria-hidden="true">
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              fill="none"
                              stroke="#E2E8F0"
                              strokeWidth="6"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              fill="none"
                              stroke={isHighReady ? "#0F2C56" : "#CE2731"}
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={ringCircumference}
                              strokeDashoffset={ringOffset}
                            />
                          </svg>
                          <span className="absolute text-sm font-black font-mono text-[#0f2c56]">
                            {analysis.overallScore}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                            {isOnboarding ? "Skor Substansi" : "Skor ATS"}
                          </p>
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${
                              isHighReady ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                            }`}
                          >
                            {isHighReady ? "Sangat Kompetitif" : "Perlu Optimasi"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isOnboarding && (
                      <div className="px-4 py-3 rounded-xl bg-[#edf2f9] border border-slate-200 flex items-start gap-2.5 text-[#0f2c56]">
                        <ShieldCheck className="w-4 h-4 text-[#0f2c56] shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold leading-relaxed">
                          <strong>Format 1-Kolom Standar ATS telah otomatis diterapkan oleh Pasbana.</strong>{" "}
                          Penilaian 5 dimensi di bawah ini berfokus mengaudit kekuatan substansi profil dan pengalaman Anda terhadap target posisi{" "}
                          <strong>{analysis.profile.headline || "pilihan Anda"}</strong>.
                        </p>
                      </div>
                    )}

                    {/* Diagram Radar 5 Dimensi + Rincian Skor Solid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                      {/* Pentagon Radar Diagram */}
                      <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between">
                        <div className="w-full flex items-center justify-between">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                            Diagram 5 Dimensi
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            Target &ge; 85
                          </span>
                        </div>
                        <svg
                          viewBox="0 0 320 264"
                          className="w-full max-w-[280px] h-auto"
                          role="img"
                          aria-label="Diagram radar 5 dimensi skor CV ATS"
                        >
                          {ringLevels.map((lvl) => {
                            const pts = [0, 1, 2, 3, 4]
                              .map((idx) => {
                                const pt = getPoint(idx, lvl);
                                return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                              })
                              .join(" ");
                            return (
                              <polygon
                                key={lvl}
                                points={pts}
                                fill="none"
                                stroke="#CBD5E1"
                                strokeWidth="1"
                              />
                            );
                          })}

                          {[0, 1, 2, 3, 4].map((idx) => {
                            const edge = getPoint(idx, 1);
                            return (
                              <line
                                key={idx}
                                x1={cx}
                                y1={cy}
                                x2={edge.x}
                                y2={edge.y}
                                stroke="#CBD5E1"
                                strokeWidth="1"
                              />
                            );
                          })}

                          <polygon
                            points={scorePolygonPoints}
                            fill="#0F2C56"
                            fillOpacity="0.2"
                            stroke="#0F2C56"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                          />

                          {dimensionList.map((dim, idx) => {
                            const pt = getPoint(idx, Math.max(0.1, Math.min(1, dim.score / 100)));
                            const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 5;
                            const lx = cx + labelR * Math.cos(angle);
                            const ly = cy + labelR * Math.sin(angle);
                            const optimal = dim.score >= 85;
                            const anchor =
                              idx === 0 ? "middle" : idx === 1 || idx === 2 ? "start" : "end";
                            const shortLabel = dim.shortLabel;
                            return (
                              <g key={dim.label}>
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="4.5"
                                  fill={optimal ? "#0F2C56" : "#CE2731"}
                                  stroke="#FFFFFF"
                                  strokeWidth="1.5"
                                />
                                <text
                                  x={lx}
                                  y={ly - 3}
                                  textAnchor={anchor}
                                  className="fill-[#0F2C56] text-[10px] font-bold"
                                >
                                  {shortLabel}
                                </text>
                                <text
                                  x={lx}
                                  y={ly + 10}
                                  textAnchor={anchor}
                                  className={`text-[10px] font-mono font-black ${
                                    optimal ? "fill-[#0F2C56]" : "fill-[#CE2731]"
                                  }`}
                                >
                                  {dim.score}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* 5 Dimension Solid Progress Rows */}
                      <div className="lg:col-span-7 flex flex-col justify-between gap-2.5">
                        {dimensionList.map((dim) => {
                          const optimal = dim.score >= 85;
                          return (
                            <div
                              key={dim.label}
                              className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-extrabold text-[#0f2c56]">
                                  {dim.label}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-black text-white ${
                                    optimal ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                                  }`}
                                >
                                  {dim.score}/100
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    optimal ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                                  }`}
                                  style={{ width: `${dim.score}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Solid Navy & Crimson Cards: Strengths & Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#0f2c56] text-white space-y-3">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Kekuatan Utama</span>
                        </div>
                        <ul className="space-y-2">
                          {analysis.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-white/90 leading-relaxed flex gap-2.5">
                              <span className="w-5 h-5 rounded-md bg-white text-[#0f2c56] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-[#ce2731] text-white space-y-3">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                          <AlertTriangle className="w-4 h-4 text-white" />
                          <span>Rekomendasi Perbaikan</span>
                        </div>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((r, i) => (
                            <li key={i} className="text-xs text-white/95 leading-relaxed flex gap-2.5">
                              <span className="w-5 h-5 rounded-md bg-white text-[#ce2731] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {isOnboarding && (
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80">
                        <p className="text-xs text-slate-600 font-medium">
                          Draf dokumen CV ATS 1-kolom Anda sudah tersimpan dan siap dilengkapi atau diunduh:
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href="/user/dashboard/dokumen"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs font-bold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Lihat &amp; Unduh Draf CV ATS Saya</span>
                          </Link>
                          <Link
                            href="/user/dashboard/dokumen?edit=true"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs font-bold transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Lengkapi Isi Data CV</span>
                          </Link>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 pt-1">
                      Ada bagian dari hasil evaluasi ini yang ingin Anda diskusikan atau perbaiki? Silakan ajukan pertanyaan di bawah.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                <Image
                  src="/logo-navy.webp"
                  alt="Pasbana AI"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <div className="max-w-2xl rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src="/logo-navy.webp"
                alt="Pasbana AI"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 text-xs text-slate-500 font-medium">
              Pasbana AI sedang menyusun jawaban...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Bottom Fixed Chat Input + Quick Suggestions */}
      <div className="shrink-0 bg-[#fefefd] pt-2.5 sm:pt-3 pb-1 border-t border-slate-200/70 space-y-2">
        <div className="flex overflow-x-auto scrollbar-none sm:flex-wrap gap-1.5 pb-0.5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSend(q)}
              className="shrink-0 min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#edf2f9] hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 pl-4 focus-within:border-[#0f2c56] transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan cara memperbaiki skor ATS, kata kunci skill, atau kalimat CV..."
            className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-[#0f2c56] placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="inline-flex items-center justify-center gap-1.5 min-h-[42px] min-w-[44px] px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
}

