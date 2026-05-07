export type TeamRole = "OWNER" | "MANAGER" | "VIEWER";

export type MemberStatus = "ACTIVE" | "INVITED" | "INACTIVE";

export interface TeamMember {
  id: string;
  partnerId: string;
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: TeamRole;
  status: MemberStatus;
  lastLoginAt?: string;
  joinedAt: string;
  invitedAt?: string;
}

export interface TeamInvite {
  id: string;
  email: string;
  role: TeamRole;
  invitedAt: string;
  expiresAt: string;
}

export type PermissionKey =
  | "blockpick_create"
  | "blockpick_edit"
  | "blockpick_end"
  | "participant_view"
  | "analytics_view"
  | "billing_manage"
  | "team_manage"
  | "brand_manage";

export interface Permission {
  key: PermissionKey;
  label: string;
  description: string;
}

export type RolePermissionMatrix = Record<TeamRole, Record<PermissionKey, boolean>>;

export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "BLOCKPICK_CREATE"
  | "BLOCKPICK_EDIT"
  | "BLOCKPICK_END"
  | "MEMBER_INVITE"
  | "MEMBER_REMOVE"
  | "ROLE_CHANGE"
  | "BILLING_PAYMENT"
  | "SETTINGS_UPDATE";

export interface ActivityLog {
  id: string;
  partnerId: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface ActivityLogFilter {
  userId?: string;
  action?: ActivityAction;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogPage {
  items: ActivityLog[];
  total: number;
  page: number;
  limit: number;
}
