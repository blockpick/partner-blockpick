"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EndedBlockpicksPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/blockpicks?status=ENDED");
  }, [router]);
  return null;
}
