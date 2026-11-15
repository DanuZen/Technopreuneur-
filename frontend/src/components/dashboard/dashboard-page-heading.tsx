"use client";

import React from "react";

interface DashboardPageHeadingProps {
  badge: string;
  titleLine1: string;
  titleLine2Prefix: string;
  titleHighlight: string;
  rightSlot?: React.ReactNode;
  align?: "left" | "center";
}

export function DashboardPageHeading({
  badge,
  titleLine1,
  titleLine2Prefix,
  titleHighlight,
  rightSlot,
  align = "left",
}: DashboardPageHeadingProps) {
  const isCentered = align === "center" && !rightSlot;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-start gap-4 print:hidden ${
        isCentered ? "justify-center" : "justify-between"
      }`}
    >
      <div
        className={`space-y-3 flex flex-col ${
          isCentered ? "text-center items-center" : "text-left items-start"
        }`}
      >
        <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white">
          {badge}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-[#0f2c56] leading-[1.22] font-heading">
          {titleLine1}
          <br />
          {titleLine2Prefix}{" "}
          <span className="inline-block bg-[#ce2731] text-white px-3 py-0.5 rounded-xl mt-1">
            {titleHighlight}
          </span>
        </h1>
      </div>

      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}

