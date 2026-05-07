"use client";

import Link from "next/link";
import { useBlockpickKpi, useMyBlockpicks } from "@/lib/hooks/use-my-blockpicks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Eye,
  TrendingUp,
  Share2,
  Play,
  Plus,
  ArrowRight,
} from "lucide-react";

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
}: {
  title: string;
  value?: string | number;
  description?: string;
  icon: React.ElementType;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value ?? "-"}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "진행중",
  SCHEDULED: "예약됨",
  DRAFT: "임시저장",
  ENDED: "종료됨",
  CANCELLED: "취소됨",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  SCHEDULED: "secondary",
  DRAFT: "outline",
  ENDED: "secondary",
  CANCELLED: "destructive",
};

export default function HomePage() {
  const { data: kpi, isLoading: kpiLoading } = useBlockpickKpi();
  const { data: blockpicks, isLoading: listLoading } = useMyBlockpicks({
    status: "ACTIVE",
    pageSize: 5,
  });

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">홈</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            전체 캠페인 현황을 한눈에 확인하세요
          </p>
        </div>
        <Link href="/blockpicks/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            새 블록픽 만들기
          </Button>
        </Link>
      </div>

      {/* KPI 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="총 방문 수"
          value={kpi?.totalVisits.toLocaleString()}
          icon={Eye}
          loading={kpiLoading}
          description="전체 누적"
        />
        <KpiCard
          title="총 참여 수"
          value={kpi?.totalParticipants.toLocaleString()}
          icon={Users}
          loading={kpiLoading}
          description="전체 누적"
        />
        <KpiCard
          title="전환율"
          value={kpi ? `${(kpi.conversionRate * 100).toFixed(1)}%` : undefined}
          icon={TrendingUp}
          loading={kpiLoading}
          description="무료→추가 참여"
        />
        <KpiCard
          title="친구 초대"
          value={kpi?.referralCount.toLocaleString()}
          icon={Share2}
          loading={kpiLoading}
          description="전체 누적"
        />
        <KpiCard
          title="광고 시청"
          value={kpi?.adWatchCount.toLocaleString()}
          icon={Play}
          loading={kpiLoading}
          description="전체 누적"
        />
        <KpiCard
          title="진행중 블록픽"
          value={kpi?.activeBlockpickCount}
          icon={TrendingUp}
          loading={kpiLoading}
          description="현재 활성"
        />
      </div>

      {/* 진행중 블록픽 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">진행중 블록픽</CardTitle>
            <CardDescription>현재 참여 가능한 캠페인</CardDescription>
          </div>
          <Link href="/blockpicks?status=ACTIVE">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              전체 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {listLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !blockpicks?.items.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground">
                진행중인 블록픽이 없습니다
              </p>
              <Link href="/blockpicks/new" className="mt-3">
                <Button size="sm" variant="outline">
                  첫 번째 블록픽 만들기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {blockpicks.items.map((bp) => (
                <Link
                  key={bp.id}
                  href={`/blockpicks/${bp.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{bp.title}</p>
                    <p className="text-xs text-muted-foreground">
                      참여 {bp.totalParticipants.toLocaleString()}명 · 방문{" "}
                      {bp.totalVisits.toLocaleString()}회
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANT[bp.status] ?? "outline"}>
                      {STATUS_LABEL[bp.status] ?? bp.status}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 빠른 실행 버튼 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "당첨자 관리", href: "/operations/winners" },
          { label: "전체 성과 분석", href: "/analytics/overview" },
          { label: "현재 플랜 확인", href: "/billing/plan" },
          { label: "브랜드 설정", href: "/brand/info" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="outline" className="w-full justify-start gap-2 text-sm">
              <ArrowRight className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
