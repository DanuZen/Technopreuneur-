"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
};

export interface ModalShellProps {
  onClose: () => void;
  ariaLabel: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  leading?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerExtra?: React.ReactNode;
  subHeader?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  bodyClassName?: string;
  children: React.ReactNode;
}

/**
 * Kerangka popup standar Pasbana: header navy solid, bottom-sheet di mobile,
 * kartu di tengah pada desktop, body bisa di-scroll, dan footer menempel di bawah.
 * Seluruh popup di aplikasi memakai komponen ini agar desain konsisten.
 */
export function ModalShell({
  onClose,
  ariaLabel,
  title,
  subtitle,
  badge,
  leading,
  headerRight,
  headerExtra,
  subHeader,
  footer,
  size = "md",
  onSubmit,
  bodyClassName = "px-5 sm:px-6 py-4 space-y-4",
  children,
}: ModalShellProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const containerClass = `w-full ${SIZE_CLASS[size]} max-h-[90dvh] sm:max-h-[86dvh] bg-white border border-slate-200 rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col text-[#0f2c56] animate-page-enter`;

  const inner = (
    <>
      <div className="bg-[#0f2c56] text-white px-5 pt-3 pb-4 sm:px-6 sm:pt-5 space-y-3 shrink-0">
        <div className="w-10 h-1 rounded-full bg-white/25 mx-auto sm:hidden" aria-hidden="true" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {leading}
            <div className="space-y-1 min-w-0">
              {badge && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ce2731] text-white text-[10px] font-bold uppercase tracking-wider">
                  {badge}
                </span>
              )}
              <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-white/75 leading-relaxed">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {headerRight}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup popup"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#ce2731] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {headerExtra}
      </div>

      {subHeader && (
        <div className="shrink-0 px-4 sm:px-6 pt-3 pb-2 bg-[#f4f7fb] border-b border-slate-200 flex overflow-x-auto scrollbar-none sm:flex-wrap gap-1.5">
          {subHeader}
        </div>
      )}

      <div className={`flex-1 min-h-0 overflow-y-auto scrollbar-none ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className="shrink-0 p-4 sm:px-6 border-t border-slate-200 bg-[#f8fafc]">
          {footer}
        </div>
      )}
    </>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-[999] bg-[#0f2c56]/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {onSubmit ? (
        <form
          onSubmit={onSubmit}
          onClick={(e) => e.stopPropagation()}
          className={containerClass}
        >
          {inner}
        </form>
      ) : (
        <div onClick={(e) => e.stopPropagation()} className={containerClass}>
          {inner}
        </div>
      )}
    </div>
  );
}
