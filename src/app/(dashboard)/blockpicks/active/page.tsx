"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ActiveBlockpicksPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/blockpicks?status=ACTIVE");
  }, [router]);
  return null;
}
