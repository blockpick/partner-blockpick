"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ShieldCheck, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChartMount } from "@/components/charts/chart-mount";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useReferralAnalytics } from "@/lib/hooks/use-analytics";
import { formatNumber, formatPercent } from "@/lib/format";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  fontSize: 12,
};

export default function ReferralAnalyticsPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const selectedBlockpickId = blockpickId === "all" ? undefined : blockpickId;
  const { data } = useReferralAnalytics(selectedBlockpickId);
  const funnel = data?.funnel ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="친구 초대 성과"
        description="리퍼럴 퍼널과 부정 초대 차단 흐름을 정리합니다."
      />

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-1.5">
            <Label>블록픽</Label>
            <BlockpickSelect value={blockpickId} onChange={setBlockpickId} />
          </div>
        </CardContent>
      </Card>

      {!data ? (
        <EmptyState title="리퍼럴 데이터가 없습니다." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              icon={UsersRound}
              label="퍼널 최종 전환"
              value={formatPercent(funnel.at(-1)?.rate ?? 0)}
              description="첫 초대 이후 최종 보상 도달 비율"
            />
            <MetricCard
              icon={ShieldCheck}
              label="이상 초대 차단율"
              value={formatPercent(data.abuseBlockedRate)}
              description={`차단 ${formatNumber(data.abuseBlockedCount)}건`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardDescription>리퍼럴 단계별 흐름</CardDescription>
                <CardTitle>리퍼럴 퍼널</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartMount className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnel} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="step" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => formatNumber(Number(value ?? 0))} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {funnel.map((item, index) => (
                          <Cell key={item.step} fill={`hsl(var(--chart-${(index % 4) + 1}))`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartMount>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>전환 사다리</CardDescription>
                <CardTitle>단계별 보존율</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {funnel.map((step, index) => (
                  <div key={step.step} className="space-y-2 rounded-md border border-border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{step.step}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          누적 {formatNumber(step.count)}건
                        </p>
                      </div>
                      <span className="text-lg font-semibold tabular-nums">
                        {formatPercent(step.rate)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-sm bg-muted">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${Math.min(step.rate * 100, 100)}%`,
                          backgroundColor: `hsl(var(--chart-${(index % 4) + 1}))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between pt-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
