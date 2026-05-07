import { gqlRequest } from "./client";
import type {
  BrandInfo,
  BrandLogoColor,
  ShareTextTemplate,
  BrandDisclaimer,
  UpdateBrandInfoInput,
  UpdateLogoColorInput,
  UpdateShareTextInput,
  UpdateDisclaimerInput,
} from "@/lib/types/brand";

// ── 목 데이터 (백엔드 미머지 fallback) ──────────────────────────────────────
const MOCK_BRAND_INFO: BrandInfo = {
  id: "mock-brand-1",
  partnerId: "mock-partner-1",
  businessName: "(주)어드록",
  representative: "심재형",
  businessNumber: "123-45-67890",
  category: "OTHER",
  websiteUrl: "https://adrock.me",
  contactEmail: "contact@adrock.me",
  contactPhone: "02-1234-5678",
  updatedAt: new Date().toISOString(),
};

const MOCK_LOGO_COLOR: BrandLogoColor = {
  logoUrl: null,
  primaryColor: "#6366F1",
  secondaryColor: "#8B5CF6",
};

const MOCK_SHARE_TEXT: ShareTextTemplate = {
  kakao: "{{캠페인명}} 참여하고 {{혜택}} 받아가세요! 참여 기간: {{기간}}",
  sms: "[블록픽] {{캠페인명}} - {{혜택}} / {{기간}}",
  link: "{{캠페인명}} 이벤트에 참여해보세요. {{혜택}} 기회! ({{기간}})",
};

const MOCK_DISCLAIMER: BrandDisclaimer = {
  ko: "본 이벤트는 당사의 사정에 따라 변경 또는 조기 종료될 수 있습니다. 당첨자 발표 후 개인정보 미제공 시 당첨이 취소됩니다.",
  en: "This event may be changed or terminated early at the discretion of the company. If personal information is not provided after winner announcement, the award will be cancelled.",
};

// ── GraphQL 쿼리/뮤테이션 ────────────────────────────────────────────────────
const GET_BRAND_INFO_QUERY = `
  query GetBrandInfo {
    brandInfo {
      id partnerId businessName representative businessNumber
      category websiteUrl contactEmail contactPhone updatedAt
    }
  }
`;

const GET_LOGO_COLOR_QUERY = `
  query GetBrandLogoColor {
    brandLogoColor { logoUrl primaryColor secondaryColor }
  }
`;

const GET_SHARE_TEXT_QUERY = `
  query GetShareText {
    shareText { kakao sms link }
  }
`;

const GET_DISCLAIMER_QUERY = `
  query GetDisclaimer {
    disclaimer { ko en }
  }
`;

const UPDATE_BRAND_INFO_MUTATION = `
  mutation UpdateBrandInfo($input: UpdateBrandInfoInput!) {
    updateBrandInfo(input: $input) {
      id businessName representative businessNumber
      category websiteUrl contactEmail contactPhone updatedAt
    }
  }
`;

const UPDATE_LOGO_COLOR_MUTATION = `
  mutation UpdateLogoColor($input: UpdateLogoColorInput!) {
    updateLogoColor(input: $input) { logoUrl primaryColor secondaryColor }
  }
`;

const UPDATE_SHARE_TEXT_MUTATION = `
  mutation UpdateShareText($input: UpdateShareTextInput!) {
    updateShareText(input: $input) { kakao sms link }
  }
`;

const UPDATE_DISCLAIMER_MUTATION = `
  mutation UpdateDisclaimer($input: UpdateDisclaimerInput!) {
    updateDisclaimer(input: $input) { ko en }
  }
`;

async function safeGql<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const brandService = {
  async getBrandInfo(): Promise<BrandInfo> {
    return safeGql(async () => {
      const data = await gqlRequest<{ brandInfo: BrandInfo }>(GET_BRAND_INFO_QUERY);
      return data.brandInfo;
    }, MOCK_BRAND_INFO);
  },

  async getLogoColor(): Promise<BrandLogoColor> {
    return safeGql(async () => {
      const data = await gqlRequest<{ brandLogoColor: BrandLogoColor }>(GET_LOGO_COLOR_QUERY);
      return data.brandLogoColor;
    }, MOCK_LOGO_COLOR);
  },

  async getShareText(): Promise<ShareTextTemplate> {
    return safeGql(async () => {
      const data = await gqlRequest<{ shareText: ShareTextTemplate }>(GET_SHARE_TEXT_QUERY);
      return data.shareText;
    }, MOCK_SHARE_TEXT);
  },

  async getDisclaimer(): Promise<BrandDisclaimer> {
    return safeGql(async () => {
      const data = await gqlRequest<{ disclaimer: BrandDisclaimer }>(GET_DISCLAIMER_QUERY);
      return data.disclaimer;
    }, MOCK_DISCLAIMER);
  },

  async updateBrandInfo(input: UpdateBrandInfoInput): Promise<BrandInfo> {
    return safeGql(async () => {
      const data = await gqlRequest<{ updateBrandInfo: BrandInfo }>(
        UPDATE_BRAND_INFO_MUTATION,
        { input },
      );
      return data.updateBrandInfo;
    }, { ...MOCK_BRAND_INFO, ...input, updatedAt: new Date().toISOString() });
  },

  async updateLogoColor(input: UpdateLogoColorInput): Promise<BrandLogoColor> {
    return safeGql(async () => {
      const data = await gqlRequest<{ updateLogoColor: BrandLogoColor }>(
        UPDATE_LOGO_COLOR_MUTATION,
        { input },
      );
      return data.updateLogoColor;
    }, { ...MOCK_LOGO_COLOR, primaryColor: input.primaryColor, secondaryColor: input.secondaryColor });
  },

  async updateShareText(input: UpdateShareTextInput): Promise<ShareTextTemplate> {
    return safeGql(async () => {
      const data = await gqlRequest<{ updateShareText: ShareTextTemplate }>(
        UPDATE_SHARE_TEXT_MUTATION,
        { input },
      );
      return data.updateShareText;
    }, { ...MOCK_SHARE_TEXT, ...input });
  },

  async updateDisclaimer(input: UpdateDisclaimerInput): Promise<BrandDisclaimer> {
    return safeGql(async () => {
      const data = await gqlRequest<{ updateDisclaimer: BrandDisclaimer }>(
        UPDATE_DISCLAIMER_MUTATION,
        { input },
      );
      return data.updateDisclaimer;
    }, { ...MOCK_DISCLAIMER, ...input });
  },

  async uploadLogo(file: File): Promise<string> {
    // TODO: S3 사전서명 URL 연동 (PG 사업자 선정 후)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  },
};
