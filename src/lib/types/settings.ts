export interface BusinessInfo {
  companyName: string;
  businessNumber: string;
  representativeName: string;
  address: string;
  taxEmail: string;
  updatedAt?: string;
}

export interface CsInfo {
  csEmail: string;
  csPhone: string;
  operatingHours: string;
  autoReplyMessage: string;
  updatedAt?: string;
}

export type NotificationChannel = "EMAIL" | "SMS" | "SLACK";

export interface NotificationPrefs {
  paymentFailure: boolean;
  campaignEnd: boolean;
  reportReceived: boolean;
  securityAlert: boolean;
  marketing: boolean;
  channels: NotificationChannel[];
  slackWebhookUrl?: string;
  updatedAt?: string;
}

export interface AccountInfo {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface SessionInfo {
  id: string;
  deviceName: string;
  deviceType: "DESKTOP" | "MOBILE" | "TABLET" | "UNKNOWN";
  ipAddress: string;
  location?: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
