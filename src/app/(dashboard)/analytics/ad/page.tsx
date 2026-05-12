"use client";

import { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Film, ShieldAlert, Sparkles } from "lucide-react";
import { KpiCard } from "@/components/analytics/kpi-card";
import { ChartMount } from "@/components/charts/chart-mount";
import { PageHeader } from "@/components/dashboard/page-header";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAdAnalytics } from "@/lib/hooks/use-analytics";
import { formatNumber, formatPercent } from "@/lib/format";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  fontSize: 12,
};

export default function AdAnalyticsPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const selectedBlockpickId = blockpickId === "all" ? undefined : blockpickId;
  const { data, isLoading } = useAdAnalytics(selectedBlockpickId);
  const validWatches = Math.max(
    (data?.totalWatches ?? 0) - (data?.abuseBlockedCount ?? 0),
    0
  );
  const pieData = [
    { name: "정상 완료", value: validWatches },
    { name: "차단", value: data?.abuseBlockedCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="광고 성과"
        description="보상형 광고 시청의 완료율과 차단 흐름을 확인합니다."
      />

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-1.5">
            <Label>블록픽</Label>
            <BlockpickSelect value={blockpickId} onChange={setBlockpickId} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="총 시청" value={data && formatNumber(data.totalWatches)} icon={Film} loading={isLoading} description="광고 재생 수" />
        <KpiCard title="완시율" value={data && formatPercent(data.completionRate)} icon={Sparkles} loading={isLoading} description="끝까지 시청한 비율" />
        <KpiCard title="평균 보상" value={data ? `${data.averageReward}` : undefined} icon={Sparkles} loading={isLoading} description="광고 1회 기준" />
        <KpiCard title="차단 건수" value={data && formatNumber(data.abuseBlockedCount)} icon={ShieldAlert} loading={isLoading} description="이상 시도 필터링" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>정상 vs 차단</CardDescription>
            <CardTitle>광고 무결성 분포</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartMount className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={84} paddingAngle={3} strokeWidth={0}>
                    <Cell fill="hsl(var(--chart-2))" />
                    <Cell fill="hsl(var(--chart-5))" />
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value ?? 0))} contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </ChartMount>
            <div className="space-y-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: index === 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))" }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium tabular-nums">{formatNumber(item.value)}</span>
                  </div>
                  <div className="h-1.5 rounded-sm bg-muted">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${Math.min((item.value / Math.max(data?.totalWatches ?? 1, 1)) * 100, 100)}%`,
                        backgroundColor: index === 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>핵심 지표</CardDescription>
            <CardTitle>보상 효율</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <MetricBox label="이상 시도 건수" value={data ? formatNumber(data.abuseAttempts) : "-"} />
            <MetricBox label="정상 완료 추정" value={data ? formatNumber(validWatches) : "-"} />
            <MetricBox label="차단 비중" value={data ? formatPercent(data.abuseBlockedCount / Math.max(data.totalWatches, 1)) : "-"} />
            <MetricBox label="광고 완료율" value={data ? formatPercent(data.completionRate) : "-"} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
