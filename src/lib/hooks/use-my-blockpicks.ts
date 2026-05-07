import { useQuery } from "@tanstack/react-query";
import { blockpickService } from "@/lib/api/blockpick.service";
import type { BlockpickFilter } from "@/lib/types/blockpick";

export const BLOCKPICKS_QUERY_KEY = (filter?: BlockpickFilter) =>
  ["blockpicks", filter] as const;

export const BLOCKPICK_KPI_QUERY_KEY = ["blockpick-kpi"] as const;

export function useMyBlockpicks(filter?: BlockpickFilter) {
  return useQuery({
    queryKey: BLOCKPICKS_QUERY_KEY(filter),
    queryFn: () => blockpickService.list(filter),
    staleTime: 1000 * 30, // 30초
  });
}

export function useBlockpickKpi() {
  return useQuery({
    queryKey: BLOCKPICK_KPI_QUERY_KEY,
    queryFn: () => blockpickService.kpi(),
    staleTime: 1000 * 60, // 1분
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
