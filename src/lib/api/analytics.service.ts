import { gqlRequest } from "./client";
import type {
  OverviewStats,
  BlockpickAnalytics,
  BlockpickDetailKpi,
  ReferralAnalytics,
  AdAnalytics,
  ChannelAnalytics,
  DateRange,
} from "@/lib/types/analytics";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_OVERVIEW: OverviewStats = {
  kpi: {
    totalVisits: 21440,
    totalParticipants: 4730,
    freeEntryRatio: 0.62,
    extraEntryRatio: 0.38,
    referralSuccessRate: 0.31,
    adWatchCount: 1230,
    winnerCount: 87,
  },
  timeSeries: Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - 86400000 * (13 - i));
    return {
      date: d.toISOString().split("T")[0],
      visits: Math.floor(1200 + Math.random() * 800),
      participants: Math.floor(280 + Math.random() * 200),
      referrals: Math.floor(40 + Math.random() * 60),
      adWatches: Math.floor(60 + Math.random() * 90),
    };
  }),
};

const MOCK_BY_BLOCKPICK: BlockpickAnalytics[] = [
  {
    blockpickId: "mock-1",
    blockpickTitle: "여름 특별 이벤트 블록픽",
    participants: 1280,
    completionRate: 0.48,
    winnerCount: 42,
    extraEntryRatio: 0.41,
  },
  {
    blockpickId: "mock-3",
    blockpickTitle: "봄 할인 프로모션",
    participants: 3450,
    completionRate: 0.61,
    winnerCount: 45,
    extraEntryRatio: 0.33,
  },
];

const MOCK_BLOCKPICK_DETAIL: BlockpickDetailKpi = {
  blockpickId: "mock-1",
  blockpickTitle: "여름 특별 이벤트 블록픽",
  visits: 4320,
  participants: 1280,
  completionRate: 0.48,
  winnerCount: 42,
  freeEntryCount: 2100,
  extraEntryCount: 1450,
  extraEntryRatio: 0.41,
  referralCount: 890,
  adWatchCount: 410,
  missionCount: 150,
};

const MOCK_REFERRAL_ANALYTICS: ReferralAnalytics = {
  funnel: [
    { step: "초대 발송", count: 432, rate: 1 },
    { step: "링크 클릭", count: 310, rate: 0.718 },
    { step: "가입 완료", count: 187, rate: 0.603 },
    { step: "첫 참여", count: 142, rate: 0.759 },
    { step: "보상 지급", count: 98, rate: 0.690 },
  ],
  abuseBlockedCount: 23,
  abuseBlockedRate: 0.053,
};

const MOCK_AD_ANALYTICS: AdAnalytics = {
  totalWatches: 1230,
  completionRate: 0.84,
  averageReward: 1.2,
  abuseAttempts: 47,
  abuseBlockedCount: 44,
};

const MOCK_CHANNEL_ANALYTICS: ChannelAnalytics = {
  stats: [
    { channel: "organic", visits: 9800, participants: 2100, conversionRate: 0.214 },
    { channel: "social", visits: 5400, participants: 1380, conversionRate: 0.256 },
    { channel: "email", visits: 2800, participants: 720, conversionRate: 0.257 },
    { channel: "push", visits: 1900, participants: 340, conversionRate: 0.179 },
    { channel: "paid", visits: 1540, participants: 190, conversionRate: 0.123 },
  ],
};

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------
const OVERVIEW_QUERY = `
  query AnalyticsOverview($range: DateRangeInput) {
    analyticsOverview(range: $range) {
      kpi {
        totalVisits totalParticipants freeEntryRatio extraEntryRatio
        referralSuccessRate adWatchCount winnerCount
      }
      timeSeries { date visits participants referrals adWatches }
    }
  }
`;

const BY_BLOCKPICK_QUERY = `
  query AnalyticsByBlockpick($range: DateRangeInput) {
    analyticsByBlockpick(range: $range) {
      blockpickId blockpickTitle participants completionRate winnerCount extraEntryRatio
    }
  }
`;

