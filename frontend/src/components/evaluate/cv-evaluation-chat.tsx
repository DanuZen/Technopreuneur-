"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Send,
  CheckCircle2,
  AlertTriangle,
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

export function CvEvaluationChat({ analysis }: CvEvaluationChatProps) {
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
                          Hasil Evaluasi Pasbana AI
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
                            Skor ATS
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
                            const shortLabel = dim.label.split(" ")[0];
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

