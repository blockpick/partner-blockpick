"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useMyBlockpicks } from "@/lib/hooks/use-my-blockpicks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowRight } from "lucide-react";
import type { BlockpickStatus } from "@/lib/types/blockpick";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "진행중",
  SCHEDULED: "예약됨",
  DRAFT: "임시저장",
  ENDED: "종료됨",
  CANCELLED: "취소됨",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  SCHEDULED: "secondary",
  DRAFT: "outline",
  ENDED: "secondary",
  CANCELLED: "destructive",
};

const TAB_FILTERS = [
  { label: "전체", value: undefined },
  { label: "진행중", value: "ACTIVE" },
  { label: "예약됨", value: "SCHEDULED" },
  { label: "종료됨", value: "ENDED" },
  { label: "임시저장", value: "DRAFT" },
] as const;

function BlockpickListContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as BlockpickStatus | null;

  const { data, isLoading } = useMyBlockpicks({
    status: statusParam ?? undefined,
    pageSize: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">블록픽</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            캠페인을 생성하고 관리하세요
          </p>
        </div>
        <Link href="/blockpicks/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            새 블록픽 만들기
          </Button>
        </Link>
      </div>

      {/* 상태 탭 필터 */}
      <div className="flex gap-1 border-b pb-0">
        {TAB_FILTERS.map((tab) => {
          const isActive =
            (tab.value === undefined && !statusParam) ||
            statusParam === tab.value;
          const href = tab.value
            ? `/blockpicks?status=${tab.value}`
            : "/blockpicks";
          return (
            <Link key={tab.label} href={href}>
              <button
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            </Link>
          );
        })}
      </div>

      {/* 리스트 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {data?.total ?? 0}개의 블록픽
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !data?.items.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">블록픽이 없습니다</p>
              <Link href="/blockpicks/new" className="mt-4">
                <Button size="sm">첫 번째 블록픽 만들기</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {data.items.map((bp) => (
                <Link
                  key={bp.id}
                  href={`/blockpicks/${bp.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-medium truncate">{bp.title}</p>
                    <p className="text-xs text-muted-foreground">
                      참여 {bp.totalParticipants.toLocaleString()}명 · 방문{" "}
                      {bp.totalVisits.toLocaleString()}회
                      {bp.startAt && (
                        <>
                          {" "}
                          · {new Date(bp.startAt).toLocaleDateString("ko-KR")}
                          {bp.endAt &&
                            ` ~ ${new Date(bp.endAt).toLocaleDateString("ko-KR")}`}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Badge variant={STATUS_VARIANT[bp.status] ?? "outline"}>
                      {STATUS_LABEL[bp.status] ?? bp.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BlockpicksPage() {
  return (
    <Suspense fallback={<div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full" /></div>}>
      <BlockpickListContent />
    </Suspense>
  );
}
