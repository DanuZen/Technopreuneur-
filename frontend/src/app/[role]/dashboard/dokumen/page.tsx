"use client";

import { useParams, notFound } from "next/navigation";
import DokumenCvAtsPage from "@/app/dashboard/dokumen/page";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleDokumenPage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  return <DokumenCvAtsPage />;
}
