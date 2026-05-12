"use client";

import { cn } from "@/lib/utils";
import type { PayoutStatus } from "@/lib/types/operations";

const STATUS_CONFIG: Record<
  PayoutStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "지급 대기",
    className: "bg-warning/10 text-[hsl(var(--warning))]",
  },
  PROCESSING: {
    label: "지급중",
    className: "bg-info/10 text-[hsl(var(--info))]",
  },
  COMPLETED: {
    label: "지급 완료",
    className: "bg-success/10 text-[hsl(var(--success))]",
  },
  HELD: {
    label: "보류",
    className: "bg-destructive/10 text-destructive",
  },
};

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  PENDING: "지급 대기",
  PROCESSING: "지급중",
  COMPLETED: "지급 완료",
  HELD: "보류",
};

export function PayoutBadge({ status }: { status: PayoutStatus }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
