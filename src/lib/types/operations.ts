// ──────────────────────────────────────────────
// 운영 공통
// ──────────────────────────────────────────────
export type PayoutStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "HELD";
export type EntryType = "FREE" | "REFERRAL" | "AD" | "MISSION";
export type MissionType =
  | "SIGNUP"
  | "APP_INSTALL"
  | "CHANNEL_SUBSCRIBE"
  | "PAGE_VISIT"
  | "QR_VERIFY";

// ──────────────────────────────────────────────
// 참여자
// ──────────────────────────────────────────────
export interface Participant {
  id: string;
  blockpickId: string;
  nickname: string;
  emailMasked: string; // e.g. "te***@example.com"
  entryCount: number;
  entryTypes: EntryType[];
  firstJoinedAt: string;
  device: string;
  ipMasked: string; // e.g. "123.456.*.*"
  abuseFlag: boolean;
}

export interface ParticipantFilter {
  blockpickId?: string;
  entryType?: EntryType;
  abuseOnly?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedParticipants {
  items: Participant[];
  total: number;
  page: number;
  pageSize: number;
}

// ──────────────────────────────────────────────
// 당첨자
// ──────────────────────────────────────────────
export interface Winner {
  id: string;
  blockpickId: string;
  nickname: string;
  rewardName: string;
  payoutStatus: PayoutStatus;
  recipientInfoProvided: boolean;
  memo?: string;
  wonAt: string;
}

export interface WinnerFilter {
  blockpickId?: string;
  payoutStatus?: PayoutStatus;
  page?: number;
  pageSize?: number;
}

export interface PaginatedWinners {
  items: Winner[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpdateWinnerPayoutInput {
  winnerId: string;
  payoutStatus: PayoutStatus;
  memo?: string;
}

// ──────────────────────────────────────────────
// 리퍼럴
// ──────────────────────────────────────────────
export interface ReferralKpi {
  blockpickId: string;
  issuedCount: number;
  clickCount: number;
  signupConversionCount: number;
  firstEntryConversionCount: number;
  rewardIssuedCount: number;
}

export interface ReferralRecord {
  id: string;
  blockpickId: string;
  inviterNickname: string;
  inviteeMasked: string;
  inviteeJoined: boolean;
  inviteeParticipated: boolean;
  rewardIssued: boolean;
  abuseFlag: boolean;
  createdAt: string;
}

export interface ReferralFilter {
  blockpickId?: string;
  abuseOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedReferrals {
  items: ReferralRecord[];
  total: number;
  page: number;
  pageSize: number;
}

// ──────────────────────────────────────────────
// 광고/미션 설정
// ──────────────────────────────────────────────
export interface AdMissionSetting {
  blockpickId: string;
  adEnabled: boolean;
  adDailyLimit: number;
  adRewardAmount: number; // 단가 (포인트 등)
  missionEnabled: boolean;
  missions: MissionConfig[];
}

export interface MissionConfig {
  id: string;
  type: MissionType;
  label: string;
  rewardAmount: number;
  enabled: boolean;
  targetUrl?: string;
}

export interface UpdateAdMissionSettingInput {
  adEnabled?: boolean;
  adDailyLimit?: number;
  adRewardAmount?: number;
  missionEnabled?: boolean;
  missions?: Omit<MissionConfig, "id">[];
}
