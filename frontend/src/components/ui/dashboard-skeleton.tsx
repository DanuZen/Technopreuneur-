"use client";

import React from "react";

export function DashboardHeadingSkeleton({ centered = false }: { centered?: boolean }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-4 animate-pulse ${
        centered ? "justify-center" : "justify-between"
      }`}
    >
      <div className={`space-y-2.5 flex flex-col ${centered ? "items-center" : "items-start"}`}>
        <div className="h-6 w-36 rounded-full bg-[#0f2c56]/15" />
        <div className="h-8 w-64 sm:w-80 rounded-xl bg-slate-200" />
        <div className="h-8 w-52 sm:w-64 rounded-xl bg-[#ce2731]/20" />
      </div>
      {!centered && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
          <div className="h-10 w-36 rounded-xl bg-[#0f2c56]/15" />
        </div>
      )}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5 animate-pulse">
      <DashboardHeadingSkeleton />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-5 h-72 rounded-3xl bg-[#0f2c56]/15" />
        <div className="xl:col-span-7 h-72 rounded-3xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="h-5 w-44 rounded-lg bg-slate-200" />
          <div className="h-16 w-full rounded-2xl bg-slate-100" />
          <div className="h-16 w-full rounded-2xl bg-slate-100" />
          <div className="h-16 w-full rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function DokumenPageSkeleton() {
  return (
    <div className="xl:h-full min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 flex flex-col gap-4 animate-pulse">
      <DashboardHeadingSkeleton />
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="h-56 rounded-3xl bg-[#0f2c56]/15" />
          <div className="flex-1 min-h-40 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="h-5 w-48 rounded-lg bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
          </div>
          <div className="h-36 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="h-5 w-40 rounded-lg bg-slate-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-6 rounded bg-slate-100" />
              <div className="h-6 rounded bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="xl:col-span-7 flex items-center justify-center">
          <div className="w-full max-w-[520px] aspect-[210/297] rounded-2xl bg-white border border-slate-200 p-8 space-y-5">
            <div className="h-7 w-48 mx-auto rounded-lg bg-slate-200" />
            <div className="h-4 w-36 mx-auto rounded bg-slate-100" />
            <div className="h-px bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3.5 w-full rounded bg-slate-100" />
              <div className="h-3.5 w-11/12 rounded bg-slate-100" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="h-3.5 w-full rounded bg-slate-100" />
              <div className="h-3.5 w-4/5 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LowonganPageSkeleton() {
  return (
    <div className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-6 animate-pulse">
      <DashboardHeadingSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-20 rounded-full bg-slate-200" />
                <div className="h-5 w-44 rounded-lg bg-slate-200" />
                <div className="h-3.5 w-32 rounded bg-slate-100" />
              </div>
              <div className="h-10 w-12 rounded-xl bg-[#0f2c56]/15 shrink-0" />
            </div>
            <div className="h-12 w-full rounded-xl bg-slate-100" />
            <div className="h-10 w-full rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RiwayatChatSkeleton() {
  return (
    <div className="h-full overflow-hidden w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-3 flex flex-col gap-4 animate-pulse">
      <div className="shrink-0 pb-4 border-b border-slate-200/80">
        <DashboardHeadingSkeleton />
      </div>
      <div className="flex-1 space-y-4 overflow-hidden py-2">
        <div className="flex justify-end">
          <div className="h-11 w-64 rounded-2xl bg-[#0f2c56]/20" />
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 max-w-4xl bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="h-24 rounded-2xl bg-[#0f2c56]/15" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 h-52 rounded-2xl bg-slate-100" />
              <div className="lg:col-span-7 space-y-2.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 rounded-xl bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-14 w-full rounded-2xl bg-slate-100 shrink-0" />
    </div>
  );
}
