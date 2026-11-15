"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardPageSkeleton } from "@/components/ui/dashboard-skeleton";

function DashboardRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const queryOnboarding = searchParams.get("onboarding") === "true";
    const tabParam = searchParams.get("tab");

    if (queryOnboarding) {
      router.replace("/user/dashboard/onboarding");
      return;
    }

    if (tabParam === "preview") {
      router.replace("/user/dashboard/dokumen");
      return;
    }

    if (tabParam === "jobs") {
      router.replace("/user/dashboard/lowongan");
      return;
    }

    router.replace("/user/dashboard/evaluasi");
  }, [searchParams, router]);

  return <DashboardPageSkeleton />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <DashboardRedirect />
    </Suspense>
  );
}
