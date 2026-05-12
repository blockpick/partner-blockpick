"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlockpickStatusBadge } from "@/components/blockpicks/blockpick-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Users,
  Eye,
  Gift,
  Grid3X3,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import type { Blockpick } from "@/lib/types/blockpick";

const REWARD_TYPE_LABEL: Record<string, string> = {
  COUPON: "쿠폰",
  VOUCHER: "교환권",
  PHYSICAL: "실물 상품",
  POINT: "포인트",
};

function fmt(dateStr?: string) {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "yyyy.MM.dd HH:mm", { locale: ko });
  } catch {
    return dateStr;
  }
}

interface OverviewCardProps {
  blockpick?: Blockpick;
  isLoading?: boolean;
}

export function OverviewCard({ blockpick, isLoading }: OverviewCardProps) {
  if (isLoading || !blockpick) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const conversionRate =
    blockpick.totalVisits > 0
      ? ((blockpick.totalParticipants / blockpick.totalVisits) * 100).toFixed(1)
      : "0.0";

  const winProgress =
    blockpick.rewardQuantity && blockpick.totalParticipants > 0
      ? Math.min(
          Math.round((blockpick.rewardQuantity / blockpick.totalParticipants) * 100),
          100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          label="총 참여자"
          value={blockpick.totalParticipants.toLocaleString()}
          unit="명"
        />
        <KpiCard
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          label="총 방문"
          value={blockpick.totalVisits.toLocaleString()}
          unit="회"
        />
        <KpiCard
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          label="전환율"
          value={conversionRate}
          unit="%"
        />
        <KpiCard
          icon={<Gift className="h-4 w-4 text-muted-foreground" />}
          label="경품 수량"
          value={(blockpick.rewardQuantity ?? 0).toLocaleString()}
          unit="개"
        />
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">기본 정보</CardTitle>
            <BlockpickStatusBadge status={blockpick.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {blockpick.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={blockpick.thumbnailUrl}
                alt="썸네일"
                className="h-24 w-24 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Grid3X3 className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="space-y-1 min-w-0">
              <h3 className="font-semibold text-lg">{blockpick.title}</h3>
              {blockpick.partnerName && (
                <p className="text-sm text-muted-foreground">{blockpick.partnerName}</p>
              )}
              {blockpick.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blockpick.description}
                </p>
              )}
              {blockpick.landingUrl && (
                <a
                  href={blockpick.landingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  랜딩 페이지
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <InfoRow label="시작" value={fmt(blockpick.startAt)} />
            <InfoRow label="종료" value={fmt(blockpick.endAt)} />
            <InfoRow
              label="그리드"
              value={`${blockpick.gridSize}×${blockpick.gridSize} (${blockpick.gridSize * blockpick.gridSize}칸)`}
            />
            <InfoRow
              label="참여 한도"
              value={`무료 ${blockpick.freeEntryCount}회 · 최대 ${blockpick.maxEntryPerUser}회`}
            />
            <InfoRow
              label="추가 참여"
              value={
                blockpick.extraEntryTypes?.length
                  ? blockpick.extraEntryTypes
                      .map((t) =>
                        t === "REFERRAL" ? "친구초대" : t === "AD" ? "광고" : "미션"
                      )
                      .join(", ")
                  : "없음"
              }
            />
            <InfoRow
              label="중복 당첨"
              value={blockpick.allowDuplicateWin ? "허용" : "불허"}
            />
          </div>
        </CardContent>
      </Card>

      {/* 보상 정보 */}
      {blockpick.rewardName && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">보상 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <InfoRow label="경품명" value={blockpick.rewardName} />
              <InfoRow
                label="유형"
                value={
                  blockpick.rewardType
                    ? REWARD_TYPE_LABEL[blockpick.rewardType] ?? blockpick.rewardType
                    : "—"
                }
              />
              <InfoRow
                label="수량"
                value={`${(blockpick.rewardQuantity ?? 0).toLocaleString()}개`}
              />
              <InfoRow label="유효기간" value={fmt(blockpick.rewardExpireAt)} />
              <InfoRow label="지급 방식" value={blockpick.rewardDeliveryMethod ?? "—"} />
              <InfoRow
                label="배송 필요"
                value={blockpick.requireDelivery ? "예" : "아니오"}
              />
            </div>

            {/* 당첨 진행률 */}
            {blockpick.rewardQuantity && blockpick.totalParticipants > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>당첨 진행률</span>
                  <span>{winProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${winProgress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 운영 정보 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">운영 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <InfoRow
              label="공개 방식"
              value={
                blockpick.publishType === "PUBLIC"
                  ? "공개"
                  : blockpick.publishType === "PRIVATE"
                  ? "비공개"
                  : blockpick.publishType === "INVITE_ONLY"
                  ? "초대 전용"
                  : "—"
              }
            />
            <InfoRow
              label="인증 방식"
              value={
                blockpick.authType === "NONE"
                  ? "없음"
                  : blockpick.authType === "PHONE"
                  ? "휴대폰"
                  : blockpick.authType === "EMAIL"
                  ? "이메일"
                  : blockpick.authType === "SNS"
                  ? "SNS"
                  : "—"
              }
            />
            <InfoRow
              label="정보 수집"
              value={blockpick.collectWinnerInfo ? "예" : "아니오"}
            />
          </div>
          {blockpick.notice && (
            <div className="mt-4 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">유의사항</p>
              <p className="text-sm whitespace-pre-wrap">{blockpick.notice}</p>
            </div>
          )}
          {blockpick.csGuide && (
            <div className="mt-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">CS 안내</p>
              <p className="text-sm whitespace-pre-wrap">{blockpick.csGuide}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="text-2xl font-bold">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </p>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <p className="font-medium mt-0.5">{value}</p>
    </div>
  );
}
