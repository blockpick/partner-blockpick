"use client";

import { useState } from "react";
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
import {
  useMyPlan,
  useAvailablePlans,
  useChangePlan,
} from "@/lib/hooks/use-subscription";
import { PLAN_TIER_LABELS } from "@/lib/types/plan";
import type { Plan } from "@/lib/types/plan";
import { Check, Zap } from "lucide-react";

const PLAN_ORDER = ["STARTER", "GROWTH", "PRO"] as const;

const COMPARISON_ROWS = [
  {
    label: "월 블록픽 생성",
    key: "monthlyBlockpicks",
    format: (v: number) => (v === -1 ? "무제한" : `${v}개`),
  },
  {
    label: "월 참여자",
    key: "monthlyParticipants",
    format: (v: number) => (v === -1 ? "무제한" : `${v.toLocaleString()}명`),
  },
  {
    label: "그리드 크기",
    key: "gridSize",
    format: (v: number) => (v === -1 ? "무제한" : `최대 ${v}칸`),
  },
  {
    label: "팀 멤버",
    key: "teamMembers",
    format: (v: number) => (v === -1 ? "무제한" : `${v}명`),
  },
  {
    label: "스토리지",
    key: "storageGb",
    format: (v: number) => (v === -1 ? "무제한" : `${v}GB`),
  },
] as const;

export default function BillingUpgradePage() {
  const { data: subscription, isLoading: subLoading } = useMyPlan();
  const { data: plans, isLoading: plansLoading } = useAvailablePlans();
  const changePlan = useChangePlan();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (subLoading || plansLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const currentTier = subscription?.plan.tier;
  const orderedPlans = PLAN_ORDER.map((tier) =>
    plans?.find((p) => p.tier === tier),
  ).filter(Boolean) as Plan[];

  const handleSelectPlan = (plan: Plan) => {
    if (plan.tier === currentTier) return;
    setSelectedPlan(plan);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;
    changePlan.mutate(selectedPlan.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        setSelectedPlan(null);
      },
    });
  };

  const tierIndex = (tier: string) => PLAN_ORDER.indexOf(tier as (typeof PLAN_ORDER)[number]);
  const currentIndex = currentTier ? tierIndex(currentTier) : -1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">플랜 변경</h1>
        <p className="text-sm text-muted-foreground">
          현재 플랜:{" "}
          <span className="font-semibold text-foreground">
            {currentTier ? PLAN_TIER_LABELS[currentTier] : "-"}
          </span>
        </p>
      </div>

      {/* 플랜 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        {orderedPlans.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const planIdx = tierIndex(plan.tier);
          const isUpgrade = planIdx > currentIndex;
          const isDowngrade = planIdx < currentIndex;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.tier === "GROWTH"
                  ? "border-primary shadow-md"
                  : ""
              } ${isCurrent ? "opacity-75" : ""}`}
            >
              {plan.tier === "GROWTH" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 px-3">
                    <Zap className="h-3 w-3" />
                    인기
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle>{PLAN_TIER_LABELS[plan.tier]}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    {plan.priceMonthly.toLocaleString()}
                  </span>
                  원/월
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      현재 플랜
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={isUpgrade ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {isUpgrade ? "업그레이드" : isDowngrade ? "다운그레이드" : "선택"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 비교 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>플랜 상세 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">항목</th>
                  {orderedPlans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`pb-3 text-center font-semibold ${
                        plan.tier === currentTier ? "text-primary" : ""
                      }`}
                    >
                      {PLAN_TIER_LABELS[plan.tier]}
                      {plan.tier === currentTier && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">(현재)</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(({ label, key, format }) => (
                  <tr key={key} className="border-b last:border-0">
                    <td className="py-3 text-muted-foreground">{label}</td>
                    {orderedPlans.map((plan) => (
                      <td key={plan.id} className="py-3 text-center font-medium">
                        {format(plan.limits[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 엔터프라이즈 CTA */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <p className="font-semibold">엔터프라이즈 플랜이 필요하신가요?</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              전용 인프라, SLA, 맞춤 개발이 포함된 연간 계약 플랜입니다. 영업팀에 문의해주세요.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="mailto:sales@blockpick.co.kr">영업팀 문의</a>
          </Button>
        </CardContent>
      </Card>

      {/* 플랜 변경 확인 다이얼로그 */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>플랜을 변경하시겠습니까?</DialogTitle>
            <DialogDescription>
              {selectedPlan && currentTier && (
                <>
                  <span className="font-semibold">{PLAN_TIER_LABELS[currentTier]}</span>에서{" "}
                  <span className="font-semibold">{PLAN_TIER_LABELS[selectedPlan.tier]}</span>
                  으로 변경합니다.{" "}
                  {tierIndex(selectedPlan.tier) > currentIndex
                    ? "변경 즉시 적용되며, 남은 기간은 일할 계산됩니다."
                    : "다음 결제일부터 적용됩니다."}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">{PLAN_TIER_LABELS[selectedPlan.tier]} 플랜</p>
              <p className="mt-0.5 text-xl font-bold">
                월 {selectedPlan.priceMonthly.toLocaleString()}원
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
            <Button onClick={handleConfirm} disabled={changePlan.isPending}>
              {changePlan.isPending ? "처리 중..." : "변경 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
