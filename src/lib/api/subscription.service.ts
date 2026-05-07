import { gqlRequest } from "./client";
import type { Plan, PlanTier } from "@/lib/types/plan";
import {
  PLAN_FEATURES,
  PLAN_LIMITS,
  PLAN_PRICES,
  PLAN_TIER_LABELS,
} from "@/lib/types/plan";
import type { Subscription, UsageSummary } from "@/lib/types/subscription";

const MOCK_PLANS: Plan[] = (
  ["STARTER", "GROWTH", "PRO"] as Exclude<PlanTier, "ENTERPRISE" | "FREE">[]
).map((tier) => ({
  id: `plan-${tier.toLowerCase()}`,
  tier,
  name: PLAN_TIER_LABELS[tier],
  priceMonthly: PLAN_PRICES[tier] ?? 0,
  features: PLAN_FEATURES[tier],
  limits: PLAN_LIMITS[tier],
}));

const MOCK_SUBSCRIPTION: Subscription = {
  id: "sub-mock-1",
  partnerId: "mock-partner-1",
  plan: MOCK_PLANS[1], // GROWTH
  status: "ACTIVE",
  currentPeriodStart: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).toISOString(),
  currentPeriodEnd: new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).toISOString(),
  cancelAtPeriodEnd: false,
};

const MOCK_USAGE: UsageSummary = {
  monthlyParticipants: { used: 3241, limit: 10000 },
  activeBlockpicks: { used: 7, limit: 20 },
  teamMembers: { used: 3, limit: 5 },
  storageGb: { used: 4.2, limit: 20 },
};

// ── GraphQL 쿼리/뮤테이션 ────────────────────────────────────────────────────
const MY_SUBSCRIPTION_QUERY = `
  query MySubscription {
    mySubscription {
      id partnerId status currentPeriodStart currentPeriodEnd cancelAtPeriodEnd
      plan {
        id tier name priceMonthly features
        limits { monthlyBlockpicks monthlyParticipants gridSize teamMembers storageGb }
      }
    }
  }
`;

const MY_USAGE_QUERY = `
  query MyUsage {
    myUsage {
      monthlyParticipants { used limit }
      activeBlockpicks { used limit }
      teamMembers { used limit }
      storageGb { used limit }
    }
  }
`;

const AVAILABLE_PLANS_QUERY = `
  query AvailablePlans {
    availablePlans {
      id tier name priceMonthly features
      limits { monthlyBlockpicks monthlyParticipants gridSize teamMembers storageGb }
    }
  }
`;

const CHANGE_PLAN_MUTATION = `
  mutation ChangePlan($planId: String!) {
    changePlan(planId: $planId) {
      id status plan { id tier name }
    }
  }
`;

const CANCEL_SUBSCRIPTION_MUTATION = `
  mutation CancelSubscription {
    cancelSubscription { id cancelAtPeriodEnd }
  }
`;

async function safeGql<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const subscriptionService = {
  async myPlan(): Promise<Subscription> {
    return safeGql(async () => {
      const data = await gqlRequest<{ mySubscription: Subscription }>(MY_SUBSCRIPTION_QUERY);
      return data.mySubscription;
    }, MOCK_SUBSCRIPTION);
  },

  async usage(): Promise<UsageSummary> {
    return safeGql(async () => {
      const data = await gqlRequest<{ myUsage: UsageSummary }>(MY_USAGE_QUERY);
      return data.myUsage;
    }, MOCK_USAGE);
  },

  async plans(): Promise<Plan[]> {
    return safeGql(async () => {
      const data = await gqlRequest<{ availablePlans: Plan[] }>(AVAILABLE_PLANS_QUERY);
      return data.availablePlans;
    }, MOCK_PLANS);
  },

  async changePlan(planId: string): Promise<Subscription> {
    return safeGql(async () => {
      const data = await gqlRequest<{ changePlan: Subscription }>(CHANGE_PLAN_MUTATION, {
        planId,
      });
      return data.changePlan;
    }, { ...MOCK_SUBSCRIPTION, plan: MOCK_PLANS.find((p) => p.id === planId) ?? MOCK_PLANS[0] });
  },

  async cancelSubscription(): Promise<Pick<Subscription, "id" | "cancelAtPeriodEnd">> {
    return safeGql(async () => {
      const data = await gqlRequest<{
        cancelSubscription: Pick<Subscription, "id" | "cancelAtPeriodEnd">;
      }>(CANCEL_SUBSCRIPTION_MUTATION);
      return data.cancelSubscription;
    }, { id: MOCK_SUBSCRIPTION.id, cancelAtPeriodEnd: true });
  },
};
