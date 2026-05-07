"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreviewBlockpick } from "@/lib/hooks/use-my-blockpicks";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Grid3X3, Gift, Calendar, Users } from "lucide-react";
import type { WizardFormData } from "./use-wizard";
import type { BlockpickInput } from "@/lib/types/blockpick";

interface Step5Props {
  form: WizardFormData;
  toInput: () => Omit<BlockpickInput, "status">;
  onNext: () => void;
  onPrev: () => void;
}

const REWARD_TYPE_LABEL: Record<string, string> = {
  COUPON: "쿠폰",
  VOUCHER: "교환권",
  PHYSICAL: "실물 상품",
  POINT: "포인트",
};

function fmt(dateStr?: string) {
  if (!dateStr) return "미설정";
  try {
    return format(new Date(dateStr), "yyyy.MM.dd HH:mm", { locale: ko });
  } catch {
    return dateStr;
  }
}

export function Step5Preview({ form, toInput, onNext, onPrev }: Step5Props) {
  const preview = usePreviewBlockpick();

  useEffect(() => {
    const input = toInput();
    if (input.title) {
      preview.mutate(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">미리보기</h2>
        <p className="text-sm text-muted-foreground mt-0.5">입력한 정보를 확인하세요</p>
      </div>

      {/* 미리보기 카드 */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="flex gap-4">
            {form.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.thumbnailUrl}
                alt="썸네일"
                className="h-20 w-20 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Grid3X3 className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="space-y-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {form.title || "제목 없음"}
              </h3>
              {form.partnerName && (
                <p className="text-sm text-muted-foreground">{form.partnerName}</p>
              )}
              <Badge variant="secondary">임시저장</Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-4 space-y-3">
          <InfoRow icon={<Calendar className="h-4 w-4" />} label="참여 기간">
            {fmt(form.startAt)} ~ {fmt(form.endAt)}
          </InfoRow>
          <InfoRow icon={<Grid3X3 className="h-4 w-4" />} label="그리드">
            {form.gridSize}×{form.gridSize} ({form.gridSize * form.gridSize}칸)
          </InfoRow>
          <InfoRow icon={<Users className="h-4 w-4" />} label="참여 설정">
            무료 {form.freeEntryCount}회 · 최대 {form.maxEntryPerUser}회/인
          </InfoRow>
          <InfoRow icon={<Gift className="h-4 w-4" />} label="경품">
            {form.rewardName || "미설정"}{" "}
            {form.rewardType && `(${REWARD_TYPE_LABEL[form.rewardType]})`}{" "}
            {form.rewardQuantity > 0 && `× ${form.rewardQuantity}개`}
          </InfoRow>
        </CardContent>
      </Card>

      {/* 상세 요약 */}
      <div className="rounded-lg border divide-y">
        <SummarySection title="기본 정보">
          <SummaryRow label="설명">{form.description || "—"}</SummaryRow>
          <SummaryRow label="랜딩 URL">{form.landingUrl || "—"}</SummaryRow>
        </SummarySection>
        <SummarySection title="게임 설정">
          <SummaryRow label="추가 참여">
            {form.extraEntryTypes.length > 0
              ? form.extraEntryTypes.map((t) =>
                  t === "REFERRAL" ? "친구초대" : t === "AD" ? "광고" : "미션"
                ).join(", ")
              : "없음"}
          </SummaryRow>
          <SummaryRow label="중복 당첨">{form.allowDuplicateWin ? "허용" : "불허"}</SummaryRow>
        </SummarySection>
        <SummarySection title="운영 설정">
          <SummaryRow label="공개 방식">
            {form.publishType === "PUBLIC" ? "공개" :
             form.publishType === "PRIVATE" ? "비공개" :
             form.publishType === "INVITE_ONLY" ? "초대 전용" : "—"}
          </SummaryRow>
          <SummaryRow label="인증 방식">
            {form.authType === "NONE" ? "없음" :
             form.authType === "PHONE" ? "휴대폰" :
             form.authType === "EMAIL" ? "이메일" :
             form.authType === "SNS" ? "SNS" : "—"}
          </SummaryRow>
          <SummaryRow label="당첨자 정보 수집">{form.collectWinnerInfo ? "예" : "아니오"}</SummaryRow>
        </SummarySection>
      </div>

      {preview.isPending && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onPrev}>이전</Button>
        <Button onClick={onNext}>발행 설정으로</Button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-muted-foreground w-28 shrink-0">{label}</span>
      <span>{children}</span>
    </div>
  );
}
