import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blockpickService } from "@/lib/api/blockpick.service";
import type { BlockpickFilter, BlockpickInput } from "@/lib/types/blockpick";

export const BLOCKPICKS_QUERY_KEY = (filter?: BlockpickFilter) =>
  ["blockpicks", filter] as const;

export const BLOCKPICK_KPI_QUERY_KEY = ["blockpick-kpi"] as const;

export function useMyBlockpicks(filter?: BlockpickFilter) {
  return useQuery({
    queryKey: BLOCKPICKS_QUERY_KEY(filter),
    queryFn: () => blockpickService.list(filter),
    staleTime: 1000 * 30,
  });
}

export function useBlockpickKpi() {
  return useQuery({
    queryKey: BLOCKPICK_KPI_QUERY_KEY,
    queryFn: () => blockpickService.kpi(),
    staleTime: 1000 * 60,
  });
}

export function useBlockpickDetail(id: string) {
  return useQuery({
    queryKey: ["blockpick", id] as const,
    queryFn: () => blockpickService.detail(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}

export function useCreateBlockpick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      input,
      status,
    }: {
      input: Omit<BlockpickInput, "status">;
      status: BlockpickInput["status"];
    }) => blockpickService.create(input, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockpicks"] });
    },
  });
}

export function useUpdateBlockpick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Omit<BlockpickInput, "status">;
    }) => blockpickService.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["blockpick", id] });
      queryClient.invalidateQueries({ queryKey: ["blockpicks"] });
    },
  });
}

export function useEndBlockpick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blockpickService.end(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockpicks"] });
    },
  });
}

export function useDuplicateBlockpick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blockpickService.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockpicks"] });
    },
  });
}

export function usePreviewBlockpick() {
  return useMutation({
    mutationFn: (input: Omit<BlockpickInput, "status">) =>
      blockpickService.preview(input),
  });
}
