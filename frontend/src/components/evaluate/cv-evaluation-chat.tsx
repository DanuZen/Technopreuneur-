"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { CVAnalysisResult } from "@/types";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  type: "text" | "analysis";
  text: string;
  timestamp: string;
}

interface CvEvaluationChatProps {
  analysis: CVAnalysisResult;
  onResetUpload: () => void;
}

const QUICK_QUESTIONS = [
  "Bagaimana cara menaikkan skor terendah saya?",
  "Apakah struktur CV saya sudah ramah ATS?",
  "Skill apa yang sebaiknya saya tonjolkan?",
  "Contoh kalimat pencapaian yang terukur?",
];

function buildContextualAnswer(question: string, analysis: CVAnalysisResult): string {
  const q = question.toLowerCase();
  const dims = [
    { key: "Struktur ATS", score: analysis.dimensions.structure },
    { key: "Kejelasan Bahasa", score: analysis.dimensions.clarity },
    { key: "Dampak Terukur", score: analysis.dimensions.measurableImpact },
    { key: "Relevansi Skill", score: analysis.dimensions.skillRelevance },
    { key: "Kelengkapan Profil", score: analysis.dimensions.completeness },
  ];
  const lowestDim = [...dims].sort((a, b) => a.score - b.score)[0];
  const techSkills = analysis.profile.skills?.technical?.join(", ") || "skill teknis utama Anda";
  const topRec = analysis.recommendations?.[0] || "Tambahkan metrik angka pada setiap pengalaman kerja.";

  if (q.includes("skor") || q.includes("naik") || q.includes("rendah") || q.includes("tingkat")) {
    return `Dimensi dengan skor paling berpotensi ditingkatkan saat ini adalah **${lowestDim.key}** (${lowestDim.score}/100). Saran prioritas untuk CV ${analysis.profile.fullName}: ${topRec} Dengan memperbaiki bagian ini, skor total (${analysis.overallScore}/100) dapat naik mendekati 95+.`;
  }

  if (q.includes("ats") || q.includes("struktur") || q.includes("format")) {
    return `Skor **Struktur ATS** Anda saat ini adalah **${analysis.dimensions.structure}/100**. ${
      analysis.dimensions.structure >= 85
        ? "Format dokumen sudah terbaca rapi oleh sistem parser ATS. Pastikan tetap menggunakan layout 1-kolom tanpa tabel kompleks atau grafik."
        : "Disarankan menyederhanakan tata letak menjadi 1-kolom standar tanpa kotak teks atau kolom ganda agar parser ATS membaca semua informasi secara akurat."
    }`;
  }

  if (q.includes("skill") || q.includes("keahlian") || q.includes("tonjol")) {
    return `Berdasarkan profil CV Anda (${analysis.profile.headline || "Kandidat"}), keahlian teknis yang sudah terdeteksi meliputi: **${techSkills}** (skor Relevansi Skill: ${analysis.dimensions.skillRelevance}/100). Letakkan skill yang paling relevan dengan lowongan target di bagian atas agar langsung terbaca perekrut dan ATS.`;
  }

  if (q.includes("terukur") || q.includes("kalimat") || q.includes("contoh") || q.includes("dampak")) {
    return `Untuk meningkatkan **Dampak Terukur** (saat ini ${analysis.dimensions.measurableImpact}/100), gunakan pola **Kata Kerja Aksi + Tugas + Hasil Angka**. Contoh: "Mengoptimalkan komponen antarmuka Next.js sehingga mempercepat waktu muat halaman hingga 35% dan menurunkan bounce rate 18%."`;
  }

  if (q.includes("kekuatan") || q.includes("kelebihan") || q.includes("bagus")) {
    const strengthsText = analysis.strengths.slice(0, 2).join(" ");
    return `Kekuatan utama pada CV Anda saat ini: ${strengthsText}`;
  }

  return `Berdasarkan hasil evaluasi CV **${analysis.profile.fullName}** (skor ${analysis.overallScore}/100), fokus utama yang paling berdampak untuk ditingkatkan adalah **${lowestDim.key}** (${lowestDim.score}/100). Rekomendasi utama: ${topRec}`;
}

