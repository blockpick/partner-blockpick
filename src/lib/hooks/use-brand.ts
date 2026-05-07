import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "@/lib/api/brand.service";
import type {
  UpdateBrandInfoInput,
  UpdateLogoColorInput,
  UpdateShareTextInput,
  UpdateDisclaimerInput,
} from "@/lib/types/brand";

export const BRAND_INFO_QUERY_KEY = ["brand", "info"] as const;
export const BRAND_LOGO_COLOR_QUERY_KEY = ["brand", "logo-color"] as const;
export const BRAND_SHARE_TEXT_QUERY_KEY = ["brand", "share-text"] as const;
export const BRAND_DISCLAIMER_QUERY_KEY = ["brand", "disclaimer"] as const;

export function useBrandInfo() {
  return useQuery({
    queryKey: BRAND_INFO_QUERY_KEY,
    queryFn: () => brandService.getBrandInfo(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBrandLogoColor() {
  return useQuery({
    queryKey: BRAND_LOGO_COLOR_QUERY_KEY,
    queryFn: () => brandService.getLogoColor(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBrandShareText() {
  return useQuery({
    queryKey: BRAND_SHARE_TEXT_QUERY_KEY,
    queryFn: () => brandService.getShareText(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useBrandDisclaimer() {
  return useQuery({
    queryKey: BRAND_DISCLAIMER_QUERY_KEY,
    queryFn: () => brandService.getDisclaimer(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateBrandInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBrandInfoInput) => brandService.updateBrandInfo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_INFO_QUERY_KEY });
    },
  });
}

export function useUpdateLogoColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateLogoColorInput) => brandService.updateLogoColor(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_LOGO_COLOR_QUERY_KEY });
    },
  });
}

export function useUpdateShareText() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateShareTextInput) => brandService.updateShareText(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_SHARE_TEXT_QUERY_KEY });
    },
  });
}

export function useUpdateDisclaimer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateDisclaimerInput) => brandService.updateDisclaimer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_DISCLAIMER_QUERY_KEY });
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => brandService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_LOGO_COLOR_QUERY_KEY });
    },
  });
}
