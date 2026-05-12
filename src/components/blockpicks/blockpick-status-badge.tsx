"use client";

import { Badge } from "@/components/ui/badge";
import type { BlockpickStatus } from "@/lib/types/blockpick";

const STATUS_LABEL: Record<BlockpickStatus, string> = {
  ACTIVE: "진행중",
  SCHEDULED: "예약됨",
  DRAFT: "임시저장",
  ENDED: "종료됨",
  CANCELLED: "취소됨",
};

const STATUS_VARIANT: Record<
  BlockpickStatus,
  "success" | "info" | "outline" | "secondary" | "destructive"
> = {
  ACTIVE: "success",
  SCHEDULED: "info" as never,
  DRAFT: "outline",
  ENDED: "secondary",
  CANCELLED: "destructive",
};

export function BlockpickStatusBadge({ status }: { status: BlockpickStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
