"use client";

import { useState } from "react";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityLogTable } from "@/components/team/activity-log-table";
import { useActivityLogs, useTeamMembers } from "@/lib/hooks/use-team";
import type { ActivityAction, ActivityLogFilter } from "@/lib/types/team";
import { format } from "date-fns";

const ACTION_OPTIONS: { value: ActivityAction | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체 액션" },
  { value: "LOGIN", label: "로그인" },
  { value: "BLOCKPICK_CREATE", label: "블록픽 생성" },
  { value: "BLOCKPICK_EDIT", label: "블록픽 수정" },
  { value: "BLOCKPICK_END", label: "블록픽 종료" },
  { value: "MEMBER_INVITE", label: "멤버 초대" },
  { value: "MEMBER_REMOVE", label: "멤버 제거" },
  { value: "ROLE_CHANGE", label: "역할 변경" },
  { value: "BILLING_PAYMENT", label: "결제" },
  { value: "SETTINGS_UPDATE", label: "설정 변경" },
];

export default function TeamActivityPage() {
  const [selectedUser, setSelectedUser] = useState<string>("ALL");
  const [selectedAction, setSelectedAction] = useState<
    ActivityAction | "ALL"
  >("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: members } = useTeamMembers();

  const filter: ActivityLogFilter = {
    ...(selectedUser !== "ALL" && { userId: selectedUser }),
    ...(selectedAction !== "ALL" && { action: selectedAction }),
    ...(startDate && { startDate: new Date(startDate).toISOString() }),
    ...(endDate && { endDate: new Date(endDate + "T23:59:59").toISOString() }),
    page: 1,
    limit: 50,
  };

  const { data: logPage, isLoading } = useActivityLogs(filter);

  function handleExportCsv() {
    const logs = logPage?.items ?? [];
    const headers = ["멤버", "이메일", "액션", "내용", "일시"];
    const rows = logs.map((l) => [
      l.userName,
      l.userEmail,
      l.action,
      l.description,
      format(new Date(l.createdAt), "yyyy-MM-dd HH:mm:ss"),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${format(new Date(), "yyyyMMdd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">팀 활동 로그</h1>
          <p className="text-sm text-muted-foreground mt-1">
            팀원들의 모든 활동 내역을 확인합니다.
          </p>
        </div>
        <Button variant="outline" onClick={handleExportCsv}>
          <Download className="mr-2 h-4 w-4" />
          CSV 내보내기
        </Button>
      </div>

      {/* 필터 영역 */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          필터
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">멤버</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 멤버</SelectItem>
                {(members ?? []).map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">액션</Label>
            <Select
              value={selectedAction}
              onValueChange={(v) =>
                setSelectedAction(v as ActivityAction | "ALL")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">시작일</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">종료일</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-lg border bg-card">
        <div className="px-4 py-3 border-b">
          <p className="text-sm text-muted-foreground">
            총 <span className="font-medium text-foreground">{logPage?.total ?? 0}</span>건
          </p>
        </div>
        <div className="p-1">
          <ActivityLogTable
            logs={logPage?.items ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
