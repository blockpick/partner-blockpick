import { gqlRequest } from "./client";
import type {
  TeamMember,
  ActivityLog,
  ActivityLogFilter,
  ActivityLogPage,
  TeamRole,
} from "@/lib/types/team";

// ─── Mock 데이터 (백엔드 미머지 시 fallback) ─────────────────────────────────

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    partnerId: "p1",
    userId: "u1",
    email: "owner@example.com",
    name: "김대표",
    role: "OWNER",
    status: "ACTIVE",
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    joinedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "m2",
    partnerId: "p1",
    userId: "u2",
    email: "manager@example.com",
    name: "이매니저",
    role: "MANAGER",
    status: "ACTIVE",
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    joinedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "m3",
    partnerId: "p1",
    userId: "u3",
    email: "viewer@example.com",
    name: "박뷰어",
    role: "VIEWER",
    status: "ACTIVE",
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    joinedAt: "2024-03-10T00:00:00Z",
  },
  {
    id: "m4",
    partnerId: "p1",
    userId: "u4",
    email: "pending@example.com",
    name: "초대중",
    role: "VIEWER",
    status: "INVITED",
    invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    joinedAt: new Date().toISOString(),
  },
];

const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "a1",
    partnerId: "p1",
    userId: "u1",
    userName: "김대표",
    userEmail: "owner@example.com",
    action: "LOGIN",
    description: "로그인하였습니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "a2",
    partnerId: "p1",
    userId: "u2",
    userName: "이매니저",
    userEmail: "manager@example.com",
    action: "BLOCKPICK_CREATE",
    description: "블록픽 '여름 경품 이벤트'를 생성하였습니다.",
    metadata: { blockpickId: "bp1", blockpickTitle: "여름 경품 이벤트" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "a3",
    partnerId: "p1",
    userId: "u1",
    userName: "김대표",
    userEmail: "owner@example.com",
    action: "MEMBER_INVITE",
    description: "pending@example.com 을 VIEWER 역할로 초대하였습니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "a4",
    partnerId: "p1",
    userId: "u2",
    userName: "이매니저",
    userEmail: "manager@example.com",
    action: "BLOCKPICK_EDIT",
    description: "블록픽 '봄 이벤트'를 수정하였습니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "a5",
    partnerId: "p1",
    userId: "u1",
    userName: "김대표",
    userEmail: "owner@example.com",
    action: "BILLING_PAYMENT",
    description: "구독 결제가 완료되었습니다. (₩99,000)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "a6",
    partnerId: "p1",
    userId: "u3",
    userName: "박뷰어",
    userEmail: "viewer@example.com",
    action: "LOGIN",
    description: "로그인하였습니다.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

// ─── GQL 쿼리/뮤테이션 ────────────────────────────────────────────────────────

const TEAM_MEMBERS_QUERY = `
  query TeamMembers {
    teamMembers {
      id
      partnerId
      userId
      email
      name
      avatarUrl
      role
      status
      lastLoginAt
      joinedAt
      invitedAt
    }
  }
`;

const INVITE_MEMBER_MUTATION = `
  mutation InviteTeamMember($email: String!, $role: TeamRole!) {
    inviteTeamMember(email: $email, role: $role) {
      id
      email
      role
      status
    }
  }
`;

const CHANGE_ROLE_MUTATION = `
  mutation ChangeTeamMemberRole($memberId: String!, $role: TeamRole!) {
    changeTeamMemberRole(memberId: $memberId, role: $role) {
      id
      role
    }
  }
`;

const REMOVE_MEMBER_MUTATION = `
  mutation RemoveTeamMember($memberId: String!) {
    removeTeamMember(memberId: $memberId)
  }
`;

const ACTIVITY_LOGS_QUERY = `
  query TeamActivityLogs($filter: ActivityLogFilter) {
    teamActivityLogs(filter: $filter) {
      items {
        id
        partnerId
        userId
        userName
        userEmail
        action
        description
        metadata
        createdAt
      }
      total
      page
      limit
    }
  }
`;

// ─── 서비스 ───────────────────────────────────────────────────────────────────

export const teamService = {
  async getMembers(): Promise<TeamMember[]> {
    try {
      const data = await gqlRequest<{ teamMembers: TeamMember[] }>(
        TEAM_MEMBERS_QUERY,
      );
      return data.teamMembers;
    } catch {
      // 백엔드 미머지 시 mock fallback
      return MOCK_MEMBERS;
    }
  },

  async inviteMember(
    email: string,
    role: TeamRole,
  ): Promise<TeamMember> {
    try {
      const data = await gqlRequest<{ inviteTeamMember: TeamMember }>(
        INVITE_MEMBER_MUTATION,
        { email, role },
      );
      return data.inviteTeamMember;
    } catch {
      const newMember: TeamMember = {
        id: `m${Date.now()}`,
        partnerId: "p1",
        userId: `u${Date.now()}`,
        email,
        name: email.split("@")[0],
        role,
        status: "INVITED",
        invitedAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
      };
      return newMember;
    }
  },

  async changeRole(memberId: string, role: TeamRole): Promise<void> {
    try {
      await gqlRequest(CHANGE_ROLE_MUTATION, { memberId, role });
    } catch {
      // mock: 성공으로 처리
    }
  },

  async removeMember(memberId: string): Promise<void> {
    try {
      await gqlRequest(REMOVE_MEMBER_MUTATION, { memberId });
    } catch {
      // mock: 성공으로 처리
    }
  },

  async getActivityLogs(
    filter?: ActivityLogFilter,
  ): Promise<ActivityLogPage> {
    try {
      const data = await gqlRequest<{ teamActivityLogs: ActivityLogPage }>(
        ACTIVITY_LOGS_QUERY,
        { filter },
      );
      return data.teamActivityLogs;
    } catch {
      const page = filter?.page ?? 1;
      const limit = filter?.limit ?? 20;
      let items = [...MOCK_ACTIVITY_LOGS];
      if (filter?.userId) {
        items = items.filter((l) => l.userId === filter.userId);
      }
      if (filter?.action) {
        items = items.filter((l) => l.action === filter.action);
      }
      if (filter?.startDate) {
        items = items.filter(
          (l) => new Date(l.createdAt) >= new Date(filter.startDate!),
        );
      }
      if (filter?.endDate) {
        items = items.filter(
          (l) => new Date(l.createdAt) <= new Date(filter.endDate!),
        );
      }
      const total = items.length;
      const start = (page - 1) * limit;
      return { items: items.slice(start, start + limit), total, page, limit };
    }
  },
};
