import { gqlRequest } from "./client";
import type {
  Participant,
  ParticipantFilter,
  PaginatedParticipants,
  Winner,
  WinnerFilter,
  PaginatedWinners,
  UpdateWinnerPayoutInput,
  ReferralKpi,
  ReferralRecord,
  ReferralFilter,
  PaginatedReferrals,
  AdMissionSetting,
  UpdateAdMissionSettingInput,
} from "@/lib/types/operations";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_PARTICIPANTS: Participant[] = Array.from({ length: 12 }, (_, i) => ({
  id: `p-${i + 1}`,
  blockpickId: "mock-1",
  nickname: `참여자${i + 1}`,
  emailMasked: `us***${i}@example.com`,
  entryCount: Math.floor(Math.random() * 8) + 1,
  entryTypes: i % 3 === 0 ? ["FREE", "REFERRAL"] : i % 3 === 1 ? ["FREE", "AD"] : ["FREE"],
  firstJoinedAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
  device: i % 2 === 0 ? "iOS" : "Android",
  ipMasked: `192.168.${i}.*`,
  abuseFlag: i === 3 || i === 7,
}));

const MOCK_WINNERS: Winner[] = Array.from({ length: 8 }, (_, i) => ({
  id: `w-${i + 1}`,
  blockpickId: "mock-1",
  nickname: `당첨자${i + 1}`,
  rewardName: "스타벅스 아메리카노",
  payoutStatus: (["PENDING", "PROCESSING", "COMPLETED", "HELD"] as const)[i % 4],
  recipientInfoProvided: i % 2 === 0,
  memo: i === 2 ? "중복 가능성 확인 필요" : undefined,
  wonAt: new Date(Date.now() - 86400000 * i).toISOString(),
}));

const MOCK_REFERRAL_KPI: ReferralKpi = {
  blockpickId: "mock-1",
  issuedCount: 432,
  clickCount: 310,
  signupConversionCount: 187,
  firstEntryConversionCount: 142,
  rewardIssuedCount: 98,
};

const MOCK_REFERRALS: ReferralRecord[] = Array.from({ length: 10 }, (_, i) => ({
  id: `r-${i + 1}`,
  blockpickId: "mock-1",
  inviterNickname: `초대자${i + 1}`,
  inviteeMasked: `fr***${i}@example.com`,
  inviteeJoined: i % 3 !== 0,
  inviteeParticipated: i % 4 !== 0,
  rewardIssued: i % 5 === 0,
  abuseFlag: i === 2 || i === 6,
  createdAt: new Date(Date.now() - 86400000 * i).toISOString(),
}));

const MOCK_AD_MISSION: AdMissionSetting = {
  blockpickId: "mock-1",
  adEnabled: true,
  adDailyLimit: 3,
  adRewardAmount: 1,
  missionEnabled: true,
  missions: [
    { id: "m1", type: "SIGNUP", label: "회원가입", rewardAmount: 3, enabled: true },
    { id: "m2", type: "APP_INSTALL", label: "앱 설치", rewardAmount: 5, enabled: false, targetUrl: "https://example.com/app" },
    { id: "m3", type: "CHANNEL_SUBSCRIBE", label: "채널 구독", rewardAmount: 2, enabled: true, targetUrl: "https://youtube.com/@example" },
    { id: "m4", type: "PAGE_VISIT", label: "페이지 방문", rewardAmount: 1, enabled: true, targetUrl: "https://example.com/promo" },
    { id: "m5", type: "QR_VERIFY", label: "QR 인증", rewardAmount: 2, enabled: false },
  ],
};

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------
const PARTICIPANTS_QUERY = `
  query OperationParticipants($filter: ParticipantFilterInput) {
    operationParticipants(filter: $filter) {
      items {
        id blockpickId nickname emailMasked entryCount entryTypes
        firstJoinedAt device ipMasked abuseFlag
      }
      total page pageSize
    }
  }
`;

const WINNERS_QUERY = `
  query OperationWinners($filter: WinnerFilterInput) {
    operationWinners(filter: $filter) {
      items {
        id blockpickId nickname rewardName payoutStatus
        recipientInfoProvided memo wonAt
      }
      total page pageSize
    }
  }
`;

const UPDATE_PAYOUT_MUTATION = `
  mutation UpdateWinnerPayout($input: UpdateWinnerPayoutInput!) {
    updateWinnerPayout(input: $input) {
      id payoutStatus memo
    }
  }
`;

const REFERRAL_KPI_QUERY = `
  query ReferralKpi($blockpickId: ID!) {
    referralKpi(blockpickId: $blockpickId) {
      blockpickId issuedCount clickCount
      signupConversionCount firstEntryConversionCount rewardIssuedCount
    }
  }
`;

const REFERRALS_QUERY = `
  query OperationReferrals($filter: ReferralFilterInput) {
    operationReferrals(filter: $filter) {
      items {
        id blockpickId inviterNickname inviteeMasked
        inviteeJoined inviteeParticipated rewardIssued abuseFlag createdAt
      }
      total page pageSize
    }
  }
`;

