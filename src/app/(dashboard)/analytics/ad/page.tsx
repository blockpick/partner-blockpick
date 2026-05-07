"use client";

import { useAdAnalytics } from "@/lib/hooks/use-analytics";
import { KpiCard } from "@/components/analytics/kpi-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, TrendingUp, Gift, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AnalyticsAdPage() {
  const { data, isLoading } = useAdAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">광고 성과 분석</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          광고 시청 현황과 어뷰징 차단 통계를 확인합니다
        </p>
      </div>

      {/* KPI 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="총 광고 시청 수"
          value={data?.totalWatches.toLocaleString()}
          icon={Play}
          loading={isLoading}
          description="전체 누적"
        />
        <KpiCard
          title="시청 완료율"
          value={
            data ? `${(data.completionRate * 100).toFixed(1)}%` : undefined
          }
          icon={TrendingUp}
          loading={isLoading}
          description="완료/전체 시청"
        />
        <KpiCard
          title="평균 보상"
          value={data ? `${data.averageReward.toFixed(1)}개` : undefined}
          icon={Gift}
          loading={isLoading}
          description="참여권 기준"
        />
        <KpiCard
          title="어뷰징 시도"
          value={data?.abuseAttempts.toLocaleString()}
          icon={AlertTriangle}
          loading={isLoading}
          description="탐지된 이상 시도"
        />
        <KpiCard
          title="어뷰징 차단"
          value={data?.abuseBlockedCount.toLocaleString()}
          icon={ShieldCheck}
          loading={isLoading}
          description="실제 차단 건수"
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">차단 성공률</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : data && data.abuseAttempts > 0 ? (
              <div className="text-2xl font-bold">
                {((data.abuseBlockedCount / data.abuseAttempts) * 100).toFixed(1)}%
              </div>
            ) : (
              <div className="text-2xl font-bold">-</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">차단/시도</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