const BLOCKPICK_DETAIL_KPI_QUERY = `
  query AnalyticsBlockpickDetail($blockpickId: ID!, $range: DateRangeInput) {
    analyticsBlockpickDetail(blockpickId: $blockpickId, range: $range) {
      blockpickId blockpickTitle visits participants completionRate winnerCount
      freeEntryCount extraEntryCount extraEntryRatio
      referralCount adWatchCount missionCount
    }
  }
`;

const REFERRAL_ANALYTICS_QUERY = `
  query AnalyticsReferral($blockpickId: ID, $range: DateRangeInput) {
    analyticsReferral(blockpickId: $blockpickId, range: $range) {
      funnel { step count rate }
      abuseBlockedCount abuseBlockedRate
    }
  }
`;

const AD_ANALYTICS_QUERY = `
  query AnalyticsAd($blockpickId: ID, $range: DateRangeInput) {
    analyticsAd(blockpickId: $blockpickId, range: $range) {
      totalWatches completionRate averageReward abuseAttempts abuseBlockedCount
    }
  }
`;

const CHANNEL_ANALYTICS_QUERY = `
  query AnalyticsChannels($blockpickId: ID, $range: DateRangeInput) {
    analyticsChannels(blockpickId: $blockpickId, range: $range) {
      stats { channel visits participants conversionRate }
    }
  }
`;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

async function safeGql<T>(
  query: string,
  variables?: Record<string, unknown>,
  mockData?: T,
): Promise<T> {
  if (USE_MOCK && mockData !== undefined) return mockData;
  try {
    return await gqlRequest<T>(query, variables);
  } catch {
    if (mockData !== undefined) return mockData;
    throw new Error("API 요청에 실패했습니다.");
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
export const analyticsService = {
  async overview(range?: DateRange): Promise<OverviewStats> {
    const data = await safeGql<{ analyticsOverview: OverviewStats }>(
      OVERVIEW_QUERY,
      { range },
      { analyticsOverview: MOCK_OVERVIEW },
    );
    return data.analyticsOverview;
  },

  async byBlockpick(range?: DateRange): Promise<BlockpickAnalytics[]> {
    const data = await safeGql<{ analyticsByBlockpick: BlockpickAnalytics[] }>(
      BY_BLOCKPICK_QUERY,
      { range },
      { analyticsByBlockpick: MOCK_BY_BLOCKPICK },
    );
    return data.analyticsByBlockpick;
  },

  async blockpickDetail(
    blockpickId: string,
    range?: DateRange,
  ): Promise<BlockpickDetailKpi> {
    const data = await safeGql<{ analyticsBlockpickDetail: BlockpickDetailKpi }>(
      BLOCKPICK_DETAIL_KPI_QUERY,
      { blockpickId, range },
      { analyticsBlockpickDetail: { ...MOCK_BLOCKPICK_DETAIL, blockpickId } },
    );
    return data.analyticsBlockpickDetail;
  },

  async referral(blockpickId?: string, range?: DateRange): Promise<ReferralAnalytics> {
    const data = await safeGql<{ analyticsReferral: ReferralAnalytics }>(
      REFERRAL_ANALYTICS_QUERY,
      { blockpickId, range },
      { analyticsReferral: MOCK_REFERRAL_ANALYTICS },
    );
    return data.analyticsReferral;
  },

  async ad(blockpickId?: string, range?: DateRange): Promise<AdAnalytics> {
    const data = await safeGql<{ analyticsAd: AdAnalytics }>(
      AD_ANALYTICS_QUERY,
      { blockpickId, range },
      { analyticsAd: MOCK_AD_ANALYTICS },
    );
    return data.analyticsAd;
  },

  async channels(blockpickId?: string, range?: DateRange): Promise<ChannelAnalytics> {
    const data = await safeGql<{ analyticsChannels: ChannelAnalytics }>(
      CHANNEL_ANALYTICS_QUERY,
      { blockpickId, range },
      { analyticsChannels: MOCK_CHANNEL_ANALYTICS },
    );
    return data.analyticsChannels;
  },
};
