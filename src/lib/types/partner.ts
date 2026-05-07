export type PartnerRole = "OWNER" | "ADMIN" | "OPERATOR" | "VIEWER";

export interface Partner {
  id: string;
  name: string;
  displayName: string;
  logoUrl?: string;
  primaryColor?: string;
  officialUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerMember {
  id: string;
  partnerId: string;
  userId: string;
  role: PartnerRole;
  email: string;
  name: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Me {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  partnerId: string;
  partnerRole: PartnerRole;
  partner: Partner;
}
