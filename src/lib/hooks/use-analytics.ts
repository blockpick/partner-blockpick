import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/lib/api/analytics.service";
import type { DateRange } from "@/lib/types/analytics";

// ── 쿼리 키 ──────────────────────────────────────────────
export const overviewKey = (range?: DateRange) =>
  ["analytics", "overview", range] as const;

export const byBlockpickKey = (range?: DateRange) =>
  ["analytics", "by-blockpick", range] as const;

export const blockpickDetailKey = (blockpickId: string, range?: DateRange) =>
  ["analytics", "blockpick-detail", blockpickId, range] as const;

export const referralAnalyticsKey = (blockpickId?: string, range?: DateRange) =>
  ["analytics", "referral", blockpickId, range] as const;

export const adAnalyticsKey = (blockpickId?: string, range?: DateRange) =>
  ["analytics", "ad", blockpickId, range] as const;

export const channelAnalyticsKey = (blockpickId?: string, range?: DateRange) =>
  ["analytics", "channels", blockpickId, range] as const;

// ── 훅 ──────────────────────────────────────────────────
export function useOverviewAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: overviewKey(range),
    queryFn: () => analyticsService.overview(range),
    staleTime: 1000 * 60 * 5,
  });
}

export function useByBlockpickAnalytics(range?: DateRange) {
  return useQuery({
    queryKey: byBlockpickKey(range),
    queryFn: () => analyticsService.byBlockpick(range),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlockpickDetailAnalytics(blockpickId: string, range?: DateRange) {
  return useQuery({
    queryKey: blockpickDetailKey(blockpickId, range),
    queryFn: () => analyticsService.blockpickDetail(blockpickId, range),
    enabled: !!blockpickId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useReferralAnalytics(blockpickId?: string, range?: DateRange) {
  return useQuery({
    queryKey: referralAnalyticsKey(blockpickId, range),
    queryFn: () => analyticsService.referral(blockpickId, range),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdAnalytics(blockpickId?: string, range?: DateRange) {
  return useQuery({
    queryKey: adAnalyticsKey(blockpickId, range),
    queryFn: () => analyticsService.ad(blockpickId, range),
    staleTime: 1000 * 60 * 5,
  });
}

export function useChannelAnalytics(blockpickId?: string, range?: DateRange) {
  return useQuery({
    queryKey: channelAnalyticsKey(blockpickId, range),
    queryFn: () => analyticsService.channels(blockpickId, range),
    staleTime: 1000 * 60 * 5,
  });
}