const AD_MISSION_QUERY = `
  query AdMissionSetting($blockpickId: ID!) {
    adMissionSetting(blockpickId: $blockpickId) {
      blockpickId adEnabled adDailyLimit adRewardAmount
      missionEnabled
      missions { id type label rewardAmount enabled targetUrl }
    }
  }
`;

const UPDATE_AD_MISSION_MUTATION = `
  mutation UpdateAdMissionSetting($blockpickId: ID!, $input: UpdateAdMissionSettingInput!) {
    updateAdMissionSetting(blockpickId: $blockpickId, input: $input) {
      blockpickId adEnabled adDailyLimit adRewardAmount
      missionEnabled
      missions { id type label rewardAmount enabled targetUrl }
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
export const operationsService = {
  async listParticipants(filter?: ParticipantFilter): Promise<PaginatedParticipants> {
    let items = MOCK_PARTICIPANTS;
    if (filter?.abuseOnly) items = items.filter((p) => p.abuseFlag);
    if (filter?.search)
      items = items.filter(
        (p) =>
          p.nickname.includes(filter.search!) ||
          p.emailMasked.includes(filter.search!),
      );
    const mockResult: PaginatedParticipants = {
      items,
      total: items.length,
      page: filter?.page ?? 1,
      pageSize: filter?.pageSize ?? 20,
    };
    const data = await safeGql<{ operationParticipants: PaginatedParticipants }>(
      PARTICIPANTS_QUERY,
      { filter },
      { operationParticipants: mockResult },
    );
    return data.operationParticipants;
  },

  async listWinners(filter?: WinnerFilter): Promise<PaginatedWinners> {
    let items = MOCK_WINNERS;
    if (filter?.payoutStatus)
      items = items.filter((w) => w.payoutStatus === filter.payoutStatus);
    const mockResult: PaginatedWinners = {
      items,
      total: items.length,
      page: filter?.page ?? 1,
      pageSize: filter?.pageSize ?? 20,
    };
    const data = await safeGql<{ operationWinners: PaginatedWinners }>(
      WINNERS_QUERY,
      { filter },
      { operationWinners: mockResult },
    );
    return data.operationWinners;
  },

  async updateWinnerPayout(
    input: UpdateWinnerPayoutInput,
  ): Promise<Pick<Winner, "id" | "payoutStatus" | "memo">> {
    const mock = {
      id: input.winnerId,
      payoutStatus: input.payoutStatus,
      memo: input.memo,
    };
    const data = await safeGql<{
      updateWinnerPayout: Pick<Winner, "id" | "payoutStatus" | "memo">;
    }>(UPDATE_PAYOUT_MUTATION, { input }, { updateWinnerPayout: mock });
    return data.updateWinnerPayout;
  },

  async referralKpi(blockpickId: string): Promise<ReferralKpi> {
    const data = await safeGql<{ referralKpi: ReferralKpi }>(
      REFERRAL_KPI_QUERY,
      { blockpickId },
      { referralKpi: { ...MOCK_REFERRAL_KPI, blockpickId } },
    );
    return data.referralKpi;
  },

  async listReferrals(filter?: ReferralFilter): Promise<PaginatedReferrals> {
    let items = MOCK_REFERRALS;
    if (filter?.abuseOnly) items = items.filter((r) => r.abuseFlag);
    const mockResult: PaginatedReferrals = {
      items,
      total: items.length,
      page: filter?.page ?? 1,
      pageSize: filter?.pageSize ?? 20,
    };
    const data = await safeGql<{ operationReferrals: PaginatedReferrals }>(
      REFERRALS_QUERY,
      { filter },
      { operationReferrals: mockResult },
    );
    return data.operationReferrals;
  },

  async getAdMissionSetting(blockpickId: string): Promise<AdMissionSetting> {
    const data = await safeGql<{ adMissionSetting: AdMissionSetting }>(
      AD_MISSION_QUERY,
      { blockpickId },
      { adMissionSetting: { ...MOCK_AD_MISSION, blockpickId } },
    );
    return data.adMissionSetting;
  },

  async updateAdMissionSetting(
    blockpickId: string,
    input: UpdateAdMissionSettingInput,
  ): Promise<AdMissionSetting> {
    const mock: AdMissionSetting = {
      ...MOCK_AD_MISSION,
      blockpickId,
      ...input,
      missions: input.missions
        ? input.missions.map((m, i) => ({ ...m, id: `m${i + 1}` }))
        : MOCK_AD_MISSION.missions,
    };
    const data = await safeGql<{ updateAdMissionSetting: AdMissionSetting }>(
      UPDATE_AD_MISSION_MUTATION,
      { blockpickId, input },
      { updateAdMissionSetting: mock },
    );
    return data.updateAdMissionSetting;
  },
};
