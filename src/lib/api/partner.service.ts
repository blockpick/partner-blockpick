import { gqlRequest } from "./client";
import type { Partner, PartnerMember } from "@/lib/types/partner";

const PARTNER_QUERY = `
  query MyPartner {
    myPartner {
      id
      name
      displayName
      logoUrl
      primaryColor
      officialUrl
      description
      createdAt
      updatedAt
    }
  }
`;

const MEMBERS_QUERY = `
  query PartnerMembers {
    partnerMembers {
      id
      partnerId
      userId
      role
      email
      name
      avatarUrl
      joinedAt
    }
  }
`;

const UPDATE_PARTNER_MUTATION = `
  mutation UpdatePartner($input: UpdatePartnerInput!) {
    updatePartner(input: $input) {
      id
      name
      displayName
      logoUrl
      primaryColor
      officialUrl
      description
    }
  }
`;

const INVITE_MEMBER_MUTATION = `
  mutation InvitePartnerMember($email: String!, $role: PartnerRole!) {
    invitePartnerMember(email: $email, role: $role) {
      id
      email
      role
    }
  }
`;

export const partnerService = {
  async getPartner(): Promise<Partner> {
    const data = await gqlRequest<{ myPartner: Partner }>(PARTNER_QUERY);
    return data.myPartner;
  },

  async getMembers(): Promise<PartnerMember[]> {
    const data = await gqlRequest<{ partnerMembers: PartnerMember[] }>(MEMBERS_QUERY);
    return data.partnerMembers;
  },

  async updatePartner(input: Partial<Partner>): Promise<Partner> {
    const data = await gqlRequest<{ updatePartner: Partner }>(
      UPDATE_PARTNER_MUTATION,
      { input },
    );
    return data.updatePartner;
  },

  async inviteMember(
    email: string,
    role: PartnerMember["role"],
  ): Promise<Pick<PartnerMember, "id" | "email" | "role">> {
    const data = await gqlRequest<{
      invitePartnerMember: Pick<PartnerMember, "id" | "email" | "role">;
    }>(INVITE_MEMBER_MUTATION, { email, role });
    return data.invitePartnerMember;
  },
};
