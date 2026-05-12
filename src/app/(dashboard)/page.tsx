"use client";

import Link from "next/link";
import { useState } from "react";
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
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CreditCard,
  Eye,
  Gauge,
  Plus,
  Share2,
  Sparkles,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  useBlockpickKpi,
  useMyBlockpicks,
} from "@/lib/hooks/use-my-blockpicks";
import { useOverviewAnalytics } from "@/lib/hooks/use-analytics";
import { useMyPlan, useUsage } from "@/lib/hooks/use-subscription";
import { BlockpickCard } from "@/components/blockpicks/blockpick-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiCard } from "@/components/analytics/kpi-card";
import { ChartMount } from "@/components/charts/chart-mount";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { clampPercent, formatDate, formatNumber, formatPercent } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "진행중",
  SCHEDULED: "예약됨",
  DRAFT: "임시저장",
  ENDED: "종료됨",
  CANCELLED: "취소됨",
};

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive" | "success" | "warning"
> = {
  ACTIVE: "success",
  SCHEDULED: "info" as never,
  DRAFT: "outline",
  ENDED: "secondary",
  CANCELLED: "destructive",
};

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  fontSize: 12,
};

const PERIOD_OPTIONS = [
  { value: "7d", label: "최근 7일" },
  { value: "14d", label: "최근 14일" },
  { value: "30d", label: "최근 30일" },
];

