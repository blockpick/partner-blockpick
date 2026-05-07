"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { WizardStepper } from "@/components/blockpicks/wizard/wizard-stepper";
import { Step1Basic } from "@/components/blockpicks/wizard/step1-basic";
import { Step2Game } from "@/components/blockpicks/wizard/step2-game";
import { Step3Reward } from "@/components/blockpicks/wizard/step3-reward";
import { Step4Operation } from "@/components/blockpicks/wizard/step4-operation";
import { Step5Preview } from "@/components/blockpicks/wizard/step5-preview";
import { Step6Publish } from "@/components/blockpicks/wizard/step6-publish";
import { useWizard, type WizardStep } from "@/components/blockpicks/wizard/use-wizard";
import { useBlockpickDetail } from "@/lib/hooks/use-my-blockpicks";
import { useEffect } from "react";

export default function EditBlockpickPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: blockpick, isLoading } = useBlockpickDetail(id);
  const { step, form, updateForm, nextStep, prevStep, goToStep, clearDraft, toInput } =
    useWizard(id);

  // 기존 데이터 로드 (첫 마운트 시 한 번만)
  useEffect(() => {
    if (!blockpick) return;
    updateForm({
      title: blockpick.title ?? "",
      description: blockpick.description ?? "",
      thumbnailUrl: blockpick.thumbnailUrl ?? "",
      partnerName: blockpick.partnerName ?? "",
      landingUrl: blockpick.landingUrl ?? "",
      startAt: blockpick.startAt ? blockpick.startAt.slice(0, 16) : "",
      endAt: blockpick.endAt ? blockpick.endAt.slice(0, 16) : "",
      gridSize: blockpick.gridSize ?? 10,
      freeEntryCount: blockpick.freeEntryCount ?? 3,
      maxEntryPerUser: blockpick.maxEntryPerUser ?? 10,
      extraEntryTypes: blockpick.extraEntryTypes ?? [],
      allowDuplicateWin: blockpick.allowDuplicateWin ?? false,
      rewardName: blockpick.rewardName ?? "",
      rewardType: blockpick.rewardType ?? "",
      rewardQuantity: blockpick.rewardQuantity ?? 1,
      rewardExpireAt: blockpick.rewardExpireAt ? blockpick.rewardExpireAt.slice(0, 16) : "",
      rewardDeliveryMethod: blockpick.rewardDeliveryMethod ?? "",
      requireDelivery: blockpick.requireDelivery ?? false,
      deliveryAvailableCountries: blockpick.deliveryAvailableCountries ?? [],
      deliveryUnavailableCountries: blockpick.deliveryUnavailableCountries ?? [],
      deliveryPayer: blockpick.deliveryPayer ?? "",
      publishType: blockpick.publishType ?? "",
      authType: blockpick.authType ?? "NONE",
      collectWinnerInfo: blockpick.collectWinnerInfo ?? false,
      notice: blockpick.notice ?? "",
      csGuide: blockpick.csGuide ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockpick]);

  const isActive = blockpick?.status === "ACTIVE";

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Link href={`/blockpicks/${id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">블록픽 수정</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isActive && (
              <span className="text-orange-600">진행 중인 캠페인은 일부 설정을 변경할 수 없습니다. </span>
            )}
            {blockpick?.title}
          </p>
        </div>
      </div>

      {/* 스텝퍼 */}
      <div className="overflow-x-auto pb-1">
        <WizardStepper currentStep={step} onStepClick={goToStep} />
      </div>

      {/* 스텝 콘텐츠 */}
      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <Step1Basic form={form} onChange={updateForm} onNext={nextStep} />
          )}
          {step === 2 && (
            <Step2Game
              form={form}
              onChange={updateForm}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 3 && (
            <Step3Reward
              form={form}
              onChange={updateForm}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 4 && (
            <Step4Operation
              form={form}
              onChange={updateForm}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 5 && (
            <Step5Preview
              form={form}
              toInput={toInput}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 6 && (
            <Step6Publish
              form={form}
              toInput={toInput}
              onPrev={prevStep}
              onClearDraft={clearDraft}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
