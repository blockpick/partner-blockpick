import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/api/auth.service";
import { getAccessToken } from "@/lib/api/client";

export const ME_QUERY_KEY = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: () => authService.me(),
    enabled: typeof window !== "undefined" && !!getAccessToken(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
