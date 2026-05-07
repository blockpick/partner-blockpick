"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrandInfo, useUpdateBrandInfo } from "@/lib/hooks/use-brand";
import { BRAND_CATEGORY_LABELS } from "@/lib/types/brand";
import type { BrandCategory } from "@/lib/types/brand";

const schema = z.object({
  businessName: z.string().min(1, "사업자명을 입력해주세요"),
  representative: z.string().min(1, "대표자명을 입력해주세요"),
  businessNumber: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{5}$/, "사업자 등록번호 형식을 확인해주세요 (예: 123-45-67890)"),
  category: z.enum([
    "FOOD",
    "FASHION",
    "BEAUTY",
    "ELECTRONICS",
    "SPORTS",
    "TRAVEL",
    "FINANCE",
    "EDUCATION",
    "HEALTH",
    "OTHER",
  ] as const),
  websiteUrl: z.string().url("올바른 URL을 입력해주세요").or(z.literal("")),
  contactEmail: z.string().email("올바른 이메일을 입력해주세요"),
  contactPhone: z.string().min(1, "연락처를 입력해주세요"),
});

type FormValues = z.infer<typeof schema>;

export default function BrandInfoPage() {
  const { data, isLoading } = useBrandInfo();
  const update = useUpdateBrandInfo();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: "",
      representative: "",
      businessNumber: "",
      category: "OTHER",
      websiteUrl: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        businessName: data.businessName,
        representative: data.representative,
        businessNumber: data.businessNumber,
        category: data.category,
        websiteUrl: data.websiteUrl,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      });
    }
  }, [data, reset]);

  const onSubmit = (values: FormValues) => {
    update.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">브랜드 기본정보</h1>
        <p className="text-sm text-muted-foreground">
          사업자 정보 및 브랜드 연락처를 관리합니다
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>사업자 정보</CardTitle>
            <CardDescription>
              블록픽 운영에 필요한 공식 사업자 정보를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">
                  사업자명 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="businessName"
                  placeholder="(주)어드록"
                  {...register("businessName")}
                />
                {errors.businessName && (
                  <p className="text-xs text-destructive">{errors.businessName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="representative">
                  대표자 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="representative"
                  placeholder="홍길동"
                  {...register("representative")}
                />
                {errors.representative && (
                  <p className="text-xs text-destructive">{errors.representative.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessNumber">
                  사업자 등록번호 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="businessNumber"
                  placeholder="123-45-67890"
                  {...register("businessNumber")}
                />
                {errors.businessNumber && (
                  <p className="text-xs text-destructive">{errors.businessNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  업종/카테고리 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("category")}
                  onValueChange={(val) => setValue("category", val as BrandCategory, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(BRAND_CATEGORY_LABELS) as [BrandCategory, string][]).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">웹사이트</Label>
              <Input
                id="websiteUrl"
                placeholder="https://example.com"
                {...register("websiteUrl")}
              />
              {errors.websiteUrl && (
                <p className="text-xs text-destructive">{errors.websiteUrl.message}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  문의 이메일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@example.com"
                  {...register("contactEmail")}
                />
                {errors.contactEmail && (
                  <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  문의 전화 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="02-1234-5678"
                  {...register("contactPhone")}
                />
                {errors.contactPhone && (
                  <p className="text-xs text-destructive">{errors.contactPhone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={!isDirty || update.isPending}
          >
            {update.isPending ? "저장 중..." : "변경사항 저장"}
          </Button>
        </div>
      </form>
    </div>
  );
}