export function CvEvaluationChat({ analysis, onResetUpload }: CvEvaluationChatProps) {
  const cvDisplayName = analysis.fileName
    ? analysis.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim()
    : analysis.profile.fullName;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-user-upload",
      sender: "user",
      type: "text",
      text: `Tolong analisis CV saya: ${cvDisplayName}`,
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
        text: `Tolong analisis CV saya: ${cvDisplayName}`,
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
  }, [analysis.cvId, cvDisplayName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
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

    setTimeout(() => {
      const replyText = buildContextualAnswer(trimmed, analysis);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        type: "text",
        text: replyText,
        timestamp: "Sekarang",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 350);
  };

  const dimensionList = [
    { label: "Struktur ATS", score: analysis.dimensions.structure },
    { label: "Kejelasan Bahasa", score: analysis.dimensions.clarity },
    { label: "Dampak Terukur", score: analysis.dimensions.measurableImpact },
    { label: "Relevansi Skill", score: analysis.dimensions.skillRelevance },
    { label: "Kelengkapan Profil", score: analysis.dimensions.completeness },
  ];

  const isHighReady = analysis.overallScore >= 85;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3">
      {/* Top Action Bar for Current Evaluated CV */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2c56] text-white text-xs font-bold truncate max-w-[260px] sm:max-w-md">
            <Sparkles className="w-3.5 h-3.5 text-[#ce2731] shrink-0" />
            <span className="truncate">{cvDisplayName}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#ce2731] text-white text-xs font-mono font-bold shrink-0">
            Skor {analysis.overallScore}/100
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/user/dashboard/dokumen"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0f2c56] border border-slate-200 text-xs font-bold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lihat Dokumen CV ATS</span>
          </Link>
          <button
            type="button"
            onClick={onResetUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Evaluasi CV Baru</span>
          </button>
        </div>
      </div>

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
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ce2731] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 max-w-4xl space-y-4">
                  {/* Summary Hero Bubble */}
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                          Hasil Evaluasi Pasbana AI
                        </p>
                        <h2 className="text-base sm:text-lg font-extrabold text-[#0f2c56]">
                          {analysis.profile.fullName}
                        </h2>
                        <p className="text-xs text-slate-500">
                          {analysis.profile.headline || "Kandidat Profesional Muda"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-[#edf2f9] px-4 py-2.5 rounded-2xl">
                        <div className="text-2xl font-black text-[#0f2c56] font-mono">
                          {analysis.overallScore}
                          <span className="text-xs text-slate-500 font-bold">/100</span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${
                            isHighReady ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                          }`}
                        >
                          {isHighReady ? "Sangat Kompetitif" : "Perlu Optimasi"}
                        </span>
                      </div>
                    </div>

                    {/* 5 Dimensions Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {dimensionList.map((dim) => {
                        const optimal = dim.score >= 85;
                        return (
                          <div
                            key={dim.label}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[11px] font-bold text-[#0f2c56] truncate">
                                {dim.label}
                              </span>
                              <span
                                className={`text-[11px] font-mono font-black ${
                                  optimal ? "text-[#0f2c56]" : "text-[#ce2731]"
                                }`}
                              >
                                {dim.score}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
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

                    {/* Strengths & Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-xl border border-[#0f2c56]/20 bg-[#edf2f9]/40 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#0f2c56]">
                          <CheckCircle2 className="w-4 h-4 text-[#0f2c56]" />
                          <span>Kekuatan Utama</span>
                        </div>
                        <ul className="space-y-1.5">
                          {analysis.strengths.map((s, i) => (
                            <li key={i} className="text-xs text-slate-700 leading-relaxed flex gap-2">
                              <span className="font-bold text-[#0f2c56]">{i + 1}.</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl border border-[#ce2731]/25 bg-rose-50/40 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#ce2731]">
                          <AlertTriangle className="w-4 h-4 text-[#ce2731]" />
                          <span>Rekomendasi Perbaikan</span>
                        </div>
                        <ul className="space-y-1.5">
                          {analysis.recommendations.map((r, i) => (
                            <li key={i} className="text-xs text-slate-700 leading-relaxed flex gap-2">
                              <span className="font-bold text-[#ce2731]">{i + 1}.</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

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
              <div className="w-8 h-8 rounded-full bg-[#ce2731] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-2xl rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ce2731] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3 text-xs text-slate-500 font-medium">
              Pasbana AI sedang menyusun jawaban...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Bottom Fixed Chat Input + Quick Suggestions */}
      <div className="shrink-0 bg-[#fefefd] pt-3 pb-1 border-t border-slate-200/70 space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-[#edf2f9] hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
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
            className="flex-1 bg-transparent text-xs sm:text-sm text-[#0f2c56] placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
}

