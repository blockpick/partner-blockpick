"use client";

import { useState } from "react";
import {
  useByBlockpickAnalytics,
  useBlockpickDetailAnalytics,
} from "@/lib/hooks/use-analytics";
import { KpiCard } from "@/components/analytics/kpi-card";
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
import { Users, Eye, Trophy, TrendingUp } from "lucide-react";

export default function AnalyticsByBlockpickPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: list, isLoading } = useByBlockpickAnalytics();
  const { data: detail, isLoading: detailLoading } = useBlockpickDetailAnalytics(
    selectedId ?? "",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">블록픽별 성과</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          블록픽을 선택하면 상세 KPI를 확인할 수 있습니다
        </p>
      </div>

      {/* 블록픽 KPI 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">블록픽별 KPI</CardTitle>
          <CardDescription>행을 클릭하면 상세 KPI를 확인합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>블록픽</TableHead>
                  <TableHead className="text-right">참여자</TableHead>
                  <TableHead>완료율</TableHead>
                  <TableHead className="text-right">당첨자</TableHead>
                  <TableHead>추가참여 비율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !list?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      데이터가 없습니다
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((bp) => (
                    <TableRow
                      key={bp.blockpickId}
                      className={`cursor-pointer transition-colors ${
                        selectedId === bp.blockpickId ? "bg-muted/60" : "hover:bg-muted/30"
                      }`}
                      onClick={() =>
                        setSelectedId(
                          selectedId === bp.blockpickId ? null : bp.blockpickId,
                        )
                      }
                    >
                      <TableCell className="font-medium">
                        {bp.blockpickTitle}
                      </TableCell>
                      <TableCell className="text-right">
                        {bp.participants.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={bp.completionRate * 100}
                            className="w-20 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-10">
                            {(bp.completionRate * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {bp.winnerCount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={bp.extraEntryRatio * 100}
                            className="w-20 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-10">
                            {(bp.extraEntryRatio * 100).toFixed(0)}%
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

      {/* 상세 KPI 카드 */}
      {selectedId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {detail?.blockpickTitle ?? "상세 KPI"}
            </CardTitle>
            <CardDescription>선택된 블록픽의 상세 성과 지표</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                title="방문 수"
                value={detail?.visits.toLocaleString()}
                icon={Eye}
                loading={detailLoading}
              />
              <KpiCard
                title="참여 수"
                value={detail?.participants.toLocaleString()}
                icon={Users}
                loading={detailLoading}
              />
              <KpiCard
                title="당첨자"
                value={detail?.winnerCount.toLocaleString()}
                icon={Trophy}
                loading={detailLoading}
              />
              <KpiCard
                title="추가 참여 비율"
                value={
                  detail
                    ? `${(detail.extraEntryRatio * 100).toFixed(1)}%`
                    : undefined
                }
                icon={TrendingUp}
                loading={detailLoading}
              />
              <KpiCard
                title="무료 참여권"
                value={detail?.freeEntryCount.toLocaleString()}
                loading={detailLoading}
              />
              <KpiCard
                title="추가 참여권"
                value={detail?.extraEntryCount.toLocaleString()}
                loading={detailLoading}
              />
              <KpiCard
                title="친구초대"
                value={detail?.referralCount.toLocaleString()}
                loading={detailLoading}
              />
              <KpiCard
                title="광고 시청"
                value={detail?.adWatchCount.toLocaleString()}
                loading={detailLoading}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
