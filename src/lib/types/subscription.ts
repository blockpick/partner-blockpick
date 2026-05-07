import type { Plan } from "@/lib/types/plan";

export type { Plan };

export type BillingCycle = "MONTHLY" | "YEARLY";

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
