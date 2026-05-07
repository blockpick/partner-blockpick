import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "@/lib/api/subscription.service";
import { paymentService } from "@/lib/api/payment.service";

export const MY_PLAN_QUERY_KEY = ["subscription", "plan"] as const;
export const USAGE_QUERY_KEY = ["subscription", "usage"] as const;
export const AVAILABLE_PLANS_QUERY_KEY = ["subscription", "plans"] as const;
export const PAYMENT_METHODS_QUERY_KEY = ["payment", "methods"] as const;
export const INVOICES_QUERY_KEY = ["payment", "invoices"] as const;

export function useMyPlan() {
  return useQuery({
    queryKey: MY_PLAN_QUERY_KEY,
    queryFn: () => subscriptionService.myPlan(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUsage() {
  return useQuery({
    queryKey: USAGE_QUERY_KEY,
    queryFn: () => subscriptionService.usage(),
    staleTime: 1000 * 60,
  });
}

export function useAvailablePlans() {
  return useQuery({
    queryKey: AVAILABLE_PLANS_QUERY_KEY,
    queryFn: () => subscriptionService.plans(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => subscriptionService.changePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PLAN_QUERY_KEY });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subscriptionService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_PLAN_QUERY_KEY });
    },
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEY,
    queryFn: () => paymentService.paymentMethods(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: () => paymentService.invoices(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => paymentService.addPaymentMethod(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
    },
  });
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentService.setDefaultPaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
    },
  });
}

export function useRemovePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentService.removePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
    },
  });
}
