"use client";

import Link from "next/link";
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
import { useCancelSubscription, useMyPlan } from "@/lib/hooks/use-subscription";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "활성",
  PAUSED: "일시 정지",
  CANCELLED: "해지",
  TRIALING: "체험중",
  PAST_DUE: "결제 실패",
};

const STATUS_VARIANT: Record<
  string,
  "success" | "warning" | "destructive" | "secondary" | "outline"
> = {
  ACTIVE: "success",
  TRIALING: "info" as never,
  PAUSED: "warning",
  PAST_DUE: "destructive",
  CANCELLED: "secondary",
};

export default function BillingPlanPage() {
  const { data, isLoading } = useMyPlan();
  const cancel = useCancelSubscription();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="현재 플랜" description="구독 상태와 청구 주기를 확인합니다." />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="현재 플랜" description="구독 상태와 청구 주기를 확인합니다." />
        <EmptyState
          title="구독 정보가 없어요"
          description="요금제를 선택하면 이곳에 플랜 정보가 표시됩니다."
          action={
            <Link href="/billing/upgrade">
              <Button size="sm">플랜 둘러보기</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="현재 플랜"
        description="구독 상태와 청구 주기를 확인합니다."
        actions={
          <>
            <Link href="/billing/upgrade">
              <Button size="sm">플랜 변경</Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => cancel.mutate()}
              disabled={cancel.isPending || data.cancelAtPeriodEnd}
            >
              {data.cancelAtPeriodEnd ? "해지 예정" : "구독 종료 예약"}
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <CardDescription>현재 사용 중</CardDescription>
              <CardTitle className="text-xl">{data.plan.name}</CardTitle>
            </div>
            <Badge variant={STATUS_VARIANT[data.status] ?? "outline"}>
              {STATUS_LABEL[data.status] ?? data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <InfoRow
            label="월 요금"
            value={formatCurrency(data.plan.priceMonthly)}
          />
          <InfoRow
            label="다음 결제일"
            value={formatDate(data.currentPeriodEnd)}
          />
          <InfoRow
            label="현재 기간 시작"
            value={formatDate(data.currentPeriodStart)}
          />
          <InfoRow
            label="기간 종료 시 해지"
            value={data.cancelAtPeriodEnd ? "예정됨" : "유지"}
            warn={data.cancelAtPeriodEnd}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>포함 기능</CardDescription>
          <CardTitle className="text-base">플랜 제공 기능</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {data.plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">더 큰 한도가 필요하세요?</p>
            <p className="text-xs text-muted-foreground">
              상위 플랜으로 변경하면 더 많은 캠페인과 팀 멤버를 운영할 수 있어요.
            </p>
          </div>
          <Link href="/billing/upgrade">
            <Button variant="outline" size="sm">
              플랜 비교 보기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="space-y-1 border-b border-border py-2 last:border-0 sm:border-0 sm:py-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={
          warn ? "font-medium text-[hsl(var(--warning))]" : "font-medium"
        }
      >
        {value}
      </p>
    </div>
  );
}
