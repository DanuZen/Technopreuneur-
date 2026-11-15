"use client";

import React, { useState } from "react";
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
    <div className="morph-surface h-full flex flex-col gap-4 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-[#0f2c56]">
      <div className="flex items-center justify-between gap-3 shrink-0">
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

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 py-1">
        {/* SVG Donut Ring */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#edf2f9"
              strokeWidth="11"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#0f2c56"
              strokeWidth="11"
              strokeDasharray={`${circumference * 0.72} ${circumference}`}
              strokeLinecap="round"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#ce2731"
              strokeWidth="11"
              strokeDasharray={`${shortlistDash} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black leading-none text-[#0f2c56]">
              {Math.round(shortlistRatio * 100)}%
            </span>
            <span className="text-[11px] font-bold text-slate-500 mt-1">
              Shortlist
            </span>
          </div>
        </div>

        {/* Horizontal Funnel Bars */}
        <div className="flex-1 w-full space-y-3">
          {stages.map((s) => (
            <div key={s.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{s.label}</span>
                <span className="text-[#0f2c56]">
                  {s.count} ({s.pct}%)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-[#edf2f9] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(s.pct, 6)}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ringkasan Metrik Bawah */}
      <div className="shrink-0 grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Rata-rata ATS</p>
          <p className="text-sm font-black text-[#0f2c56]">85.3 / 100</p>
        </div>
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Tingkat Review</p>
          <p className="text-sm font-black text-[#0f2c56]">
            {Math.round(((reviewedCount + shortlistedCount) / safeTotal) * 100)}%
          </p>
        </div>
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Waktu Screening</p>
          <p className="text-sm font-black text-[#ce2731]">&lt; 30 Detik</p>
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
    <div className="morph-surface h-full flex flex-col gap-3 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-[#0f2c56]">
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

      <div className="flex-1 min-h-0 w-full flex items-center overflow-hidden">
        <svg
          viewBox={`0 0 ${chartW} ${chartH + 22}`}
          className="w-full h-full min-h-[160px] max-h-52"
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
    { label: "Mitra Terverifikasi", count: approvedCount, color: "#0f2c56" },
    { label: "Pengajuan Mitra Baru", count: pendingCount, color: "#f59e0b" },
    { label: "Perlu Kelengkapan", count: rejectedCount, color: "#ce2731" },
  ];

  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const approvedDash = (approvedCount / total) * circ;

  return (
    <div className="morph-surface h-full flex flex-col gap-3 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-[#0f2c56]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider">
              Komposisi Kemitraan Company
            </p>
            <p className="text-xs font-medium text-slate-500">
              Monitoring kesiapan calon mitra (FR-50)
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[11px] font-bold">
          {total} Dipantau
        </span>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 py-1">
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="45" cy="45" r={radius} fill="none" stroke="#edf2f9" strokeWidth="11" />
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#0f2c56"
              strokeWidth="11"
              strokeDasharray={`${approvedDash} ${circ}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black leading-none text-[#0f2c56]">
              {Math.round((approvedCount / total) * 100)}%
            </span>
            <span className="text-[11px] font-bold text-slate-500 mt-1">
              Terverifikasi
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {bars.map((b) => {
            const pct = Math.round((b.count / total) * 100);
            return (
              <div key={b.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{b.label}</span>
                  <span className="text-[#0f2c56]">
                    {b.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#edf2f9] overflow-hidden">
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

      <div className="shrink-0 grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Total Jobseeker</p>
          <p className="text-sm font-black text-[#0f2c56]">1.248 Akun</p>
        </div>
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Company Mitra</p>
          <p className="text-sm font-black text-[#0f2c56]">24 Perusahaan</p>
        </div>
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Standar Min. ATS</p>
          <p className="text-sm font-black text-[#ce2731]">Skor 75 / 100</p>
        </div>
      </div>
    </div>
  );
}

export function AdminPipelineDiagram() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(4);

  const days = [
    { day: "Sen", fullDay: "Senin", cv: 145, pass: 102 },
    { day: "Sel", fullDay: "Selasa", cv: 172, pass: 124 },
    { day: "Rab", fullDay: "Rabu", cv: 164, pass: 118 },
    { day: "Kam", fullDay: "Kamis", cv: 210, pass: 158 },
    { day: "Jum", fullDay: "Jumat", cv: 238, pass: 184 },
    { day: "Sab", fullDay: "Sabtu", cv: 190, pass: 142 },
    { day: "Min", fullDay: "Minggu", cv: 129, pass: 85 },
  ];

  const totalCv = days.reduce((acc, d) => acc + d.cv, 0);
  const totalPass = days.reduce((acc, d) => acc + d.pass, 0);
  const passRate = Math.round((totalPass / totalCv) * 100);
  const activeDay = days[hoveredIdx] || days[4];

  const maxVal = 260;
  const chartW = 680;
  const chartH = 196;
  const padLeft = 40;
  const padRight = 18;
  const padTop = 24;
  const padBottom = 26;
  const usableW = chartW - padLeft - padRight;
  const usableH = chartH - padTop - padBottom;
  const slotW = usableW / days.length;

  return (
    <div className="morph-surface h-full flex flex-col justify-between gap-3 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-[#0f2c56]">
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
              Volume evaluasi CV &amp; pemenuhan standar ATS (Target G1 &lt; 60 dtk)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0f2c56]" />
            Evaluasi CV
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ce2731]" />
            Lolos Standar ATS
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56]">
            {activeDay.fullDay}: {activeDay.cv} CV / {activeDay.pass} Lolos
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full flex items-center">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full h-auto"
          role="img"
          aria-label="Diagram aktivitas pipeline evaluasi CV dan pemenuhan standar ATS mingguan"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padTop + usableH * (1 - ratio);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={chartW - padRight}
                  y2={y}
                  stroke={idx === 0 ? "#cbd5e1" : "#e2e8f0"}
                  strokeDasharray={idx === 0 ? undefined : "4 4"}
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748b"
                  fontWeight="600"
                >
                  {Math.round(maxVal * ratio)}
                </text>
              </g>
            );
          })}

          {days.map((d, idx) => {
            const slotX = padLeft + idx * slotW;
            const centerX = slotX + slotW / 2;
            const barW = 20;
            const gap = 5;
            const cvH = (d.cv / maxVal) * usableH;
            const passH = (d.pass / maxVal) * usableH;
            const cvY = padTop + usableH - cvH;
            const passY = padTop + usableH - passH;
            const isActive = idx === hoveredIdx;

            return (
              <g
                key={d.day}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setHoveredIdx(idx)}
                className="cursor-pointer"
              >
                <rect
                  x={slotX + 8}
                  y={padTop - 4}
                  width={slotW - 16}
                  height={usableH + 4}
                  rx="10"
                  fill={isActive ? "#edf2f9" : "transparent"}
                />

                {/* Bar Evaluasi CV */}
                <rect
                  x={centerX - barW - gap / 2}
                  y={cvY}
                  width={barW}
                  height={cvH}
                  rx="6"
                  fill="#0f2c56"
                />
                <text
                  x={centerX - barW / 2 - gap / 2}
                  y={cvY - 6}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#0f2c56"
                  fontWeight="800"
                >
                  {d.cv}
                </text>

                {/* Bar Lolos Standar ATS */}
                <rect
                  x={centerX + gap / 2}
                  y={passY}
                  width={barW}
                  height={passH}
                  rx="6"
                  fill="#ce2731"
                />
                <text
                  x={centerX + barW / 2 + gap / 2}
                  y={passY - 6}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#ce2731"
                  fontWeight="800"
                >
                  {d.pass}
                </text>

                <text
                  x={centerX}
                  y={chartH - 7}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isActive ? "#ce2731" : "#0f2c56"}
                  fontWeight="800"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="shrink-0 grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Total Evaluasi</p>
          <p className="text-sm font-black text-[#0f2c56]">{totalCv.toLocaleString("id-ID")} CV</p>
        </div>
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Lolos Standar ATS</p>
          <p className="text-sm font-black text-[#ce2731]">{passRate}% ({totalPass})</p>
        </div>
        <div className="rounded-xl bg-[#f4f7fb] px-3 py-2">
          <p className="text-[10px] font-bold uppercase text-slate-500">Rata-rata SLA AI</p>
          <p className="text-sm font-black text-[#0f2c56]">38 Detik</p>
        </div>
      </div>
    </div>
  );
}

