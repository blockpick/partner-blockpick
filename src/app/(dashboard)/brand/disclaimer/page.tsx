"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrandDisclaimer, useUpdateDisclaimer } from "@/lib/hooks/use-brand";
import { Info } from "lucide-react";

const schema = z.object({
  ko: z.string().min(1, "한국어 유의사항을 입력해주세요").max(2000),
  en: z.string().max(2000),
});

type FormValues = z.infer<typeof schema>;

export default function BrandDisclaimerPage() {
  const { data, isLoading } = useBrandDisclaimer();
  const update = useUpdateDisclaimer();
  const [tab, setTab] = useState<"ko" | "en">("ko");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ko: "", en: "" },
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = (values: FormValues) => {
    update.mutate(values);
  };

  const koLength = watch("ko")?.length ?? 0;
  const enLength = watch("en")?.length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">기본 유의사항</h1>
        <p className="text-sm text-muted-foreground">
          모든 블록픽에 자동으로 추가될 기본 유의사항을 관리합니다
        </p>
      </div>

      {/* 안내 배너 */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          여기에 입력한 유의사항은 새로 생성되는 블록픽에 자동으로 추가됩니다. 기존 블록픽의
          유의사항은 변경되지 않습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>유의사항 내용</CardTitle>
            <CardDescription>
              한국어와 영문 유의사항을 각각 입력할 수 있습니다. 한국어는 필수입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "ko" | "en")}>
              <TabsList className="mb-4">
                <TabsTrigger value="ko">한국어 (KO)</TabsTrigger>
                <TabsTrigger value="en">영어 (EN)</TabsTrigger>
              </TabsList>

              <TabsContent value="ko" className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="disclaimerKo">
                    한국어 유의사항 <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-xs text-muted-foreground">{koLength}/2000자</span>
                </div>
                <Textarea
                  id="disclaimerKo"
                  rows={10}
                  placeholder="예) 본 이벤트는 당사의 사정에 따라 변경 또는 조기 종료될 수 있습니다..."
                  {...register("ko")}
                />
                {errors.ko && (
                  <p className="text-xs text-destructive">{errors.ko.message}</p>
                )}
              </TabsContent>

              <TabsContent value="en" className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="disclaimerEn">영어 유의사항</Label>
                  <span className="text-xs text-muted-foreground">{enLength}/2000자</span>
                </div>
                <Textarea
                  id="disclaimerEn"
                  rows={10}
                  placeholder="e.g. This event may be changed or terminated early at the discretion of the company..."
                  {...register("en")}
                />
                {errors.en && (
                  <p className="text-xs text-destructive">{errors.en.message}</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 미리보기 */}
        {watch("ko") && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                미리보기 — 블록픽 하단 표시 방식
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  유의사항
                </p>
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                  {watch("ko")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={!isDirty || update.isPending}>
            {update.isPending ? "저장 중..." : "변경사항 저장"}
          </Button>
        </div>
      </form>
    </div>
  );
}
