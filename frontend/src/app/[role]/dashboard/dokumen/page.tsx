"use client";

import { useParams, notFound } from "next/navigation";
import DokumenCvAtsPage from "@/app/dashboard/dokumen/page";
import {
  CompanyProfileSubpage,
  AdminReportSubpage,
} from "@/components/dashboard/role-subpages";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleDokumenPage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  if (role === "company") {
    return <CompanyProfileSubpage />;
  }

  if (role === "admin") {
    return <AdminReportSubpage />;
  }

  return <DokumenCvAtsPage />;
}

