"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight } from "lucide-react";
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
import { useByBlockpickAnalytics } from "@/lib/hooks/use-analytics";
import { formatNumber, formatPercent } from "@/lib/format";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  fontSize: 12,
};

export default function AnalyticsByBlockpickPage() {
  const { data, isLoading } = useByBlockpickAnalytics();
  const items = data ?? [];
  const chartData = items.map((item) => ({
    name:
      item.blockpickTitle.length > 12
        ? `${item.blockpickTitle.slice(0, 12)}…`
        : item.blockpickTitle,
    participants: item.participants,
    winners: item.winnerCount,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="블록픽별 성과"
        description="캠페인별 볼륨과 전환 효율을 한 화면에서 비교합니다."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>참여 규모 비교</CardDescription>
            <CardTitle>캠페인 볼륨 랭킹</CardTitle>
          </CardHeader>
          <CardContent>
            {!chartData.length && !isLoading ? (
              <EmptyState title="집계된 블록픽 성과가 없습니다." />
            ) : (
              <ChartMount className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => formatNumber(Number(value ?? 0))} />
                    <Bar dataKey="participants" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="winners" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartMount>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>효율 비교</CardDescription>
            <CardTitle>완주율 순위</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!items.length && !isLoading ? (
              <EmptyState title="집계된 블록픽 성과가 없습니다." />
            ) : (
              items.map((item, index) => (
                <div key={item.blockpickId} className="space-y-2 rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.blockpickTitle}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        참여 {formatNumber(item.participants)}명 · 당첨자{" "}
                        {formatNumber(item.winnerCount)}명
                      </p>
                    </div>
                    <span className="text-base font-semibold tabular-nums">
                      {formatPercent(item.completionRate)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-sm bg-muted">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${Math.min(item.completionRate * 100, 100)}%`,
                        backgroundColor: `hsl(var(--chart-${(index % 4) + 1}))`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>추가 참여 비중 {formatPercent(item.extraEntryRatio)}</span>
                    <Link
                      href={`/blockpicks/${item.blockpickId}`}
                      className="inline-flex items-center gap-1 text-foreground hover:underline"
                    >
                      상세
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>비교 표</CardDescription>
          <CardTitle>블록픽 성과 비교</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!items.length && !isLoading ? (
            <div className="px-5 py-6">
              <EmptyState title="집계된 블록픽 성과가 없습니다." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>블록픽</TableHead>
                  <TableHead>참여자</TableHead>
                  <TableHead>완주율</TableHead>
                  <TableHead>추가 참여 비중</TableHead>
                  <TableHead>당첨자</TableHead>
                  <TableHead className="text-right">이동</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.blockpickId}>
                    <TableCell className="font-medium">{item.blockpickTitle}</TableCell>
                    <TableCell className="tabular-nums">{formatNumber(item.participants)}</TableCell>
                    <TableCell className="tabular-nums">{formatPercent(item.completionRate)}</TableCell>
                    <TableCell className="tabular-nums">{formatPercent(item.extraEntryRatio)}</TableCell>
                    <TableCell className="tabular-nums">{formatNumber(item.winnerCount)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/blockpicks/${item.blockpickId}`} className="inline-flex">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
