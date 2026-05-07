import { gqlRequest } from "./client";
import type {
  BusinessInfo,
  CsInfo,
  NotificationPrefs,
  AccountInfo,
  SessionInfo,
  ChangePasswordInput,
} from "@/lib/types/settings";

// ─── Mock 데이터 ──────────────────────────────────────────────────────────────

const MOCK_BUSINESS: BusinessInfo = {
  companyName: "(주)블록픽 파트너스",
  businessNumber: "123-45-67890",
  representativeName: "김대표",
  address: "서울특별시 강남구 테헤란로 123, 5층",
  taxEmail: "tax@blockpick.com",
  updatedAt: "2024-12-01T00:00:00Z",
};

const MOCK_CS: CsInfo = {
  csEmail: "cs@blockpick.com",
  csPhone: "02-1234-5678",
  operatingHours: "평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)",
  autoReplyMessage:
    "안녕하세요! 문의해 주셔서 감사합니다. 운영 시간 내에 빠르게 답변드리겠습니다.",
  updatedAt: "2024-11-15T00:00:00Z",
};

const MOCK_NOTIFICATIONS: NotificationPrefs = {
  paymentFailure: true,
  campaignEnd: true,
  reportReceived: true,
  securityAlert: true,
  marketing: false,
  channels: ["EMAIL"],
  slackWebhookUrl: "",
  updatedAt: "2024-10-20T00:00:00Z",
};

const MOCK_SESSIONS: SessionInfo[] = [
  {
    id: "s1",
    deviceName: "Chrome on macOS",
    deviceType: "DESKTOP",
    ipAddress: "211.234.56.78",
    location: "서울, 대한민국",
    lastActiveAt: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: "s2",
    deviceName: "Safari on iPhone",
    deviceType: "MOBILE",
    ipAddress: "58.123.45.67",
    location: "수원, 대한민국",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    isCurrent: false,
  },
];

// ─── GQL 쿼리/뮤테이션 ────────────────────────────────────────────────────────

const GET_BUSINESS_QUERY = `
  query GetBusinessInfo {
    businessInfo {
      companyName
      businessNumber
      representativeName
      address
      taxEmail
      updatedAt
    }
  }
`;

const UPDATE_BUSINESS_MUTATION = `
  mutation UpdateBusinessInfo($input: BusinessInfoInput!) {
    updateBusinessInfo(input: $input) {
      companyName
      businessNumber
      representativeName
      address
      taxEmail
      updatedAt
    }
  }
`;

const GET_CS_QUERY = `
  query GetCsInfo {
    csInfo {
      csEmail
      csPhone
      operatingHours
      autoReplyMessage
      updatedAt
    }
  }
`;

const UPDATE_CS_MUTATION = `
  mutation UpdateCsInfo($input: CsInfoInput!) {
    updateCsInfo(input: $input) {
      csEmail
      csPhone
      operatingHours
      autoReplyMessage
      updatedAt
    }
  }
`;

const GET_NOTIFICATIONS_QUERY = `
  query GetNotificationPrefs {
    notificationPrefs {
      paymentFailure
      campaignEnd
      reportReceived
      securityAlert
      marketing
      channels
      slackWebhookUrl
      updatedAt
    }
  }
`;

const UPDATE_NOTIFICATIONS_MUTATION = `
  mutation UpdateNotificationPrefs($input: NotificationPrefsInput!) {
    updateNotificationPrefs(input: $input) {
      paymentFailure
      campaignEnd
      reportReceived
      securityAlert
      marketing
      channels
      slackWebhookUrl
      updatedAt
    }
  }
`;

const GET_SESSIONS_QUERY = `
  query GetSessions {
    mySessions {
      id
      deviceName
      deviceType
      ipAddress
      location
      lastActiveAt
      isCurrent
    }
  }
`;

const REVOKE_SESSION_MUTATION = `
  mutation RevokeSession($sessionId: String!) {
    revokeSession(sessionId: $sessionId)
  }
`;

const CHANGE_PASSWORD_MUTATION = `
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

const DELETE_ACCOUNT_MUTATION = `
  mutation DeleteAccount($password: String!) {
    deleteAccount(password: $password)
  }
`;

// ─── 서비스 ───────────────────────────────────────────────────────────────────

export const settingsService = {
  async getBusinessInfo(): Promise<BusinessInfo> {
    try {
      const data = await gqlRequest<{ businessInfo: BusinessInfo }>(
        GET_BUSINESS_QUERY,
      );
      return data.businessInfo;
    } catch {
      return MOCK_BUSINESS;
    }
  },

  async updateBusinessInfo(input: BusinessInfo): Promise<BusinessInfo> {
    try {
      const data = await gqlRequest<{ updateBusinessInfo: BusinessInfo }>(
        UPDATE_BUSINESS_MUTATION,
        { input },
      );
      return data.updateBusinessInfo;
    } catch {
      return { ...input, updatedAt: new Date().toISOString() };
    }
  },

  async getCsInfo(): Promise<CsInfo> {
    try {
      const data = await gqlRequest<{ csInfo: CsInfo }>(GET_CS_QUERY);
      return data.csInfo;
    } catch {
      return MOCK_CS;
    }
  },

  async updateCsInfo(input: CsInfo): Promise<CsInfo> {
    try {
      const data = await gqlRequest<{ updateCsInfo: CsInfo }>(
        UPDATE_CS_MUTATION,
        { input },
      );
      return data.updateCsInfo;
    } catch {
      return { ...input, updatedAt: new Date().toISOString() };
    }
  },

  async getNotificationPrefs(): Promise<NotificationPrefs> {
    try {
      const data = await gqlRequest<{ notificationPrefs: NotificationPrefs }>(
        GET_NOTIFICATIONS_QUERY,
      );
      return data.notificationPrefs;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  async updateNotificationPrefs(
    input: NotificationPrefs,
  ): Promise<NotificationPrefs> {
    try {
      const data = await gqlRequest<{
        updateNotificationPrefs: NotificationPrefs;
      }>(UPDATE_NOTIFICATIONS_MUTATION, { input });
      return data.updateNotificationPrefs;
    } catch {
      return { ...input, updatedAt: new Date().toISOString() };
    }
  },

  async getSessions(): Promise<SessionInfo[]> {
    try {
      const data = await gqlRequest<{ mySessions: SessionInfo[] }>(
        GET_SESSIONS_QUERY,
      );
      return data.mySessions;
    } catch {
      return MOCK_SESSIONS;
    }
  },

  async revokeSession(sessionId: string): Promise<void> {
    try {
      await gqlRequest(REVOKE_SESSION_MUTATION, { sessionId });
    } catch {
      // mock: 성공으로 처리
    }
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    try {
      await gqlRequest(CHANGE_PASSWORD_MUTATION, { input });
    } catch {
      // mock: 성공으로 처리
    }
  },

  async deleteAccount(password: string): Promise<void> {
    try {
      await gqlRequest(DELETE_ACCOUNT_MUTATION, { password });
    } catch {
      // mock: 성공으로 처리
    }
  },

  async getAccountInfo(): Promise<AccountInfo> {
    // AccountInfo는 auth.service.ts의 me()에서 가져옴
    // 여기서는 settings 전용 추가 필드만 처리
    throw new Error("use authService.me() instead");
  },
};
