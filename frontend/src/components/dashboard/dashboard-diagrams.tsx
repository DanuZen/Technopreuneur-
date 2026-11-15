"use client";

import React from "react";
import { BarChart3, PieChart, Activity, TrendingUp } from "lucide-react";

interface CompanyFunnelDiagramProps {
  totalJobs: number;
  totalApplicants: number;
  reviewedCount: number;
  shortlistedCount: number;
  rejectedCount: number;
}

export function CompanyFunnelDiagram({
  totalJobs,
  totalApplicants,
  reviewedCount,
  shortlistedCount,
  rejectedCount,
}: CompanyFunnelDiagramProps) {
  const safeTotal = Math.max(totalApplicants, 1);
  const stages = [
    { label: "Total Pelamar Masuk", count: totalApplicants, pct: 100, color: "#0f2c56" },
    {
      label: "Ditinjau HRD (Reviewed)",
      count: reviewedCount + shortlistedCount,
      pct: Math.round(((reviewedCount + shortlistedCount) / safeTotal) * 100),
      color: "#1e4b8f",
    },
    {
      label: "Masuk Shortlist",
      count: shortlistedCount,
      pct: Math.round((shortlistedCount / safeTotal) * 100),
      color: "#ce2731",
    },
    {
      label: "Tidak Dilanjutkan",
      count: rejectedCount,
      pct: Math.round((rejectedCount / safeTotal) * 100),
      color: "#94a3b8",
    },
  ];

  // Donut calculation
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const shortlistRatio = shortlistedCount / safeTotal;
  const shortlistDash = shortlistRatio * circumference;

  return (
    <div className="morph-surface bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 text-[#0f2c56]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
            <PieChart className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider">
              Diagram Funnel Seleksi
            </p>
            <p className="text-xs font-medium text-slate-500">
              Konversi {totalJobs} lowongan aktif saat ini
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[11px] font-bold">
          Live
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
        {/* SVG Donut Ring */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#edf2f9"
              strokeWidth="10"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#0f2c56"
              strokeWidth="10"
              strokeDasharray={`${circumference * 0.72} ${circumference}`}
              strokeLinecap="round"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#ce2731"
              strokeWidth="10"
              strokeDasharray={`${shortlistDash} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black leading-none text-[#0f2c56]">
              {Math.round(shortlistRatio * 100)}%
            </span>
            <span className="text-[10px] font-bold text-slate-500 mt-0.5">
              Shortlist
            </span>
          </div>
        </div>

        {/* Horizontal Funnel Bars */}
        <div className="flex-1 w-full space-y-2.5">
          {stages.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-700">{s.label}</span>
                <span className="text-[#0f2c56]">
                  {s.count} ({s.pct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#edf2f9] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(s.pct, 6)}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CompanyTrendDiagram() {
  const weeks = [
    { label: "Mgg 1", total: 12, qualified: 8 },
    { label: "Mgg 2", total: 18, qualified: 13 },
    { label: "Mgg 3", total: 15, qualified: 11 },
    { label: "Mgg 4", total: 24, qualified: 19 },
    { label: "Mgg 5", total: 22, qualified: 17 },
    { label: "Mgg 6", total: 30, qualified: 25 },
  ];

  const maxVal = 32;
  const chartW = 480;
  const chartH = 150;
  const padX = 28;
  const padY = 18;
  const usableW = chartW - padX * 2;
  const usableH = chartH - padY * 2;

  const linePoints = weeks
    .map((w, idx) => {
      const x = padX + (idx * usableW) / (weeks.length - 1);
      const y = padY + usableH - (w.qualified / maxVal) * usableH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="morph-surface bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 text-[#0f2c56]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ce2731] text-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider">
              Tren Pelamar &amp; Lolos ATS (6 Minggu)
            </p>
            <p className="text-xs font-medium text-slate-500">
              Perbandingan total pelamar vs kandidat dengan skor ATS &ge; 75
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0f2c56]" />
            Total Pelamar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ce2731]" />
            Lolos ATS
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartW} ${chartH + 22}`}
          className="w-full h-44 sm:h-48"
          role="img"
          aria-label="Diagram tren pelamar dan kandidat lolos ATS selama 6 minggu"
        >
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padY + usableH * (1 - ratio);
            return (
              <g key={idx}>
                <line
                  x1={padX}
                  y1={y}
                  x2={chartW - padX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#64748b"
                  fontWeight="600"
                >
                  {Math.round(maxVal * ratio)}
                </text>
              </g>
            );
          })}

          {/* Bars for Total Applicants */}
          {weeks.map((w, idx) => {
            const cx = padX + (idx * usableW) / (weeks.length - 1);
            const barW = 24;
            const barH = (w.total / maxVal) * usableH;
            const barY = padY + usableH - barH;
            return (
              <g key={w.label}>
                <rect
                  x={cx - barW / 2}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx="6"
                  fill="#0f2c56"
                />
                <text
                  x={cx}
                  y={chartH + 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#0f2c56"
                  fontWeight="700"
                >
                  {w.label}
                </text>
              </g>
            );
          })}

          {/* Line for ATS Qualified */}
          <polyline
            fill="none"
            stroke="#ce2731"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
          />

          {/* Data dots */}
          {weeks.map((w, idx) => {
            const cx = padX + (idx * usableW) / (weeks.length - 1);
            const cy = padY + usableH - (w.qualified / maxVal) * usableH;
            return (
              <g key={`dot-${w.label}`}>
                <circle cx={cx} cy={cy} r="5" fill="#ce2731" stroke="#ffffff" strokeWidth="2" />
                <rect
                  x={cx - 11}
                  y={cy - 22}
                  width="22"
                  height="14"
                  rx="4"
                  fill="#ce2731"
                />
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#ffffff"
                  fontWeight="800"
                >
                  {w.qualified}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

interface AdminModerationDiagramProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function AdminModerationDiagram({
  pendingCount,
  approvedCount,
  rejectedCount,
}: AdminModerationDiagramProps) {
  const total = Math.max(pendingCount + approvedCount + rejectedCount, 1);
  const bars = [
    { label: "Disetujui (Embedding Aktif)", count: approvedCount, color: "#0f2c56" },
    { label: "Menunggu Review", count: pendingCount, color: "#f59e0b" },
    { label: "Ditolak / Revisi", count: rejectedCount, color: "#ce2731" },
  ];

  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const approvedDash = (approvedCount / total) * circ;

  return (
    <div className="morph-surface bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 text-[#0f2c56]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider">
              Distribusi Moderasi Lowongan
            </p>
            <p className="text-xs font-medium text-slate-500">
              Status antrean verifikasi mitra (FR-50)
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[11px] font-bold">
          {total} Total
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="45" cy="45" r={radius} fill="none" stroke="#edf2f9" strokeWidth="10" />
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#0f2c56"
              strokeWidth="10"
              strokeDasharray={`${approvedDash} ${circ}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black leading-none text-[#0f2c56]">
              {Math.round((approvedCount / total) * 100)}%
            </span>
            <span className="text-[10px] font-bold text-slate-500 mt-0.5">
              Disetujui
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {bars.map((b) => {
            const pct = Math.round((b.count / total) * 100);
            return (
              <div key={b.label} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-700">{b.label}</span>
                  <span className="text-[#0f2c56]">
                    {b.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#edf2f9] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(pct, 6)}%`, backgroundColor: b.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AdminPipelineDiagram() {
  const days = [
    { day: "Sen", cv: 145, match: 98 },
    { day: "Sel", cv: 172, match: 120 },
    { day: "Rab", cv: 164, match: 115 },
    { day: "Kam", cv: 210, match: 158 },
    { day: "Jum", cv: 238, match: 184 },
    { day: "Sab", cv: 190, match: 142 },
    { day: "Min", cv: 129, match: 96 },
  ];

  const maxVal = 250;
  const chartW = 480;
  const chartH = 150;
  const padX = 28;
  const padY = 18;
  const usableW = chartW - padX * 2;
  const usableH = chartH - padY * 2;

  const linePoints = days
    .map((d, idx) => {
      const x = padX + (idx * usableW) / (days.length - 1);
      const y = padY + usableH - (d.match / maxVal) * usableH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="morph-surface bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 text-[#0f2c56]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ce2731] text-white flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider">
              Aktivitas Pipeline AI Mingguan
            </p>
            <p className="text-xs font-medium text-slate-500">
              Volume evaluasi CV &amp; matching dua tahap (Target G1 &lt; 60 dtk)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0f2c56]" />
            Evaluasi CV
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ce2731]" />
            Lamaran Tercipta
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartW} ${chartH + 22}`}
          className="w-full h-44 sm:h-48"
          role="img"
          aria-label="Diagram aktivitas pipeline evaluasi CV dan matching AI mingguan"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padY + usableH * (1 - ratio);
            return (
              <g key={idx}>
                <line
                  x1={padX}
                  y1={y}
                  x2={chartW - padX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#64748b"
                  fontWeight="600"
                >
                  {Math.round(maxVal * ratio)}
                </text>
              </g>
            );
          })}

          {days.map((d, idx) => {
            const cx = padX + (idx * usableW) / (days.length - 1);
            const barW = 22;
            const barH = (d.cv / maxVal) * usableH;
            const barY = padY + usableH - barH;
            return (
              <g key={d.day}>
                <rect
                  x={cx - barW / 2}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx="6"
                  fill="#0f2c56"
                />
                <text
                  x={cx}
                  y={chartH + 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#0f2c56"
                  fontWeight="700"
                >
                  {d.day}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            stroke="#ce2731"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints}
          />

          {days.map((d, idx) => {
            const cx = padX + (idx * usableW) / (days.length - 1);
            const cy = padY + usableH - (d.match / maxVal) * usableH;
            return (
              <g key={`dot-${d.day}`}>
                <circle cx={cx} cy={cy} r="5" fill="#ce2731" stroke="#ffffff" strokeWidth="2" />
                <rect
                  x={cx - 13}
                  y={cy - 22}
                  width="26"
                  height="14"
                  rx="4"
                  fill="#ce2731"
                />
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#ffffff"
                  fontWeight="800"
                >
                  {d.match}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

