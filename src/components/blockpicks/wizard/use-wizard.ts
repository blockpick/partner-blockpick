"use client";

import { useState, useCallback, useEffect } from "react";
import type { BlockpickInput, ExtraEntryType, RewardType, PublishType, AuthType, DeliveryPayer } from "@/lib/types/blockpick";

export const WIZARD_STEPS = [
  { id: 1, label: "기본 정보" },
  { id: 2, label: "게임 설정" },
  { id: 3, label: "보상 설정" },
  { id: 4, label: "운영 설정" },
  { id: 5, label: "미리보기" },
  { id: 6, label: "발행" },
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number]["id"];

export type WizardFormData = {
  // Step 1
  title: string;
  description: string;
  thumbnailUrl: string;
  partnerName: string;
  landingUrl: string;
  startAt: string;
  endAt: string;
  // Step 2
  gridSize: number;
  freeEntryCount: number;
  maxEntryPerUser: number;
  extraEntryTypes: ExtraEntryType[];
  allowDuplicateWin: boolean;
  // Step 3
  rewardName: string;
  rewardType: RewardType | "";
  rewardQuantity: number;
  rewardExpireAt: string;
  rewardDeliveryMethod: string;
  requireDelivery: boolean;
  deliveryAvailableCountries: string[];
  deliveryUnavailableCountries: string[];
  deliveryPayer: DeliveryPayer | "";
  // Step 4
  publishType: PublishType | "";
  authType: AuthType | "";
  collectWinnerInfo: boolean;
  notice: string;
  csGuide: string;
};

const DEFAULT_FORM: WizardFormData = {
  title: "",
  description: "",
  thumbnailUrl: "",
  partnerName: "",
  landingUrl: "",
  startAt: "",
  endAt: "",
  gridSize: 10,
  freeEntryCount: 3,
  maxEntryPerUser: 10,
  extraEntryTypes: [],
  allowDuplicateWin: false,
  rewardName: "",
  rewardType: "",
  rewardQuantity: 1,
  rewardExpireAt: "",
  rewardDeliveryMethod: "",
  requireDelivery: false,
  deliveryAvailableCountries: [],
  deliveryUnavailableCountries: [],
  deliveryPayer: "",
  publishType: "",
  authType: "NONE",
  collectWinnerInfo: false,
  notice: "",
  csGuide: "",
};

const STORAGE_KEY = "blockpick_wizard_draft";

export function useWizard(editId?: string) {
  const storageKey = editId ? `${STORAGE_KEY}_${editId}` : STORAGE_KEY;

  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<WizardFormData>(() => {
    if (typeof window === "undefined") return DEFAULT_FORM;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...DEFAULT_FORM, ...JSON.parse(saved) } : DEFAULT_FORM;
    } catch {
      return DEFAULT_FORM;
    }
  });

  // LocalStorage 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(form));
    } catch {
      // 무시
    }
  }, [form, storageKey]);

  const updateForm = useCallback((updates: Partial<WizardFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setStep((s) => Math.min(s + 1, 6) as WizardStep);
  }, []);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1) as WizardStep);
  }, []);

  const goToStep = useCallback((s: WizardStep) => {
    setStep(s);
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // 무시
    }
    setForm(DEFAULT_FORM);
    setStep(1);
  }, [storageKey]);

  const toInput = useCallback((): Omit<BlockpickInput, "status"> => ({
    title: form.title,
    description: form.description || undefined,
    thumbnailUrl: form.thumbnailUrl || undefined,
    partnerName: form.partnerName || undefined,
    landingUrl: form.landingUrl || undefined,
    startAt: form.startAt || undefined,
    endAt: form.endAt || undefined,
    gridSize: form.gridSize,
    freeEntryCount: form.freeEntryCount,
    maxEntryPerUser: form.maxEntryPerUser,
    extraEntryTypes: form.extraEntryTypes,
    allowDuplicateWin: form.allowDuplicateWin,
    rewardName: form.rewardName || undefined,
    rewardType: (form.rewardType as RewardType) || undefined,
    rewardQuantity: form.rewardQuantity || undefined,
    rewardExpireAt: form.rewardExpireAt || undefined,
    rewardDeliveryMethod: form.rewardDeliveryMethod || undefined,
    requireDelivery: form.requireDelivery,
    deliveryAvailableCountries: form.requireDelivery ? form.deliveryAvailableCountries : undefined,
    deliveryUnavailableCountries: form.requireDelivery ? form.deliveryUnavailableCountries : undefined,
    deliveryPayer: (form.deliveryPayer as DeliveryPayer) || undefined,
    publishType: (form.publishType as PublishType) || undefined,
    authType: (form.authType as AuthType) || undefined,
    collectWinnerInfo: form.collectWinnerInfo,
    notice: form.notice || undefined,
    csGuide: form.csGuide || undefined,
  }), [form]);

  return {
    step,
    form,
    updateForm,
    nextStep,
    prevStep,
    goToStep,
    clearDraft,
    toInput,
  };
}
