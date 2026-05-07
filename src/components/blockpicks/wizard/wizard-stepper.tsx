"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { WIZARD_STEPS, type WizardStep } from "./use-wizard";

interface WizardStepperProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
}

export function WizardStepper({ currentStep, onStepClick }: WizardStepperProps) {
  return (
    <div className="flex items-center gap-0">
      {WIZARD_STEPS.map((s, idx) => {
        const isDone = s.id < currentStep;
        const isActive = s.id === currentStep;
        const isLast = idx === WIZARD_STEPS.length - 1;

        return (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => onStepClick?.(s.id as WizardStep)}
              disabled={!isDone && !isActive}
              className={cn(
                "flex flex-col items-center gap-1 group",
                (isDone) && "cursor-pointer",
                (!isDone && !isActive) && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
                  isDone && "bg-primary border-primary text-primary-foreground",
                  isActive && "bg-background border-primary text-primary",
                  !isDone && !isActive && "bg-background border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive && "text-foreground",
                  !isActive && "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </button>
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 w-8 md:w-16 mx-1 mb-4 transition-colors",
                  isDone ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
