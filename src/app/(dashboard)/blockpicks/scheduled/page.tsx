"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ScheduledBlockpicksPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/blockpicks?status=SCHEDULED");
  }, [router]);
  return null;
}
