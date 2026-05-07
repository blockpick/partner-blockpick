import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { operationsService } from "@/lib/api/operations.service";
import type {
  ParticipantFilter,
  WinnerFilter,
  UpdateWinnerPayoutInput,
  ReferralFilter,
  UpdateAdMissionSettingInput,
} from "@/lib/types/operations";

// ── 쿼리 키 ──────────────────────────────────────────────
export const participantsKey = (filter?: ParticipantFilter) =>
  ["operations", "participants", filter] as const;

export const winnersKey = (filter?: WinnerFilter) =>
  ["operations", "winners", filter] as const;

export const referralKpiKey = (blockpickId: string) =>
  ["operations", "referral-kpi", blockpickId] as const;

export const referralsKey = (filter?: ReferralFilter) =>
  ["operations", "referrals", filter] as const;

export const adMissionSettingKey = (blockpickId: string) =>
  ["operations", "ad-mission", blockpickId] as const;

// ── 참여자 ────────────────────────────────────────────────
export function useParticipants(filter?: ParticipantFilter) {
  return useQuery({
    queryKey: participantsKey(filter),
    queryFn: () => operationsService.listParticipants(filter),
    staleTime: 1000 * 30,
  });
}

// ── 당첨자 ────────────────────────────────────────────────
export function useWinners(filter?: WinnerFilter) {
  return useQuery({
    queryKey: winnersKey(filter),
    queryFn: () => operationsService.listWinners(filter),
    staleTime: 1000 * 30,
  });
}

export function useUpdateWinnerPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateWinnerPayoutInput) =>
      operationsService.updateWinnerPayout(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "winners"] });
    },
  });
}

// ── 리퍼럴 ────────────────────────────────────────────────
export function useReferralKpi(blockpickId: string) {
  return useQuery({
    queryKey: referralKpiKey(blockpickId),
    queryFn: () => operationsService.referralKpi(blockpickId),
    enabled: !!blockpickId,
    staleTime: 1000 * 60,
  });
}

export function useReferrals(filter?: ReferralFilter) {
  return useQuery({
    queryKey: referralsKey(filter),
    queryFn: () => operationsService.listReferrals(filter),
    staleTime: 1000 * 30,
  });
}

// ── 광고/미션 설정 ────────────────────────────────────────
export function useAdMissionSetting(blockpickId: string) {
  return useQuery({
    queryKey: adMissionSettingKey(blockpickId),
    queryFn: () => operationsService.getAdMissionSetting(blockpickId),
    enabled: !!blockpickId,
    staleTime: 1000 * 60,
  });
}

export function useUpdateAdMissionSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      blockpickId,
      input,
    }: {
      blockpickId: string;
      input: UpdateAdMissionSettingInput;
    }) => operationsService.updateAdMissionSetting(blockpickId, input),
    onSuccess: (_, { blockpickId }) => {
      queryClient.invalidateQueries({
        queryKey: adMissionSettingKey(blockpickId),
      });
    },
  });
}
