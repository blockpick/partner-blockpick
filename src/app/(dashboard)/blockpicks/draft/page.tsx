"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DraftBlockpicksPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/blockpicks?status=DRAFT");
  }, [router]);
  return null;
}
