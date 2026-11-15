"use client";

import { useParams, notFound } from "next/navigation";
import OnboardingPage from "@/app/onboarding/page";
import {
  CompanyProfileSubpage,
  AdminReportSubpage,
} from "@/components/dashboard/role-subpages";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleOnboardingPage() {
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

  return <OnboardingPage />;
}