export default function HomePage() {
  const [period, setPeriod] = useState("14d");
  const { data: kpi, isLoading: kpiLoading } = useBlockpickKpi();
  const { data: blockpicks, isLoading: listLoading } = useMyBlockpicks({
    pageSize: 5,
  });
  const { data: overview, isLoading: overviewLoading } =
    useOverviewAnalytics();
  const { data: usage } = useUsage();
  const { data: plan } = useMyPlan();

  const monthlyUsage = usage?.monthlyParticipants;
  const monthlyUsageRatio =
    monthlyUsage && monthlyUsage.limit > 0
      ? clampPercent((monthlyUsage.used / monthlyUsage.limit) * 100)
      : 0;

  const activeItems = blockpicks?.items ?? [];
  const trendData = overview?.timeSeries ?? [];
  const entryMix = [
    {
      name: "무료 참여",
      value: Math.max(
        (overview?.kpi.totalParticipants ?? 0) -
          (overview?.kpi.adWatchCount ?? 0),
        0
      ),
    },
    { name: "광고 참여", value: overview?.kpi.adWatchCount ?? 0 },
    { name: "리퍼럴", value: kpi?.referralCount ?? 0 },
  ].filter((item) => item.value > 0);

  const topPerformance = activeItems
    .map((item) => ({
      name: item.title.length > 10 ? `${item.title.slice(0, 10)}…` : item.title,
      participants: item.totalParticipants,
      visits: item.totalVisits,
    }))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="홈"
        description="캠페인 성과와 운영 흐름을 한눈에 확인합니다."
        actions={
          <>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/blockpicks/new">
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />새 블록픽 만들기
              </Button>
            </Link>
          </>
        }
      />

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          href="/blockpicks/new"
          icon={Plus}
          label="새 블록픽 만들기"
          hint="캠페인 생성"
          accent
        />
        <QuickAction
          href="/operations/winners"
          icon={Trophy}
          label="당첨자 관리"
          hint="지급 처리 대기"
        />
        <QuickAction
          href="/operations/referrals"
          icon={Share2}
          label="공유/리퍼럴"
          hint="링크와 성과 확인"
        />
        <QuickAction
          href="/billing/upgrade"
          icon={CreditCard}
          label="플랜 업그레이드"
          hint="더 많은 캠페인"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="진행중 블록픽"
          value={kpi?.activeBlockpickCount ?? "-"}
          icon={Sparkles}
          loading={kpiLoading}
          description="현재 활성 캠페인"
        />
        <KpiCard
          title="총 참여"
          value={formatNumber(kpi?.totalParticipants)}
          icon={Users}
          loading={kpiLoading}
          description="참여자 수 합계"
        />
        <KpiCard
          title="총 방문"
          value={formatNumber(kpi?.totalVisits)}
          icon={Eye}
          loading={kpiLoading}
          description="누적 방문"
        />
        <KpiCard
          title="전환율"
          value={formatPercent((kpi?.conversionRate ?? 0) / 100, {
            scale100: true,
          })}
          icon={TrendingUp}
          loading={kpiLoading}
          description="방문 → 참여"
        />
        <KpiCard
          title="친구 초대"
          value={formatNumber(kpi?.referralCount)}
          icon={Share2}
          loading={kpiLoading}
          description="리퍼럴 발생"
        />
        <UsageKpiCard
          ratio={monthlyUsageRatio}
          used={monthlyUsage?.used}
          limit={monthlyUsage?.limit}
        />
      </section>

      {plan && (
        <section className="rounded-md border border-border bg-card">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/10">
                <CalendarClock className="h-4 w-4 text-[hsl(var(--brand))]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">현재 플랜</p>
                <p className="text-sm font-medium">
                  {plan.plan.name} · 다음 결제일{" "}
                  <span className="tabular-nums">
                    {formatDate(plan.currentPeriodEnd)}
                  </span>
                </p>
              </div>
            </div>
            <Link href="/billing/upgrade">
              <Button variant="outline" size="sm" className="gap-1">
                플랜 변경
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardDescription>
              {PERIOD_OPTIONS.find((p) => p.value === period)?.label} 추이
            </CardDescription>
            <CardTitle>방문 vs 참여</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartMount className="h-[280px]">
              {overviewLoading ? (
                <Skeleton className="h-full w-full" />
              ) : trendData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="homeVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="homeParticipants" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => formatNumber(Number(value ?? 0))} />
                    <Area type="monotone" dataKey="visits" stroke="hsl(var(--chart-1))" fill="url(#homeVisits)" strokeWidth={2} />
                    <Area type="monotone" dataKey="participants" stroke="hsl(var(--chart-2))" fill="url(#homeParticipants)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="표시할 추이 데이터가 없습니다." />
              )}
            </ChartMount>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>참여 구성</CardDescription>
            <CardTitle>유입 채널 믹스</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartMount className="h-[200px]">
              {overviewLoading ? (
                <Skeleton className="h-full w-full" />
              ) : entryMix.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={entryMix} dataKey="value" nameKey="name" innerRadius={56} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                      {entryMix.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatNumber(Number(value ?? 0))} contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="표시할 참여 구성 데이터가 없습니다." />
              )}
            </ChartMount>

            <div className="space-y-1.5">
              {entryMix.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between py-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">{formatNumber(item.value)}</span>
                </div>
              ))}
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">추가 참여 전환율</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatPercent(overview?.kpi.extraEntryRatio ?? 0, { scale100: true })}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardDescription>운영중 캠페인</CardDescription>
              <CardTitle>진행중 블록픽</CardTitle>
            </div>
            <Link href="/blockpicks?status=ACTIVE">
              <Button variant="ghost" size="sm" className="gap-1">
                자세히
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {listLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : !activeItems.length ? (
              <EmptyState
                title="아직 만든 블록픽이 없어요"
                description="첫 번째 캠페인을 만들어보세요."
                action={
                  <Link href="/blockpicks/new">
                    <Button size="sm">첫 블록픽 만들기</Button>
                  </Link>
                }
              />
            ) : (
              activeItems.map((bp) => (
                <BlockpickCard key={bp.id} blockpick={bp} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>최근 운영 이슈</CardDescription>
            <CardTitle>알림</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationList kpi={kpi} overview={overview} />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardDescription>캠페인 비교</CardDescription>
              <CardTitle>상위 블록픽 성과</CardTitle>
            </div>
            <Link href="/analytics/by-blockpick">
              <Button variant="outline" size="sm" className="gap-1">
                전체 보기
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : topPerformance.length ? (
              <ChartMount className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPerformance} barGap={6} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => formatNumber(Number(value ?? 0))} />
                    <Bar dataKey="visits" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="participants" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartMount>
            ) : (
              <EmptyState
                title="비교할 블록픽이 없습니다."
                description="새 블록픽을 만들면 이 영역에 성과 비교가 나타납니다."
              />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function UsageKpiCard({
  ratio,
  used,
  limit,
}: {
  ratio: number;
  used?: number;
  limit?: number;
}) {
  const isUnlimited = limit !== undefined && limit < 0;
  const warn = !isUnlimited && ratio >= 80;
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-4 pb-2">
        <p className="text-sm font-medium text-muted-foreground">월 사용량</p>
        <Gauge className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-2 px-5 pb-4">
        <div className="text-2xl font-semibold tabular-nums">
          {used !== undefined ? formatNumber(used) : "-"}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            / {isUnlimited ? "무제한" : limit !== undefined ? formatNumber(limit) : "-"}
          </span>
        </div>
        {!isUnlimited && limit !== undefined && (
          <div className="h-1.5 overflow-hidden rounded-sm bg-muted">
            <div
              className="h-full rounded-sm transition-all"
              style={{
                width: `${ratio}%`,
                backgroundColor: warn
                  ? "hsl(var(--warning))"
                  : "hsl(var(--brand))",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  hint,
  accent,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "group flex items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-3 transition-colors hover:border-foreground/30 hover:bg-muted/40 " +
        (accent ? "border-foreground/20 bg-muted/50" : "")
      }
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
    </Link>
  );
}

function NotificationList({
  kpi,
  overview,
}: {
  kpi?: { activeBlockpickCount?: number };
  overview?: { kpi: { totalParticipants: number } };
}) {
  const items: Array<{
    type: "warning" | "info" | "success";
    title: string;
    desc: string;
    href?: string;
    cta?: string;
  }> = [];

  // 휴리스틱: 진행중 캠페인이 있으면 당첨자 후처리 안내
  if ((kpi?.activeBlockpickCount ?? 0) > 0) {
    items.push({
      type: "warning",
      title: "당첨자 수령 정보 확인",
      desc: "진행 중인 캠페인의 당첨자 처리 상태를 점검하세요.",
      href: "/operations/winners",
      cta: "당첨자 보기",
    });
  }

  // 참여자 일정 규모 이상일 때 공유 성과 안내
  if ((overview?.kpi.totalParticipants ?? 0) > 100) {
    items.push({
      type: "info",
      title: "공유 성과 점검",
      desc: "참여 규모가 100명을 넘었어요. 채널별 유입을 확인해 보세요.",
      href: "/analytics/channels",
      cta: "성과 보기",
    });
  }

  // 기본 안내
  items.push({
    type: "info",
    title: "플랜 사용량 점검",
    desc: "이번 달 사용량과 한도를 확인하세요.",
    href: "/billing/usage",
    cta: "사용량 보기",
  });

  if (!items.length) {
    return (
      <EmptyState
        title="새로운 알림이 없어요"
        description="운영 이슈가 발생하면 이곳에 표시됩니다."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {items.slice(0, 4).map((item, idx) => (
        <li
          key={idx}
          className="flex items-start gap-3 rounded-md border border-border p-3"
        >
          <span
            className={
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md " +
              (item.type === "warning"
                ? "bg-warning/10 text-[hsl(var(--warning))]"
                : item.type === "success"
                ? "bg-success/10 text-[hsl(var(--success))]"
                : "bg-info/10 text-[hsl(var(--info))]")
            }
          >
            <AlertCircle className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
            {item.href && item.cta && (
              <Link
                href={item.href}
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                {item.cta}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
