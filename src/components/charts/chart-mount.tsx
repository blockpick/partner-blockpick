"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartMount({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className={className} />;
  }

  return <div className={className}>{children}</div>;
}
