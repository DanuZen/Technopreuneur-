"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#0f2c56] font-bold font-mono">
        Membuka ruang evaluasi CV...
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardRedirect />
    </Suspense>
  );
}
