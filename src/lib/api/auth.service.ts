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
  mutation PartnerLogin($email: String!, $password: String!) {
    partnerLogin(email: $email, password: $password) {
      accessToken
      refreshToken
      me {
        id
        email
        name
        avatarUrl
        partnerId
        partnerRole
        partner {
          id
          name
          displayName
          logoUrl
          primaryColor
        }
      }
    }
  }
`;

const ME_QUERY = `
  query PartnerMe {
    partnerMe {
      id
      email
      name
      avatarUrl
      partnerId
      partnerRole
      partner {
        id
        name
        displayName
        logoUrl
        primaryColor
        officialUrl
        description
      }
    }
  }
`;

const LOGOUT_MUTATION = `
  mutation PartnerLogout {
    partnerLogout
  }
`;

export const authService = {
  async login(input: LoginInput): Promise<AuthPayload> {
    const data = await gqlRequest<{ partnerLogin: AuthPayload }>(
      LOGIN_MUTATION,
      { email: input.email, password: input.password },
    );
    const payload = data.partnerLogin;
    setTokens(payload.accessToken, payload.refreshToken);
    return payload;
  },

  async me(): Promise<Me> {
    const data = await gqlRequest<{ partnerMe: Me }>(ME_QUERY);
    return data.partnerMe;
  },

  async logout(): Promise<void> {
    try {
      await gqlRequest(LOGOUT_MUTATION);
    } finally {
      clearTokens();
    }
  },
};
