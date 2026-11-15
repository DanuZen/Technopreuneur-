"use client";

import { useParams, notFound } from "next/navigation";
import OnboardingPage from "@/app/onboarding/page";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleOnboardingPage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  return <OnboardingPage />;
}

