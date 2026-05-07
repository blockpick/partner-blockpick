import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamService } from "@/lib/api/team.service";
import type { ActivityLogFilter, TeamRole } from "@/lib/types/team";

export const TEAM_MEMBERS_QUERY_KEY = ["team", "members"] as const;
export const TEAM_ACTIVITY_QUERY_KEY = (filter?: ActivityLogFilter) =>
  ["team", "activity", filter] as const;

export function useTeamMembers() {
  return useQuery({
    queryKey: TEAM_MEMBERS_QUERY_KEY,
    queryFn: () => teamService.getMembers(),
    staleTime: 1000 * 60,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: TeamRole }) =>
      teamService.inviteMember(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_QUERY_KEY });
    },
  });
}

export function useChangeRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: TeamRole }) =>
      teamService.changeRole(memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_QUERY_KEY });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => teamService.removeMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_QUERY_KEY });
    },
  });
}

export function useActivityLogs(filter?: ActivityLogFilter) {
  return useQuery({
    queryKey: TEAM_ACTIVITY_QUERY_KEY(filter),
    queryFn: () => teamService.getActivityLogs(filter),
    staleTime: 1000 * 30,
  });
}
