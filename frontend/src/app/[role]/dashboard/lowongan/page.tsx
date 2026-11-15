"use client";

import { useParams, notFound } from "next/navigation";
import LowonganCocokPage from "@/app/dashboard/lowongan/page";
import {
  CompanyJobsSubpage,
  AdminModerationSubpage,
} from "@/components/dashboard/role-subpages";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleLowonganPage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  if (role === "company") {
    return <CompanyJobsSubpage />;
  }

  if (role === "admin") {
    return <AdminModerationSubpage />;
  }

  return <LowonganCocokPage />;
}

