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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrandShareText, useUpdateShareText } from "@/lib/hooks/use-brand";

const VARIABLES = [
  { key: "{{캠페인명}}", desc: "블록픽 캠페인 이름" },
  { key: "{{기간}}", desc: "이벤트 진행 기간" },
  { key: "{{혜택}}", desc: "경품 또는 혜택 내용" },
];

const schema = z.object({
  kakao: z.string().min(1, "카카오톡 공유 문구를 입력해주세요").max(1000),
  sms: z.string().min(1, "문자 공유 문구를 입력해주세요").max(90, "SMS는 90자 이내로 입력해주세요"),
  link: z.string().min(1, "링크 공유 문구를 입력해주세요").max(500),
});

type FormValues = z.infer<typeof schema>;

function VariableBadges({
  onInsert,
}: {
  onInsert: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {VARIABLES.map(({ key, desc }) => (
        <button
          key={key}
          type="button"
          title={desc}
          onClick={() => onInsert(key)}
          className="cursor-pointer"
        >
          <Badge variant="secondary" className="font-mono text-xs hover:bg-secondary/80">
            {key}
          </Badge>
        </button>
      ))}
    </div>
  );
}

export default function BrandShareTextPage() {
  const { data, isLoading } = useBrandShareText();
  const update = useUpdateShareText();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { kakao: "", sms: "", link: "" },
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const insertVariable = (field: keyof FormValues, variable: string) => {
    const current = getValues(field);
    setValue(field, current + variable, { shouldDirty: true });
  };

  const onSubmit = (values: FormValues) => {
    update.mutate(values);
  };

  const smsLength = watch("sms")?.length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">공유 문구</h1>
        <p className="text-sm text-muted-foreground">
          블록픽 공유 시 기본으로 사용될 채널별 문구 템플릿을 설정합니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>변수 안내</CardTitle>
          <CardDescription>
            아래 변수를 문구에 삽입하면 실제 캠페인 정보로 자동 치환됩니다. 배지를 클릭하면
            커서 위치에 삽입됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {VARIABLES.map(({ key, desc }) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{key}</code>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 카카오톡 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-yellow-900">K</span>
              카카오톡 공유
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <VariableBadges onInsert={(v) => insertVariable("kakao", v)} />
            <div className="space-y-1.5">
              <Label htmlFor="kakao">공유 문구</Label>
              <Textarea
                id="kakao"
                rows={4}
                placeholder="{{캠페인명}} 참여하고 {{혜택}} 받아가세요!"
                {...register("kakao")}
              />
              {errors.kakao && (
                <p className="text-xs text-destructive">{errors.kakao.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 문자(SMS) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">S</span>
              문자(SMS) 공유
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {smsLength}/90자
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <VariableBadges onInsert={(v) => insertVariable("sms", v)} />
            <div className="space-y-1.5">
              <Label htmlFor="sms">공유 문구</Label>
              <Textarea
                id="sms"
                rows={3}
                placeholder="[블록픽] {{캠페인명}} — {{혜택}}"
                {...register("sms")}
              />
              {errors.sms && (
                <p className="text-xs text-destructive">{errors.sms.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 일반 링크 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">L</span>
              일반 링크 공유
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <VariableBadges onInsert={(v) => insertVariable("link", v)} />
            <div className="space-y-1.5">
              <Label htmlFor="link">공유 문구</Label>
              <Textarea
                id="link"
                rows={3}
                placeholder="{{캠페인명}} 이벤트에 참여해보세요!"
                {...register("link")}
              />
              {errors.link && (
                <p className="text-xs text-destructive">{errors.link.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={!isDirty || update.isPending}>
            {update.isPending ? "저장 중..." : "변경사항 저장"}
          </Button>
        </div>
      </form>
    </div>
  );
}
