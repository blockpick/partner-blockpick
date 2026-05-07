"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { ActivityLog, ActivityAction } from "@/lib/types/team";

const ACTION_LABELS: Record<ActivityAction, string> = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  BLOCKPICK_CREATE: "블록픽 생성",
  BLOCKPICK_EDIT: "블록픽 수정",
  BLOCKPICK_END: "블록픽 종료",
  MEMBER_INVITE: "멤버 초대",
  MEMBER_REMOVE: "멤버 제거",
  ROLE_CHANGE: "역할 변경",
  BILLING_PAYMENT: "결제",
  SETTINGS_UPDATE: "설정 변경",
};

const ACTION_VARIANTS: Record<
  ActivityAction,
  "default" | "secondary" | "destructive" | "outline"
> = {
  LOGIN: "secondary",
  LOGOUT: "outline",
  BLOCKPICK_CREATE: "default",
  BLOCKPICK_EDIT: "secondary",
  BLOCKPICK_END: "destructive",
  MEMBER_INVITE: "default",
  MEMBER_REMOVE: "destructive",
  ROLE_CHANGE: "secondary",
  BILLING_PAYMENT: "default",
  SETTINGS_UPDATE: "outline",
};

interface ActivityLogTableProps {
  logs: ActivityLog[];
  isLoading?: boolean;
}

export function ActivityLogTable({ logs, isLoading }: ActivityLogTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-16 text-center">
        <p className="text-muted-foreground">활동 로그가 없습니다.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>멤버</TableHead>
          <TableHead>액션</TableHead>
          <TableHead>내용</TableHead>
          <TableHead className="text-right">일시</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <div>
                <p className="font-medium text-sm">{log.userName}</p>
                <p className="text-xs text-muted-foreground">{log.userEmail}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={ACTION_VARIANTS[log.action]}>
                {ACTION_LABELS[log.action]}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
              {log.description}
            </TableCell>
            <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
              {format(new Date(log.createdAt), "MM.dd HH:mm", { locale: ko })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
