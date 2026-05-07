"use client";

import { useOverviewAnalytics } from "@/lib/hooks/use-analytics";
import { KpiCard } from "@/components/analytics/kpi-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Users,
  TrendingUp,
  Share2,
  Play,
  Trophy,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsOverviewPage() {
  const { data, isLoading } = useOverviewAnalytics();

  const kpi = data?.kpi;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">전체 성과</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          전체 블록픽의 통합 성과 지표를 확인합니다
        </p>
      </div>

      {/* KPI 카드 6개 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="총 방문 수"
          value={kpi?.totalVisits.toLocaleString()}
          icon={Eye}
          loading={isLoading}
          description="전체 누적"
        />
        <KpiCard
          title="총 참여 수"
          value={kpi?.totalParticipants.toLocaleString()}
          icon={Users}
          loading={isLoading}
          description="전체 누적"
        />
        <KpiCard
          title="무료 참여 비율"
          value={kpi ? `${(kpi.freeEntryRatio * 100).toFixed(1)}%` : undefined}
          icon={TrendingUp}
          loading={isLoading}
          description="무료 참여권"
        />
        <KpiCard
          title="추가 참여 비율"
          value={kpi ? `${(kpi.extraEntryRatio * 100).toFixed(1)}%` : undefined}
          icon={TrendingUp}
          loading={isLoading}
          description="광고·미션·초대"
        />
        <KpiCard
          title="친구초대 성공률"
          value={kpi ? `${(kpi.referralSuccessRate * 100).toFixed(1)}%` : undefined}
          icon={Share2}
          loading={isLoading}
          description="가입→첫 참여"
        />
        <KpiCard
          title="광고 시청 수"
          value={kpi?.adWatchCount.toLocaleString()}
          icon={Play}
          loading={isLoading}
          description="전체 누적"
        />
        <KpiCard
          title="당첨자 수"
          value={kpi?.winnerCount.toLocaleString()}
          icon={Trophy}
          loading={isLoading}
          description="전체 누적"
        />
      </div>

      {/* 시계열 차트 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">일별 추이 (최근 14일)</CardTitle>
          <CardDescription>방문 수 / 참여 수 / 친구초대 / 광고 시청</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data?.timeSeries ?? []}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => v.slice(5)}
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} width={40} />
                <Tooltip
                  labelFormatter={(label: unknown) => `날짜: ${label}`}
                  formatter={(value: unknown, name: unknown) => {
                    const labels: Record<string, string> = {
                      visits: "방문",
                      participants: "참여",
                      referrals: "친구초대",
                      adWatches: "광고 시청",
                    };
                    const v = typeof value === "number" ? value.toLocaleString() : String(value);
                    const n = String(name);
                    return [v, labels[n] ?? n];
                  }}
                />
                <Legend
                  formatter={(value: string) => {
                    const labels: Record<string, string> = {
                      visits: "방문",
                      participants: "참여",
                      referrals: "친구초대",
                      adWatches: "광고 시청",
                    };
                    return labels[value] ?? value;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="participants"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="referrals"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="adWatches"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
