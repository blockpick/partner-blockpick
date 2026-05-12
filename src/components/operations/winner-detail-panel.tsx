"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWinnerPayout } from "@/lib/hooks/use-operations";
import { PAYOUT_STATUS_LABEL } from "@/components/operations/payout-badge";
import { formatDateTime } from "@/lib/format";
import type { PayoutStatus, Winner } from "@/lib/types/operations";

const STATUSES: PayoutStatus[] = ["PENDING", "PROCESSING", "COMPLETED", "HELD"];

export function WinnerDetailPanel({
  winner,
  onClose,
}: {
  winner: Winner | null;
  onClose?: () => void;
}) {
  const updatePayout = useUpdateWinnerPayout();
  const [status, setStatus] = useState<PayoutStatus>("PENDING");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (winner) {
      setStatus(winner.payoutStatus);
      setMemo(winner.memo ?? "");
    }
  }, [winner]);

  if (!winner) {
    return (
      <Card className="hidden lg:block">
        <CardContent className="px-4 py-8 text-center text-sm text-muted-foreground">
          당첨자를 선택하면 상세 정보가 표시됩니다.
        </CardContent>
      </Card>
    );
  }

  const dirty =
    status !== winner.payoutStatus || (memo ?? "") !== (winner.memo ?? "");

  const save = () => {
    updatePayout.mutate({
      winnerId: winner.id,
      payoutStatus: status,
      memo: memo || undefined,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">{winner.nickname}</CardTitle>
          <p className="text-xs text-muted-foreground">{winner.rewardName}</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-2 text-sm">
          <Row label="당첨 일시" value={formatDateTime(winner.wonAt)} />
          <Row
            label="수령 정보"
            value={winner.recipientInfoProvided ? "제출 완료" : "미제출"}
            warn={!winner.recipientInfoProvided}
          />
        </dl>

        <div className="space-y-1.5">
          <Label>지급 상태</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as PayoutStatus)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {PAYOUT_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="winner-memo">처리 메모</Label>
          <Textarea
            id="winner-memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="처리 이력을 남겨두세요."
            rows={3}
          />
        </div>

        <Button
          onClick={save}
          disabled={!dirty || updatePayout.isPending}
          className="w-full"
        >
          {updatePayout.isPending ? "저장 중..." : "변경 저장"}
        </Button>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-1.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={
          warn
            ? "font-medium text-[hsl(var(--warning))]"
            : "font-medium"
        }
      >
        {value}
      </dd>
    </div>
  );
}
