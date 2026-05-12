"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsage } from "@/lib/hooks/use-subscription";
import { clampPercent, formatNumber } from "@/lib/format";

export default function BillingUsagePage() {
  const { data, isLoading } = useUsage();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="사용량"
          description="현재 플랜 한도 대비 사용량을 확인합니다."
        />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="사용량"
          description="현재 플랜 한도 대비 사용량을 확인합니다."
        />
        <EmptyState
          title="사용량 데이터가 없어요"
          description="활성 플랜이 시작되면 이곳에 사용량이 표시됩니다."
        />
      </div>
    );
  }

  const metrics = [
    {
      label: "월 참여자",
      used: data.monthlyParticipants.used,
      limit: data.monthlyParticipants.limit,
    },
    {
      label: "활성 블록픽",
      used: data.activeBlockpicks.used,
      limit: data.activeBlockpicks.limit,
    },
    {
      label: "팀 멤버",
      used: data.teamMembers.used,
      limit: data.teamMembers.limit,
    },
    {
      label: "스토리지 (GB)",
      used: data.storageGb.used,
      limit: data.storageGb.limit,
    },
  ];

  const nearLimit = metrics.some(
    (m) => m.limit > 0 && m.used / m.limit >= 0.8
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="사용량"
        description="현재 플랜 한도 대비 사용량을 확인합니다."
        actions={
          <Link href="/billing/upgrade">
            <Button size="sm">플랜 업그레이드</Button>
          </Link>
        }
      />

      {nearLimit && (
        <Card className="border-[hsl(var(--warning))] bg-warning/5">
          <CardContent className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-[hsl(var(--warning))]">
                이번 달 사용량이 한도에 거의 도달했어요
              </p>
              <p className="text-xs text-muted-foreground">
                안정적인 운영을 위해 플랜 업그레이드를 고려하세요.
              </p>
            </div>
            <Link href="/billing/upgrade">
              <Button variant="outline" size="sm">
                플랜 비교
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardDescription>현황</CardDescription>
          <CardTitle className="text-base">사용량 / 한도</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {metrics.map((metric) => {
            const isUnlimited = metric.limit < 0;
            const ratio = !isUnlimited && metric.limit > 0
              ? clampPercent((metric.used / metric.limit) * 100)
              : 0;
            const warn = !isUnlimited && ratio >= 80;
            return (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metric.label}</span>
                  <span
                    className={
                      warn
                        ? "tabular-nums text-[hsl(var(--warning))]"
                        : "tabular-nums text-muted-foreground"
                    }
                  >
                    {formatNumber(metric.used)} /{" "}
                    {isUnlimited ? "무제한" : formatNumber(metric.limit)}
                  </span>
                </div>
                <Progress value={isUnlimited ? 0 : ratio} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
