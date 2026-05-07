"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsage, useMyPlan } from "@/lib/hooks/use-subscription";
import { PLAN_TIER_LABELS } from "@/lib/types/plan";
import { Users, LayoutGrid, UserCheck, HardDrive } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 일자별 추이 목업 (백엔드 연동 전 placeholder)
const DAILY_TREND = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    participants: Math.floor(Math.random() * 300 + 50),
  };
});

interface UsageItemProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  limit: number;
  unit?: string;
  formatValue?: (v: number) => string;
}

function UsageItem({ icon, label, used, limit, unit = "개", formatValue }: UsageItemProps) {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const fmt = formatValue ?? ((v: number) => v.toLocaleString());
  const danger = pct >= 90;
  const warning = pct >= 70 && !danger;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {fmt(used)}{unit} / {isUnlimited ? "무제한" : `${fmt(limit)}${unit}`}
        </span>
      </div>
      <Progress
        value={isUnlimited ? 5 : pct}
        className={
          danger
            ? "[&>div]:bg-destructive"
            : warning
            ? "[&>div]:bg-orange-500"
            : ""
        }
      />
      {!isUnlimited && (
        <p className="text-right text-xs text-muted-foreground">
          {isUnlimited ? "무제한" : `${pct.toFixed(1)}% 사용`}
        </p>
      )}
    </div>
  );
}

export default function BillingUsagePage() {
  const { data: usage, isLoading: usageLoading } = useUsage();
  const { data: subscription } = useMyPlan();

  if (usageLoading || !usage) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-4 w-56" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">사용량</h1>
        <p className="text-sm text-muted-foreground">
          {subscription ? `${PLAN_TIER_LABELS[subscription.plan.tier]} 플랜 ` : ""}이번 달 사용
          현황을 확인합니다
        </p>
      </div>

      {/* 사용량 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>리소스 사용량</CardTitle>
          <CardDescription>현재 플랜 한도 대비 사용량입니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UsageItem
            icon={<Users className="h-4 w-4" />}
            label="월 참여자 수"
            used={usage.monthlyParticipants.used}
            limit={usage.monthlyParticipants.limit}
            unit="명"
          />
          <UsageItem
            icon={<LayoutGrid className="h-4 w-4" />}
            label="활성 블록픽"
            used={usage.activeBlockpicks.used}
            limit={usage.activeBlockpicks.limit}
            unit="개"
          />
          <UsageItem
            icon={<UserCheck className="h-4 w-4" />}
            label="팀 멤버"
            used={usage.teamMembers.used}
            limit={usage.teamMembers.limit}
            unit="명"
          />
          <UsageItem
            icon={<HardDrive className="h-4 w-4" />}
            label="스토리지"
            used={usage.storageGb.used}
            limit={usage.storageGb.limit}
            unit="GB"
            formatValue={(v) => v.toFixed(1)}
          />
        </CardContent>
      </Card>

      {/* 일자별 추이 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>일자별 참여자 추이</CardTitle>
          <CardDescription>최근 14일 일별 참여자 수</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY_TREND} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar dataKey="participants" name="참여자" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
