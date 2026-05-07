"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMyPlan, useCancelSubscription } from "@/lib/hooks/use-subscription";
import { PLAN_TIER_LABELS } from "@/lib/types/plan";
import { CheckCircle2, AlertCircle, CreditCard, CalendarDays } from "lucide-react";
import Link from "next/link";

const STATUS_MAP = {
  ACTIVE: { label: "이용 중", variant: "default" as const },
  PAST_DUE: { label: "결제 실패", variant: "destructive" as const },
  CANCELLED: { label: "해지됨", variant: "secondary" as const },
  TRIALING: { label: "체험 중", variant: "outline" as const },
};

export default function BillingPlanPage() {
  const { data: subscription, isLoading } = useMyPlan();
  const cancel = useCancelSubscription();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-4 w-56" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!subscription) return null;

  const { plan, status, currentPeriodEnd, cancelAtPeriodEnd } = subscription;
  const statusInfo = STATUS_MAP[status];
  const periodEnd = new Date(currentPeriodEnd);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">현재 요금제</h1>
        <p className="text-sm text-muted-foreground">구독 중인 플랜과 결제 현황을 확인합니다</p>
      </div>

      {/* 현재 플랜 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {PLAN_TIER_LABELS[plan.tier]} 플랜
              </CardTitle>
              <CardDescription className="mt-1">
                월{" "}
                <span className="text-lg font-bold text-foreground">
                  {plan.priceMonthly.toLocaleString()}원
                </span>
              </CardDescription>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {cancelAtPeriodEnd && (
            <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                구독이 해지 예약되어 있습니다. {format(periodEnd, "M월 d일", { locale: ko })}까지
                이용 가능합니다.
              </span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">다음 결제일</p>
                <p className="font-medium">
                  {cancelAtPeriodEnd
                    ? "갱신 안 함"
                    : format(periodEnd, "yyyy년 M월 d일", { locale: ko })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">결제 금액</p>
                <p className="font-medium">
                  {cancelAtPeriodEnd ? "-" : `${plan.priceMonthly.toLocaleString()}원`}
                </p>
              </div>
            </div>
          </div>

          {/* 포함 기능 */}
          <div>
            <p className="mb-2 text-sm font-medium">포함 기능</p>
            <ul className="space-y-1.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/billing/upgrade">플랜 변경</Link>
        </Button>
        {!cancelAtPeriodEnd && status === "ACTIVE" && (
          <Button variant="outline" onClick={() => setCancelDialogOpen(true)}>
            구독 해지
          </Button>
        )}
        <Button variant="ghost" asChild>
          <Link href="/billing/payment">결제 수단 관리</Link>
        </Button>
      </div>

      {/* 해지 확인 다이얼로그 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>구독을 해지하시겠습니까?</DialogTitle>
            <DialogDescription>
              {format(periodEnd, "yyyy년 M월 d일", { locale: ko })}까지는 서비스를 계속
              이용할 수 있습니다. 이후 자동으로 해지됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={cancel.isPending}
              onClick={() => {
                cancel.mutate(undefined, {
                  onSuccess: () => setCancelDialogOpen(false),
                });
              }}
            >
              {cancel.isPending ? "처리 중..." : "구독 해지"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
