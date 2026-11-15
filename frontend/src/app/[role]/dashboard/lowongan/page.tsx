"use client";

import { useParams, notFound } from "next/navigation";
import LowonganCocokPage from "@/app/dashboard/lowongan/page";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleLowonganPage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  return <LowonganCocokPage />;
}
