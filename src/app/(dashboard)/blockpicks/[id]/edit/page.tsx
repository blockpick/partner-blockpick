"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Step1Basic } from "@/components/blockpicks/wizard/step1-basic";
import { Step2Game } from "@/components/blockpicks/wizard/step2-game";
import { Step3Reward } from "@/components/blockpicks/wizard/step3-reward";
import { Step4Operation } from "@/components/blockpicks/wizard/step4-operation";
import { Step5Preview } from "@/components/blockpicks/wizard/step5-preview";
import { WizardStepper } from "@/components/blockpicks/wizard/wizard-stepper";
import { useWizard } from "@/components/blockpicks/wizard/use-wizard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlockpickDetail, useUpdateBlockpick } from "@/lib/hooks/use-my-blockpicks";
import { toDateTimeLocalValue } from "@/lib/format";

export default function EditBlockpickPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const { data, isLoading } = useBlockpickDetail(id);
  const update = useUpdateBlockpick();
  const wizard = useWizard(id);
  const hydrated = useRef(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!data || hydrated.current) return;
    wizard.updateForm({
      title: data.title,
      description: data.description ?? "",
      thumbnailUrl: data.thumbnailUrl ?? "",
      partnerName: data.partnerName ?? "",
      landingUrl: data.landingUrl ?? "",
      startAt: toDateTimeLocalValue(data.startAt),
      endAt: toDateTimeLocalValue(data.endAt),
      gridSize: data.gridSize,
      freeEntryCount: data.freeEntryCount,
      maxEntryPerUser: data.maxEntryPerUser,
      extraEntryTypes: data.extraEntryTypes,
      allowDuplicateWin: data.allowDuplicateWin,
      rewardName: data.rewardName ?? "",
      rewardType: data.rewardType ?? "",
      rewardQuantity: data.rewardQuantity ?? 1,
      rewardExpireAt: toDateTimeLocalValue(data.rewardExpireAt),
      rewardDeliveryMethod: data.rewardDeliveryMethod ?? "",
      requireDelivery: data.requireDelivery,
      deliveryAvailableCountries: data.deliveryAvailableCountries ?? [],
      deliveryUnavailableCountries: data.deliveryUnavailableCountries ?? [],
      deliveryPayer: data.deliveryPayer ?? "",
      publishType: data.publishType ?? "",
      authType: data.authType ?? "NONE",
      collectWinnerInfo: data.collectWinnerInfo ?? false,
      notice: data.notice ?? "",
      csGuide: data.csGuide ?? "",
    });
    hydrated.current = true;
  }, [data, wizard]);

  async function handleSave() {
    await update.mutateAsync({ id, input: wizard.toInput() });
    setSaved(true);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[480px] w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="수정할 블록픽을 찾을 수 없습니다."
        description="블록픽이 삭제되었거나 접근 권한이 없습니다."
        action={
          <Link href="/blockpicks">
            <Button variant="outline">목록으로 이동</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="블록픽 수정"
        description="기존 블록픽 정보를 업데이트합니다."
        actions={
          <Link href={`/blockpicks/${id}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              상세로
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-6">
          <WizardStepper
            currentStep={wizard.step}
            onStepClick={wizard.goToStep}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          {wizard.step === 1 && (
            <Step1Basic
              form={wizard.form}
              onChange={wizard.updateForm}
              onNext={wizard.nextStep}
            />
          )}
          {wizard.step === 2 && (
            <Step2Game
              form={wizard.form}
              onChange={wizard.updateForm}
              onPrev={wizard.prevStep}
              onNext={wizard.nextStep}
            />
          )}
          {wizard.step === 3 && (
            <Step3Reward
              form={wizard.form}
              onChange={wizard.updateForm}
              onPrev={wizard.prevStep}
              onNext={wizard.nextStep}
            />
          )}
          {wizard.step === 4 && (
            <Step4Operation
              form={wizard.form}
              onChange={wizard.updateForm}
              onPrev={wizard.prevStep}
              onNext={wizard.nextStep}
            />
          )}
          {wizard.step === 5 && (
            <Step5Preview
              form={wizard.form}
              toInput={wizard.toInput}
              onPrev={wizard.prevStep}
              onNext={wizard.nextStep}
            />
          )}
          {wizard.step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">변경 저장</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  미리보기까지 확인한 내용을 실제 블록픽에 반영합니다.
                </p>
              </div>

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">저장 전 확인</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>현재 제목: {wizard.form.title || "제목 없음"}</p>
                  <p>
                    참여 기간: {wizard.form.startAt || "미설정"} ~{" "}
                    {wizard.form.endAt || "미설정"}
                  </p>
                  <p>
                    그리드: {wizard.form.gridSize}x{wizard.form.gridSize} / 경품:{" "}
                    {wizard.form.rewardName || "미설정"}
                  </p>
                </CardContent>
              </Card>

              {saved && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  변경사항을 저장했습니다.
                </div>
              )}

              {update.isError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
                  저장 중 오류가 발생했습니다. 다시 시도해주세요.
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={wizard.prevStep}>
                  이전
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/blockpicks/${id}`)}
                  >
                    상세로 이동
                  </Button>
                  <Button onClick={handleSave} disabled={update.isPending}>
                    {update.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    변경 저장
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
