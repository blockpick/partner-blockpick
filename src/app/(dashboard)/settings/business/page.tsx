"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Building2, AlertCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useBusinessInfo, useUpdateBusinessInfo } from "@/lib/hooks/use-settings";
import type { BusinessInfo } from "@/lib/types/settings";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function SettingsBusinessPage() {
  const { data, isLoading } = useBusinessInfo();
  const updateMutation = useUpdateBusinessInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessInfo>();

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  async function onSubmit(values: BusinessInfo) {
    await updateMutation.mutateAsync(values);
    reset(values);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">사업자 정보</h1>
        <p className="text-sm text-muted-foreground mt-1">
          법인 정보를 관리합니다. 변경 후 재인증이 필요할 수 있습니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />
            법인 정보
          </CardTitle>
          <CardDescription>
            세금계산서 발행 및 계약에 사용되는 정보입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">법인명 *</Label>
                  <Input
                    id="companyName"
                    {...register("companyName", {
                      required: "법인명을 입력해주세요.",
                    })}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessNumber">사업자등록번호 *</Label>
                  <Input
                    id="businessNumber"
                    placeholder="000-00-00000"
                    {...register("businessNumber", {
                      required: "사업자등록번호를 입력해주세요.",
                      pattern: {
                        value: /^\d{3}-\d{2}-\d{5}$/,
                        message: "000-00-00000 형식으로 입력해주세요.",
                      },
                    })}
                  />
                  {errors.businessNumber && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.businessNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="representativeName">대표자명 *</Label>
                <Input
                  id="representativeName"
                  {...register("representativeName", {
                    required: "대표자명을 입력해주세요.",
                  })}
                />
                {errors.representativeName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.representativeName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">사업장 주소 *</Label>
                <Input
                  id="address"
                  {...register("address", {
                    required: "사업장 주소를 입력해주세요.",
                  })}
                />
                {errors.address && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="taxEmail">세금계산서 수신 이메일 *</Label>
                <Input
                  id="taxEmail"
                  type="email"
                  {...register("taxEmail", {
                    required: "이메일을 입력해주세요.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "유효한 이메일 형식이 아닙니다.",
                    },
                  })}
                />
                {errors.taxEmail && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.taxEmail.message}
                  </p>
                )}
              </div>

              {data?.updatedAt && (
                <p className="text-xs text-muted-foreground">
                  마지막 업데이트:{" "}
                  {format(new Date(data.updatedAt), "yyyy.MM.dd HH:mm", {
                    locale: ko,
                  })}
                </p>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={!isDirty || updateMutation.isPending}
                >
                  {updateMutation.isPending ? "저장 중..." : "변경사항 저장"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
