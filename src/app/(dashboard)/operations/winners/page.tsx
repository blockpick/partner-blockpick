"use client";

import { useState } from "react";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import { CsvExportButton } from "@/components/operations/csv-export-button";
import { PayoutBadge, PAYOUT_STATUS_LABEL } from "@/components/operations/payout-badge";
import { WinnerDetailPanel } from "@/components/operations/winner-detail-panel";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { SimplePagination } from "@/components/dashboard/simple-pagination";
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

export default function WinnersPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const [payoutStatus, setPayoutStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Winner | null>(null);
  const pageSize = 20;
  const { data, isLoading } = useWinners({
    blockpickId: blockpickId === "all" ? undefined : blockpickId,
    payoutStatus:
      payoutStatus === "all" ? undefined : (payoutStatus as PayoutStatus),
    page,
    pageSize,
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="당첨자 관리"
        description="지급 상태를 추적하고 경품 지급 작업을 정리합니다."
        actions={
          <CsvExportButton
            data={items}
            filename="winners"
            headers={[
              { key: "nickname", label: "닉네임" },
              { key: "rewardName", label: "경품" },
              { key: "payoutStatus", label: "지급 상태" },
              { key: "wonAt", label: "당첨 일시" },
            ]}
            disabled={isLoading}
          />
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-4 md:flex-row md:items-end">
              <div className="space-y-1.5">
                <Label>블록픽</Label>
                <BlockpickSelect
                  value={blockpickId}
                  onChange={(value) => {
                    setBlockpickId(value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>지급 상태</Label>
                <Select
                  value={payoutStatus}
                  onValueChange={(value) => {
                    setPayoutStatus(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {PAYOUT_STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                  ))}
                </div>
              ) : !items.length ? (
                <div className="px-4 py-6">
                  <EmptyState
                    title="아직 당첨자가 없어요"
                    description="진행중인 블록픽에서 당첨이 발생하면 이곳에 표시됩니다."
                  />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>당첨자</TableHead>
                      <TableHead>경품</TableHead>
                      <TableHead>지급 상태</TableHead>
                      <TableHead>당첨 일시</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((winner) => (
                      <TableRow
                        key={winner.id}
                        data-state={
                          selected?.id === winner.id ? "selected" : undefined
                        }
                        onClick={() => setSelected(winner)}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-medium">{winner.nickname}</p>
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

          {!!data && data.total > 0 && (
            <SimplePagination
              page={page}
              pageSize={pageSize}
              total={data.total}
              onPageChange={setPage}
            />
          )}
        </div>

        <WinnerDetailPanel
          winner={selected}
          onClose={() => setSelected(null)}
        />
      </div>
    </div>
  );
}
