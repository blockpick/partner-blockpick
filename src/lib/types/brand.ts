export type BrandCategory =
  | "FOOD"
  | "FASHION"
  | "BEAUTY"
  | "ELECTRONICS"
  | "SPORTS"
  | "TRAVEL"
  | "FINANCE"
  | "EDUCATION"
  | "HEALTH"
  | "OTHER";

export const BRAND_CATEGORY_LABELS: Record<BrandCategory, string> = {
  FOOD: "식품/음료",
  FASHION: "패션/의류",
  BEAUTY: "뷰티/코스메틱",
  ELECTRONICS: "전자/IT",
  SPORTS: "스포츠/아웃도어",
  TRAVEL: "여행/레저",
  FINANCE: "금융/보험",
  EDUCATION: "교육/학습",
  HEALTH: "건강/의료",
  OTHER: "기타",
};

export interface BrandInfo {
  id: string;
  partnerId: string;
  businessName: string;
  representative: string;
  businessNumber: string;
  category: BrandCategory;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  updatedAt: string;
}

export interface BrandLogoColor {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

export interface ShareTextTemplate {
  kakao: string;
  sms: string;
  link: string;
}

export interface BrandDisclaimer {
  ko: string;
  en: string;
}

export interface Brand {
  info: BrandInfo;
  logoColor: BrandLogoColor;
  shareText: ShareTextTemplate;
  disclaimer: BrandDisclaimer;
}

export interface UpdateBrandInfoInput {
  businessName: string;
  representative: string;
  businessNumber: string;
  category: BrandCategory;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
}

export interface UpdateLogoColorInput {
  primaryColor: string;
  secondaryColor: string;
  logoBase64?: string;
}

export interface UpdateShareTextInput {
  kakao: string;
  sms: string;
  link: string;
}

export interface UpdateDisclaimerInput {
  ko: string;
  en: string;
}
