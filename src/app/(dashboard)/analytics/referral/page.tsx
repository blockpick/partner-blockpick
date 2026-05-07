"use client";

import { useReferralAnalytics } from "@/lib/hooks/use-analytics";
import { KpiCard } from "@/components/analytics/kpi-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function AnalyticsReferralPage() {
  const { data, isLoading } = useReferralAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">친구초대 분석</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          초대 발송부터 보상 지급까지의 전환 퍼널을 분석합니다
        </p>
      </div>

      {/* 퍼널 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">전환 퍼널</CardTitle>
          <CardDescription>
            각 단계별 전환 수와 이전 단계 대비 전환율
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {data?.funnel.map((step, idx) => (
                <div key={step.step} className="flex items-center gap-3">
                  {idx > 0 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 -ml-1" />
                  )}
                  <div
                    className="flex-1 rounded-lg border bg-muted/30 px-4 py-3"
                    style={{ marginLeft: idx > 0 ? 0 : undefined }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{step.step}</p>
                        <p className="text-2xl font-bold mt-0.5">
                          {step.count.toLocaleString()}
                        </p>
                      </div>
                      {idx > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">전환율</p>
                          <p className="text-lg font-semibold text-primary">
                            {(step.rate * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>
                    {/* 퍼널 바 */}
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${step.rate * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 어뷰징 통계 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard
          title="어뷰징 차단 건수"
          value={data?.abuseBlockedCount.toLocaleString()}
          icon={AlertTriangle}
          loading={isLoading}
          description="누적 차단"
        />
        <KpiCard
          title="어뷰징 차단율"
          value={
            data
              ? `${(data.abuseBlockedRate * 100).toFixed(1)}%`
              : undefined
          }
          icon={AlertTriangle}
          loading={isLoading}
          description="전체 초대 대비"
        />
      </div>
    </div>
  );
}
