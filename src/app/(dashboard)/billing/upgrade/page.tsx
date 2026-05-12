"use client";

import { Check } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAvailablePlans,
  useChangePlan,
  useMyPlan,
} from "@/lib/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

export default function BillingUpgradePage() {
  const { data: plans, isLoading } = useAvailablePlans();
  const { data: current } = useMyPlan();
  const change = useChangePlan();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="플랜 변경"
          description="필요한 기능과 한도에 맞춰 요금제를 변경합니다."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const items = plans ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="플랜 변경"
        description="필요한 기능과 한도에 맞춰 요금제를 변경합니다."
      />

      {!items.length ? (
        <EmptyState
          title="이용 가능한 플랜이 없어요"
          description="잠시 후 다시 시도해 주세요."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((plan) => {
            const isCurrent = current?.plan.id === plan.id;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col",
                  isCurrent && "border-foreground/40 ring-1 ring-foreground/10"
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardDescription>
                        {plan.description ?? "월 요금제"}
                      </CardDescription>
                      <CardTitle>{plan.name}</CardTitle>
                    </div>
                    {isCurrent && <Badge variant="success">현재 플랜</Badge>}
                  </div>
                  <div className="pt-2">
                    <span className="text-3xl font-semibold tracking-tight tabular-nums">
                      {formatCurrency(plan.priceMonthly)}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">/월</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <ul className="flex-1 space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--success))]" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || change.isPending}
                    onClick={() => change.mutate(plan.id)}
                  >
                    {isCurrent
                      ? "사용 중"
                      : change.isPending
                      ? "변경 중..."
                      : "이 플랜으로 변경"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col items-start gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">엔터프라이즈 플랜이 필요하세요?</p>
            <p className="text-xs text-muted-foreground">
              대용량 캠페인이나 커스텀 통합이 필요하면 영업팀에 문의해주세요.
            </p>
          </div>
          <Button variant="outline" size="sm">
            영업 문의하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
