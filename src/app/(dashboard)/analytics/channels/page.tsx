"use client";

import { useChannelAnalytics } from "@/lib/hooks/use-analytics";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { UtmChannel } from "@/lib/types/analytics";

const CHANNEL_LABEL: Record<UtmChannel, string> = {
  organic: "자연 유입",
  social: "소셜",
  email: "이메일",
  push: "푸시 알림",
  paid: "유료 광고",
};

const CHANNEL_COLOR: Record<UtmChannel, string> = {
  organic: "#6366f1",
  social: "#22c55e",
  email: "#f59e0b",
  push: "#ec4899",
  paid: "#8b5cf6",
};

export default function AnalyticsChannelsPage() {
  const { data, isLoading } = useChannelAnalytics();
  const stats = data?.stats ?? [];

  const maxVisits = Math.max(...stats.map((s) => s.visits), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">유입 채널 분석</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          UTM 채널별 유입 수와 전환율을 확인합니다
        </p>
      </div>

      {/* 바 차트 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">채널별 방문 / 참여 비교</CardTitle>
          <CardDescription>채널별 방문 수와 실제 참여 수 비교</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={stats.map((s) => ({
                  ...s,
                  name: CHANNEL_LABEL[s.channel],
                }))}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={50} />
                <Tooltip
                  formatter={(value: unknown, name: unknown) => {
                    const labels: Record<string, string> = {
                      visits: "방문",
                      participants: "참여",
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
                    };
                    return labels[value] ?? value;
                  }}
                />
                <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="participants" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 상세 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">채널별 상세 지표</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>채널</TableHead>
                  <TableHead className="text-right">방문 수</TableHead>
                  <TableHead>방문 비중</TableHead>
                  <TableHead className="text-right">참여 수</TableHead>
                  <TableHead>전환율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : stats.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.map((s) => (
                    <TableRow key={s.channel}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: CHANNEL_COLOR[s.channel] }}
                          />
                          <Badge variant="outline" className="font-normal">
                            {CHANNEL_LABEL[s.channel]}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {s.visits.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(s.visits / maxVisits) * 100}
                            className="w-20 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-10">
                            {((s.visits / maxVisits) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {s.participants.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={s.conversionRate * 100}
                            className="w-20 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-10">
                            {(s.conversionRate * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
