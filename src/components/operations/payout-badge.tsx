import { Badge } from "@/components/ui/badge";
import type { PayoutStatus } from "@/lib/types/operations";

const LABEL: Record<PayoutStatus, string> = {
  PENDING: "대기",
  PROCESSING: "지급중",
  COMPLETED: "완료",
  HELD: "보류",
};

const VARIANT: Record<PayoutStatus, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "outline",
  PROCESSING: "secondary",
  COMPLETED: "default",
  HELD: "destructive",
};

export function PayoutBadge({ status }: { status: PayoutStatus }) {
  return <Badge variant={VARIANT[status]}>{LABEL[status]}</Badge>;
}
