"use client";

import { useState } from "react";
import { useWinners, useUpdateWinnerPayout } from "@/lib/hooks/use-operations";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import { CsvExportButton } from "@/components/operations/csv-export-button";
import { PayoutBadge } from "@/components/operations/payout-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import type { PayoutStatus, Winner } from "@/lib/types/operations";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type DialogMode = "confirm" | "hold" | "memo" | null;

export default function OperationsWinnersPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const [payoutStatus, setPayoutStatus] = useState<PayoutStatus | "">("");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);
  const [memo, setMemo] = useState("");

  const filter = {
    blockpickId: blockpickId === "all" ? undefined : blockpickId,
    payoutStatus: payoutStatus || undefined,
  };

  const { data, isLoading } = useWinners(filter);
  const updatePayout = useUpdateWinnerPayout();
  const items = data?.items ?? [];

  function openDialog(winner: Winner, mode: DialogMode) {
    setSelectedWinner(winner);
    setMemo(winner.memo ?? "");
    setDialogMode(mode);
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedWinner(null);
    setMemo("");
  }

  async function handleConfirm() {
    if (!selectedWinner || !dialogMode) return;
    const newStatus: PayoutStatus =
      dialogMode === "confirm"
        ? "COMPLETED"
        : dialogMode === "hold"
        ? "HELD"
        : selectedWinner.payoutStatus;
    await updatePayout.mutateAsync({
      winnerId: selectedWinner.id,
      payoutStatus: newStatus,
      memo: dialogMode === "memo" ? memo : selectedWinner.memo,
    });
    closeDialog();
  }

  const csvHeaders = [
    { key: "nickname" as const, label: "닉네임" },
    { key: "rewardName" as const, label: "보상" },
    { key: "payoutStatus" as const, label: "지급 상태" },
    { key: "recipientInfoProvided" as const, label: "수령정보 입력" },
    { key: "wonAt" as const, label: "당첨 일시" },
    { key: "memo" as const, label: "메모" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">당첨자 관리</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            당첨자 지급 상태를 확인하고 관리합니다
          </p>
        </div>
        <CsvExportButton
          data={items.map((w) => ({
            nickname: w.nickname,
            rewardName: w.rewardName,
            payoutStatus: ({ PENDING: "대기", PROCESSING: "지급중", COMPLETED: "완료", HELD: "보류" } as Record<string, string>)[w.payoutStatus] ?? w.payoutStatus,
            recipientInfoProvided: w.recipientInfoProvided ? "입력완료" : "미입력",
            wonAt: format(new Date(w.wonAt), "yyyy-MM-dd HH:mm", { locale: ko }),
            memo: w.memo ?? "",
          }))}
          filename="당첨자목록"
          headers={csvHeaders}
        />
      </div>

      {/* 필터 */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <BlockpickSelect value={blockpickId} onChange={setBlockpickId} />
            <Select
              value={payoutStatus || "all"}
              onValueChange={(v) =>
                setPayoutStatus(v === "all" ? "" : (v as PayoutStatus))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="지급 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="PENDING">대기</SelectItem>
                <SelectItem value="PROCESSING">지급중</SelectItem>
                <SelectItem value="COMPLETED">완료</SelectItem>
                <SelectItem value="HELD">보류</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            당첨자 목록
            {data && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                총 {data.total.toLocaleString()}명
              </span>
            )}
          </CardTitle>
          <CardDescription>
            지급 확정 / 보류 처리 및 메모를 남길 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>닉네임</TableHead>
                  <TableHead>보상</TableHead>
                  <TableHead>지급 상태</TableHead>
                  <TableHead>수령정보</TableHead>
                  <TableHead>당첨 일시</TableHead>
                  <TableHead>메모</TableHead>
                  <TableHead className="text-right">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      당첨자가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-medium">{w.nickname}</TableCell>
                      <TableCell>{w.rewardName}</TableCell>
                      <TableCell>
                        <PayoutBadge status={w.payoutStatus} />
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            w.recipientInfoProvided
                              ? "text-sm text-emerald-600"
                              : "text-sm text-muted-foreground"
                          }
                        >
                          {w.recipientInfoProvided ? "입력완료" : "미입력"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(w.wonAt), "MM/dd HH:mm", { locale: ko })}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-sm text-muted-foreground">
                        {w.memo ?? "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 gap-1 text-xs"
                            onClick={() => openDialog(w, "confirm")}
                            disabled={w.payoutStatus === "COMPLETED"}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            확정
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 gap-1 text-xs text-destructive hover:text-destructive"
                            onClick={() => openDialog(w, "hold")}
                            disabled={w.payoutStatus === "HELD"}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            보류
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => openDialog(w, "memo")}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 액션 다이얼로그 */}
      <Dialog open={dialogMode !== null} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "confirm"
                ? "지급 확정"
                : dialogMode === "hold"
                ? "보류 처리"
                : "메모 수정"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "confirm"
                ? `${selectedWinner?.nickname}님의 보상 지급을 확정합니다.`
                : dialogMode === "hold"
                ? `${selectedWinner?.nickname}님의 지급을 보류 처리합니다.`
                : `${selectedWinner?.nickname}님에 대한 메모를 남깁니다.`}
            </DialogDescription>
          </DialogHeader>
          {dialogMode === "memo" && (
            <div className="space-y-2">
              <Label>메모</Label>
              <Textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="내부 메모를 입력하세요"
                rows={3}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={updatePayout.isPending}
              variant={dialogMode === "hold" ? "destructive" : "default"}
            >
              {updatePayout.isPending ? "처리중..." : "확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
