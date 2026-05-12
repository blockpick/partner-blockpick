"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Gift,
  MousePointerClick,
  Share2,
  Trophy,
  Users,
} from "lucide-react";
import { KpiCard } from "@/components/analytics/kpi-card";
import { ChartMount } from "@/components/charts/chart-mount";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
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
import { useOverviewAnalytics } from "@/lib/hooks/use-analytics";
import { formatNumber, formatPercent } from "@/lib/format";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  fontSize: 12,
};

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

export default function AnalyticsOverviewPage() {
  const { data, isLoading } = useOverviewAnalytics();
  const kpi = data?.kpi;
  const points = data?.timeSeries ?? [];
  const mixData = [
    {
      name: "무료 참여",
      value: Math.round(
        (kpi?.totalParticipants ?? 0) * (kpi?.freeEntryRatio ?? 0)
      ),
    },
    {
      name: "추가 참여",
      value: Math.round(
        (kpi?.totalParticipants ?? 0) * (kpi?.extraEntryRatio ?? 0)
      ),
    },
    {
      name: "리퍼럴 성공",
      value: Math.round(
        (kpi?.totalParticipants ?? 0) * (kpi?.referralSuccessRate ?? 0)
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="전체 성과"
        description="방문, 참여, 리퍼럴, 광고 보상 흐름을 한 화면에서 비교합니다."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard title="총 방문" value={kpi && formatNumber(kpi.totalVisits)} icon={MousePointerClick} loading={isLoading} description="유입된 전체 트래픽" />
        <KpiCard title="총 참여" value={kpi && formatNumber(kpi.totalParticipants)} icon={Users} loading={isLoading} description="실제 참여한 인원" />
        <KpiCard title="무료 비중" value={kpi && formatPercent(kpi.freeEntryRatio)} icon={BarChart3} loading={isLoading} description="기본 참여 중심" />
        <KpiCard title="추가 참여 비중" value={kpi && formatPercent(kpi.extraEntryRatio)} icon={Gift} loading={isLoading} description="보상형 참여 유도" />
        <KpiCard title="리퍼럴 성공률" value={kpi && formatPercent(kpi.referralSuccessRate)} icon={Share2} loading={isLoading} description="친구 초대 전환" />
        <KpiCard title="당첨자 수" value={kpi && formatNumber(kpi.winnerCount)} icon={Trophy} loading={isLoading} description="전체 당첨 처리" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardDescription>14일 시계열</CardDescription>
            <CardTitle>일자별 성과 추이</CardTitle>
          </CardHeader>
          <CardContent>
            {!points.length && !isLoading ? (
              <EmptyState title="표시할 추이 데이터가 없습니다." />
            ) : (
              <ChartMount className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="overviewVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="overviewParticipants" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => formatNumber(Number(value ?? 0))} />
                    <Area type="monotone" dataKey="visits" stroke="hsl(var(--chart-1))" fill="url(#overviewVisits)" strokeWidth={2} />
                    <Area type="monotone" dataKey="participants" stroke="hsl(var(--chart-2))" fill="url(#overviewParticipants)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartMount>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>구성 비율</CardDescription>
            <CardTitle>참여 믹스 스냅샷</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartMount className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mixData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                    {mixData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value ?? 0))} contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </ChartMount>
            <div className="space-y-2">
              {mixData.map((item, index) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium tabular-nums">{formatNumber(item.value)}</span>
                  </div>
                  <div className="h-1.5 rounded-sm bg-muted">
                    <div className="h-full rounded-sm" style={{ width: `${Math.min((item.value / Math.max(kpi?.totalParticipants ?? 1, 1)) * 100, 100)}%`, backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>세부 로그</CardDescription>
          <CardTitle>일자별 세부 지표</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2">
          <ChartMount className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={points} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => formatNumber(Number(value ?? 0))} />
                <Bar dataKey="referrals" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="adWatches" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartMount>

          <div className="overflow-hidden rounded-md border border-border">
            {!points.length && !isLoading ? (
              <div className="p-4">
                <EmptyState title="표시할 일자별 데이터가 없습니다." />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>일자</TableHead>
                    <TableHead>방문</TableHead>
                    <TableHead>참여</TableHead>
                    <TableHead>리퍼럴</TableHead>
                    <TableHead>광고 시청</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {points.map((point) => (
                    <TableRow key={point.date}>
                      <TableCell className="font-medium">{point.date}</TableCell>
                      <TableCell className="tabular-nums">{formatNumber(point.visits)}</TableCell>
                      <TableCell className="tabular-nums">{formatNumber(point.participants)}</TableCell>
                      <TableCell className="tabular-nums">{formatNumber(point.referrals)}</TableCell>
                      <TableCell className="tabular-nums">{formatNumber(point.adWatches)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
