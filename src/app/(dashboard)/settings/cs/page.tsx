"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Headphones, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCsInfo, useUpdateCsInfo } from "@/lib/hooks/use-settings";
import type { CsInfo } from "@/lib/types/settings";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function SettingsCsPage() {
  const { data, isLoading } = useCsInfo();
  const updateMutation = useUpdateCsInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CsInfo>();

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  async function onSubmit(values: CsInfo) {
    await updateMutation.mutateAsync(values);
    reset(values);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="CS 정보"
        description="앱 내 고객센터 정보와 자동 응답 메시지를 설정합니다."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Headphones className="h-4 w-4" />
            고객센터 정보
          </CardTitle>
          <CardDescription>
            사용자 앱에 표시될 고객센터 연락처 정보입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="csEmail">고객센터 이메일 *</Label>
                  <Input
                    id="csEmail"
                    type="email"
                    placeholder="cs@yourcompany.com"
                    {...register("csEmail", {
                      required: "이메일을 입력해주세요.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "유효한 이메일 형식이 아닙니다.",
                      },
                    })}
                  />
                  {errors.csEmail && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.csEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="csPhone">고객센터 전화번호</Label>
                  <Input
                    id="csPhone"
                    placeholder="02-0000-0000"
                    {...register("csPhone")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="operatingHours">운영 시간</Label>
                <Input
                  id="operatingHours"
                  placeholder="평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)"
                  {...register("operatingHours")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="autoReplyMessage">자동 응답 메시지</Label>
                <Textarea
                  id="autoReplyMessage"
                  rows={4}
                  placeholder="문의 접수 시 자동으로 발송되는 메시지를 입력해주세요."
                  {...register("autoReplyMessage")}
                />
                <p className="text-xs text-muted-foreground">
                  고객 문의 접수 시 자동으로 발송되는 이메일 본문입니다.
                </p>
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
