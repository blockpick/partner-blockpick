import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/lib/api/settings.service";
import type {
  BusinessInfo,
  CsInfo,
  NotificationPrefs,
} from "@/lib/types/settings";

export const BUSINESS_QUERY_KEY = ["settings", "business"] as const;
export const CS_QUERY_KEY = ["settings", "cs"] as const;
export const NOTIFICATIONS_QUERY_KEY = ["settings", "notifications"] as const;
export const SESSIONS_QUERY_KEY = ["settings", "sessions"] as const;

export function useBusinessInfo() {
  return useQuery({
    queryKey: BUSINESS_QUERY_KEY,
    queryFn: () => settingsService.getBusinessInfo(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateBusinessInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BusinessInfo) =>
      settingsService.updateBusinessInfo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_QUERY_KEY });
    },
  });
}

export function useCsInfo() {
  return useQuery({
    queryKey: CS_QUERY_KEY,
    queryFn: () => settingsService.getCsInfo(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateCsInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CsInfo) => settingsService.updateCsInfo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CS_QUERY_KEY });
    },
  });
}

export function useNotificationPrefs() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => settingsService.getNotificationPrefs(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateNotificationPrefs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NotificationPrefs) =>
      settingsService.updateNotificationPrefs(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}

export function useSessions() {
  return useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: () => settingsService.getSessions(),
    staleTime: 1000 * 60,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      settingsService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => settingsService.changePassword({ currentPassword, newPassword }),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => settingsService.deleteAccount(password),
  });
}
