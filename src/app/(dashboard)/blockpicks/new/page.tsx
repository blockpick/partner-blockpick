"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { WizardStepper } from "@/components/blockpicks/wizard/wizard-stepper";
import { Step1Basic } from "@/components/blockpicks/wizard/step1-basic";
import { Step2Game } from "@/components/blockpicks/wizard/step2-game";
import { Step3Reward } from "@/components/blockpicks/wizard/step3-reward";
import { Step4Operation } from "@/components/blockpicks/wizard/step4-operation";
import { Step5Preview } from "@/components/blockpicks/wizard/step5-preview";
import { Step6Publish } from "@/components/blockpicks/wizard/step6-publish";
import { useWizard } from "@/components/blockpicks/wizard/use-wizard";

export default function NewBlockpickPage() {
  const wizard = useWizard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="새 블록픽 만들기"
        description="위저드를 따라 캠페인 설정을 완료하고 발행하세요."
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
            <Step6Publish
              form={wizard.form}
              toInput={wizard.toInput}
              onPrev={wizard.prevStep}
              onClearDraft={wizard.clearDraft}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
