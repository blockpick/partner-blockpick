"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartMount } from "@/components/charts/chart-mount";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BlockpickSelect } from "@/components/operations/blockpick-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useChannelAnalytics } from "@/lib/hooks/use-analytics";
import { formatNumber, formatPercent } from "@/lib/format";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--background))",
  fontSize: 12,
};

const CHANNEL_LABEL: Record<string, string> = {
  organic: "Organic",
  social: "Social",
  email: "Email",
  push: "Push",
  paid: "Paid",
};

export default function ChannelsAnalyticsPage() {
  const [blockpickId, setBlockpickId] = useState("all");
  const selectedBlockpickId = blockpickId === "all" ? undefined : blockpickId;
  const { data } = useChannelAnalytics(selectedBlockpickId);
  const items = data?.stats ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="유입 채널 분석"
        description="채널별 트래픽과 실제 참여 전환을 함께 비교합니다."
      />

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-1.5">
            <Label>블록픽</Label>
            <BlockpickSelect value={blockpickId} onChange={setBlockpickId} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>채널별 볼륨 비교</CardDescription>
            <CardTitle>방문 vs 참여</CardTitle>
          </CardHeader>
          <CardContent>
            {!items.length ? (
              <EmptyState title="채널 데이터가 없습니다." />
            ) : (
              <ChartMount className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={items} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="channel" tickFormatter={(value) => CHANNEL_LABEL[value] ?? value} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => formatNumber(Number(value ?? 0))} />
                    <Bar dataKey="visits" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="participants" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartMount>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>전환 효율</CardDescription>
            <CardTitle>전환율 랭킹</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!items.length ? (
              <EmptyState title="채널 데이터가 없습니다." />
            ) : (
              items.map((item, index) => (
                <div key={item.channel} className="space-y-2 rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{CHANNEL_LABEL[item.channel] ?? item.channel}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        방문 {formatNumber(item.visits)}회 · 참여 {formatNumber(item.participants)}명
                      </p>
                    </div>
                    <span className="text-lg font-semibold tabular-nums">
                      {formatPercent(item.conversionRate)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-sm bg-muted">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${Math.min(item.conversionRate * 100, 100)}%`,
                        backgroundColor: `hsl(var(--chart-${(index % 4) + 1}))`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>원본 데이터</CardDescription>
          <CardTitle>채널별 세부 수치</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!items.length ? (
            <div className="px-5 py-6">
              <EmptyState title="채널 데이터가 없습니다." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>채널</TableHead>
                  <TableHead>방문</TableHead>
                  <TableHead>참여</TableHead>
                  <TableHead>전환율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.channel}>
                    <TableCell className="font-medium">{CHANNEL_LABEL[item.channel] ?? item.channel}</TableCell>
                    <TableCell className="tabular-nums">{formatNumber(item.visits)}</TableCell>
                    <TableCell className="tabular-nums">{formatNumber(item.participants)}</TableCell>
                    <TableCell className="tabular-nums">{formatPercent(item.conversionRate)}</TableCell>
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
