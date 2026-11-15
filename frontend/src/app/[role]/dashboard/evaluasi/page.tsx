"use client";

import { useParams, notFound } from "next/navigation";
import EvaluatePage from "@/app/evaluate/page";
import { isValidDashboardRole } from "@/lib/routes";

export default function RoleEvaluatePage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  return <EvaluatePage />;
}
