export type PlanTier = "FREE" | "STARTER" | "GROWTH" | "PRO" | "ENTERPRISE";

export const PLAN_TIER_LABELS: Record<PlanTier, string> = {
  FREE: "무료",
  STARTER: "스타터",
  GROWTH: "그로스",
  PRO: "프로",
  ENTERPRISE: "엔터프라이즈",
};

export const PLAN_PRICES: Partial<Record<PlanTier, number>> = {
  STARTER: 99000,
  GROWTH: 299000,
  PRO: 790000,
};

export interface PlanLimits {
  monthlyBlockpicks: number;
  monthlyParticipants: number;
  gridSize: number;
  teamMembers: number;
  storageGb: number;
}

export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  features: string[];
  limits: PlanLimits;
}

export const PLAN_FEATURES: Record<PlanTier, string[]> = {
  FREE: [
    "블록픽 1개 생성",
    "월 참여자 100명",
    "기본 기능",
  ],
  STARTER: [
    "월 블록픽 5개 생성",
    "월 참여자 1,000명",
    "그리드 최대 9칸",
    "팀 멤버 2명",
    "기본 분석",
  ],
  GROWTH: [
    "월 블록픽 20개 생성",
    "월 참여자 10,000명",
    "그리드 최대 25칸",
    "팀 멤버 5명",
    "고급 분석",
    "카카오/SMS 공유",
  ],
  PRO: [
    "월 블록픽 무제한",
    "월 참여자 무제한",
    "그리드 무제한",
    "팀 멤버 무제한",
    "전체 분석",
    "API 연동",
    "전담 매니저",
  ],
  ENTERPRISE: [
    "모든 PRO 기능 포함",
    "전용 인프라",
    "SLA 보장",
    "맞춤 개발",
    "연간 계약",
  ],
};

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: {
    monthlyBlockpicks: 1,
    monthlyParticipants: 100,
    gridSize: 4,
    teamMembers: 1,
    storageGb: 1,
  },
  STARTER: {
    monthlyBlockpicks: 5,
    monthlyParticipants: 1000,
    gridSize: 9,
    teamMembers: 2,
    storageGb: 5,
  },
  GROWTH: {
    monthlyBlockpicks: 20,
    monthlyParticipants: 10000,
    gridSize: 25,
    teamMembers: 5,
    storageGb: 20,
  },
  PRO: {
    monthlyBlockpicks: -1,
    monthlyParticipants: -1,
    gridSize: -1,
    teamMembers: -1,
    storageGb: 100,
  },
  ENTERPRISE: {
    monthlyBlockpicks: -1,
    monthlyParticipants: -1,
    gridSize: -1,
    teamMembers: -1,
    storageGb: -1,
  },
};
