"use client";

import { useParams, notFound } from "next/navigation";
import OnboardingPage from "@/app/onboarding/page";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleEvaluasiOnboardingPage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role) || role !== "user") {
    notFound();
  }

  return <OnboardingPage />;
}
