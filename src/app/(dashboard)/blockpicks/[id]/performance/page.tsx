"use client";

import { useParams } from "next/navigation";
import { Eye, Gift, TrendingUp, Users } from "lucide-react";
import { KpiCard } from "@/components/analytics/kpi-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBlockpickDetail } from "@/lib/hooks/use-my-blockpicks";
import { formatNumber, formatPercent } from "@/lib/format";

export default function BlockpickPerformancePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useBlockpickDetail(id);

  const conversionRate =
    data && data.totalVisits > 0
      ? data.totalParticipants / data.totalVisits
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="총 방문"
          value={formatNumber(data?.totalVisits)}
          icon={Eye}
          loading={isLoading}
          description="누적 방문 수"
        />
        <KpiCard
          title="총 참여"
          value={formatNumber(data?.totalParticipants)}
          icon={Users}
          loading={isLoading}
          description="참여자 수"
        />
        <KpiCard
          title="전환율"
          value={formatPercent(conversionRate, { scale100: true })}
          icon={TrendingUp}
          loading={isLoading}
          description="방문 → 참여"
        />
        <KpiCard
          title="경품 수량"
          value={formatNumber(data?.rewardQuantity)}
          icon={Gift}
          loading={isLoading}
          description="제공 경품"
        />
      </div>

      <Card>
        <CardHeader>
          <CardDescription>일별 추이</CardDescription>
          <CardTitle>참여 추이 차트</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="블록픽 단위 추이는 곧 제공됩니다"
            description="전체 추이는 분석 > 전체 성과에서 확인할 수 있어요."
          />
        </CardContent>
      </Card>
    </div>
  );
}
