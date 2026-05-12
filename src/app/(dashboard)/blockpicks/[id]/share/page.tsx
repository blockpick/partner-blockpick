"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
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
import { useBlockpickDetail } from "@/lib/hooks/use-my-blockpicks";

export default function BlockpickSharePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data } = useBlockpickDetail(id);

  const landingUrl = data?.landingUrl ?? "";
  const inviteUrl = landingUrl ? `${landingUrl}?invite=YOUR_CODE` : "";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardDescription>링크</CardDescription>
          <CardTitle>공유 링크 / 초대 링크</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LinkField label="기본 랜딩 링크" value={landingUrl} />
          <LinkField label="친구 초대 링크" value={inviteUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>문구</CardDescription>
          <CardTitle>공유 문구</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="share-text">공유 메시지</Label>
            <Textarea
              id="share-text"
              placeholder="친구 초대하고 블록픽 한 번 더 참여하세요!"
              rows={4}
            />
          </div>
          <Button size="sm">문구 저장</Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardDescription>SNS 미리보기</CardDescription>
          <CardTitle>썸네일 카드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            {data?.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.thumbnailUrl}
                alt="썸네일"
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted text-sm text-muted-foreground">
                썸네일 미설정
              </div>
            )}
            <div className="space-y-1 border-t border-border p-3">
              <p className="text-sm font-medium">{data?.title ?? "-"}</p>
              <p className="text-xs text-muted-foreground">
                {data?.description ?? "설명 없음"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LinkField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} readOnly placeholder="-" />
        <Button
          variant="outline"
          size="sm"
          onClick={copy}
          disabled={!value}
          className="shrink-0 gap-1.5"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[hsl(var(--success))]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "복사됨" : "복사"}
        </Button>
      </div>
    </div>
  );
}
