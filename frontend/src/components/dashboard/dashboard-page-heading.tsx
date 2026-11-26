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
      className={`flex flex-col lg:flex-row lg:items-center gap-3.5 sm:gap-4 print:hidden ${
        isCentered ? "justify-center" : "justify-between"
      }`}
    >
      <div
        className={`space-y-2.5 sm:space-y-3.5 flex flex-col min-w-0 ${
          isCentered ? "text-center items-center" : "text-left items-start"
        }`}
      >
        <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white">
          {badge}
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-extrabold tracking-normal text-[#0f2c56] leading-[1.3] font-heading">
          {titleLine1}
          <br />
          {titleLine2Prefix}{" "}
          <span className="inline-block bg-[#ce2731] text-white px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-xl mt-1.5 sm:mt-2">
            {titleHighlight}
          </span>
        </h1>
      </div>

      {rightSlot && <div className="w-full lg:w-auto shrink-0">{rightSlot}</div>}
    </div>
  );
}

