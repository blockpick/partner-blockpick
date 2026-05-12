"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CsvExportButton } from "@/components/operations/csv-export-button";
import { PayoutBadge, PAYOUT_STATUS_LABEL } from "@/components/operations/payout-badge";
import { WinnerDetailPanel } from "@/components/operations/winner-detail-panel";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWinners } from "@/lib/hooks/use-operations";
import { formatDateTime } from "@/lib/format";
import type { PayoutStatus, Winner } from "@/lib/types/operations";

const STATUSES: PayoutStatus[] = ["PENDING", "PROCESSING", "COMPLETED", "HELD"];

export default function BlockpickWinnersPage() {
  const params = useParams<{ id: string }>();
  const blockpickId = params.id;
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Winner | null>(null);

  const { data, isLoading } = useWinners({
    blockpickId,
    payoutStatus: status === "all" ? undefined : (status as PayoutStatus),
  });

  const items = data?.items ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <Label>지급 상태</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {PAYOUT_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CsvExportButton
            data={items}
            filename="winners"
            headers={[
              { key: "nickname", label: "닉네임" },
              { key: "rewardName", label: "보상" },
              { key: "payoutStatus", label: "지급 상태" },
              { key: "wonAt", label: "당첨 일시" },
            ]}
            disabled={isLoading}
          />
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : !items.length ? (
              <div className="px-4 py-6">
                <EmptyState
                  title="아직 당첨자가 없어요"
                  description="캠페인 진행 상태를 확인해보세요."
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>당첨자</TableHead>
                    <TableHead>보상</TableHead>
                    <TableHead>지급 상태</TableHead>
                    <TableHead>당첨 일시</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((winner) => (
                    <TableRow
                      key={winner.id}
                      data-state={selected?.id === winner.id ? "selected" : undefined}
                      onClick={() => setSelected(winner)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-medium">{winner.nickname}</span>
                          {!winner.recipientInfoProvided && (
                            <p className="text-xs text-[hsl(var(--warning))]">
                              수령 정보 미입력
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{winner.rewardName}</TableCell>
                      <TableCell>
                        <PayoutBadge status={winner.payoutStatus} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(winner.wonAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <WinnerDetailPanel
        winner={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
