"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import type { WizardFormData } from "./use-wizard";

interface Step1Props {
  form: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
}

export function Step1Basic({ form, onChange, onNext }: Step1Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // base64 임시 저장 (S3 사전서명 URL 연동은 추후)
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ thumbnailUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  const isValid = form.title.trim().length >= 2;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">기본 정보</h2>
        <p className="text-sm text-muted-foreground mt-0.5">블록픽 캠페인의 기본 정보를 입력하세요</p>
      </div>

      {/* 대표 이미지 */}
      <div className="space-y-2">
        <Label>대표 이미지</Label>
        {form.thumbnailUrl ? (
          <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.thumbnailUrl} alt="썸네일" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange({ thumbnailUrl: "" })}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center w-40 h-40 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-muted/30 transition-colors gap-2 text-muted-foreground"
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">이미지 업로드</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <p className="text-xs text-muted-foreground">권장 크기: 800×800px, 최대 5MB</p>
      </div>

      {/* 캠페인명 */}
      <div className="space-y-2">
        <Label htmlFor="title">
          캠페인명 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="예: 여름 특별 이벤트 블록픽"
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground text-right">{form.title.length}/100</p>
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="블록픽 캠페인에 대한 간단한 설명을 입력하세요"
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">{form.description.length}/500</p>
      </div>

      {/* 참여 기간 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startAt">시작 일시</Label>
          <Input
            id="startAt"
            type="datetime-local"
            value={form.startAt}
            onChange={(e) => onChange({ startAt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endAt">종료 일시</Label>
          <Input
            id="endAt"
            type="datetime-local"
            value={form.endAt}
            min={form.startAt}
            onChange={(e) => onChange({ endAt: e.target.value })}
          />
        </div>
      </div>

      {/* 파트너명 */}
      <div className="space-y-2">
        <Label htmlFor="partnerName">파트너명</Label>
        <Input
          id="partnerName"
          value={form.partnerName}
          onChange={(e) => onChange({ partnerName: e.target.value })}
          placeholder="표시될 브랜드/파트너 이름"
        />
      </div>

      {/* 랜딩 URL */}
      <div className="space-y-2">
        <Label htmlFor="landingUrl">랜딩 URL</Label>
        <Input
          id="landingUrl"
          type="url"
          value={form.landingUrl}
          onChange={(e) => onChange({ landingUrl: e.target.value })}
          placeholder="https://example.com/event"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={!isValid}>
          다음 단계
        </Button>
      </div>
    </div>
  );
}
