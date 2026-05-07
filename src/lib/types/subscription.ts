export type PlanTier = "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE";
export type BillingCycle = "MONTHLY" | "YEARLY";

export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  features: string[];
  limits: PlanLimits;
}

export interface PlanLimits {
  monthlyParticipants: number;
  activeBlockpicks: number;
  teamMembers: number;
  storageGb: number;
}

export interface Subscription {
  id: string;
  partnerId: string;
  plan: Plan;
  status: "ACTIVE" | "PAST_DUE" | "CANCELLED" | "TRIALING";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface UsageSummary {
  monthlyParticipants: { used: number; limit: number };
  activeBlockpicks: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
  storageGb: { used: number; limit: number };
}

export interface BillingRecord {
  id: string;
  amount: number;
  currency: string;
  status: "PAID" | "PENDING" | "FAILED";
  billedAt: string;
  invoiceUrl?: string;
}
