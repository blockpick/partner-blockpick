// ──────────────────────────────────────────────
// 분석 공통
// ──────────────────────────────────────────────
export interface DateRange {
  from: string; // ISO string
  to: string;
}

// ──────────────────────────────────────────────
// 전체 성과 (overview)
// ──────────────────────────────────────────────
export interface OverviewKpi {
  totalVisits: number;
  totalParticipants: number;
  freeEntryRatio: number;     // 0~1
  extraEntryRatio: number;    // 0~1
  referralSuccessRate: number; // 0~1
  adWatchCount: number;
  winnerCount: number;
}

export interface TimeSeriesPoint {
  date: string; // "YYYY-MM-DD"
  visits: number;
  participants: number;
  referrals: number;
  adWatches: number;
}

export interface OverviewStats {
  kpi: OverviewKpi;
  timeSeries: TimeSeriesPoint[];
}

// ──────────────────────────────────────────────
// 블록픽별 성과
// ──────────────────────────────────────────────
export interface BlockpickAnalytics {
  blockpickId: string;
  blockpickTitle: string;
  participants: number;
  completionRate: number;  // 0~1 (모든 칸 채운 비율)
  winnerCount: number;
  extraEntryRatio: number; // 0~1
}

export interface BlockpickDetailKpi {
  blockpickId: string;
  blockpickTitle: string;
  visits: number;
  participants: number;
  completionRate: number;
  winnerCount: number;
  freeEntryCount: number;
  extraEntryCount: number;
  extraEntryRatio: number;
  referralCount: number;
  adWatchCount: number;
  missionCount: number;
}

// ──────────────────────────────────────────────
// 친구초대 퍼널
// ──────────────────────────────────────────────
export interface ReferralFunnelStep {
  step: string;
  count: number;
  rate: number; // 이전 단계 대비 0~1
}

export interface ReferralAnalytics {
  funnel: ReferralFunnelStep[];
  abuseBlockedCount: number;
  abuseBlockedRate: number; // 0~1
}

// ──────────────────────────────────────────────
// 광고 성과
// ──────────────────────────────────────────────
export interface AdAnalytics {
  totalWatches: number;
  completionRate: number; // 0~1
  averageReward: number;
  abuseAttempts: number;
  abuseBlockedCount: number;
}

// ──────────────────────────────────────────────
// 유입 채널
// ──────────────────────────────────────────────
export type UtmChannel = "organic" | "social" | "email" | "push" | "paid";

export interface ChannelStat {
  channel: UtmChannel;
  visits: number;
  participants: number;
  conversionRate: number; // 0~1
}

export interface ChannelAnalytics {
  stats: ChannelStat[];
}
