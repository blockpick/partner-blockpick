import { gqlRequest, setTokens, clearTokens } from "./client";
import type { Me } from "@/lib/types/partner";

interface LoginInput {
  email: string;
  password: string;
}

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  me: Me;
}

const LOGIN_MUTATION = `
  mutation PartnerLogin($input: LoginRequest!) {
    login(input: $input) {
      success
      code
      message
      accessToken
      refreshToken
      user {
        id
        email
        nickname
        profileImageUrl
      }
    }
  }
`;

const ME_QUERY = `
  query PartnerMe {
    me {
      success
      user {
        id
        email
        nickname
        profileImageUrl
      }
    }
    myPartner {
      success
      partner {
        id
        name
        logoUrl
        websiteUrl
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const authService = {
  async login(input: LoginInput): Promise<AuthPayload> {
    const data = await gqlRequest<{
      login: {
        success: boolean;
        code: string;
        message: string;
        accessToken?: string | null;
        refreshToken?: string | null;
      };
    }>(
      LOGIN_MUTATION,
      { input },
    );
    const payload = data.login;
    if (!payload.success || !payload.accessToken || !payload.refreshToken) {
      throw new Error(payload.message || "로그인에 실패했습니다.");
    }
    setTokens(payload.accessToken, payload.refreshToken);
    const me = await authService.me();
    return {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      me,
    };
  },

  async me(): Promise<Me> {
    const data = await gqlRequest<{
      me: {
        success: boolean;
        user?: {
          id: string;
          email: string;
          nickname?: string | null;
          profileImageUrl?: string | null;
        } | null;
      };
      myPartner: {
        success: boolean;
        partner?: {
          id: string;
          name: string;
          logoUrl?: string | null;
          websiteUrl?: string | null;
          description?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null;
      };
    }>(ME_QUERY);

    const user = data.me.user;
    const partner = data.myPartner.partner;
    if (!user || !partner) {
      throw new Error("파트너 정보를 불러오지 못했습니다.");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.nickname || user.email.split("@")[0],
      avatarUrl: user.profileImageUrl || undefined,
      partnerId: partner.id,
      partnerRole: "OWNER",
      partner: {
        id: partner.id,
        name: partner.name,
        displayName: partner.name,
        logoUrl: partner.logoUrl || undefined,
        primaryColor: undefined,
        officialUrl: partner.websiteUrl || undefined,
        description: partner.description || undefined,
        createdAt: partner.createdAt || new Date().toISOString(),
        updatedAt: partner.updatedAt || new Date().toISOString(),
      },
    };
  },

  async logout(): Promise<void> {
    clearTokens();
  },
};
