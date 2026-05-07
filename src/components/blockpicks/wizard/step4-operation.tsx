"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WizardFormData } from "./use-wizard";
import type { PublishType, AuthType } from "@/lib/types/blockpick";

interface Step4Props {
  form: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PUBLISH_TYPES: { value: PublishType; label: string; desc: string }[] = [
  { value: "PUBLIC", label: "공개", desc: "누구나 참여 가능" },
  { value: "PRIVATE", label: "비공개", desc: "링크를 아는 사람만 참여 가능" },
  { value: "INVITE_ONLY", label: "초대 전용", desc: "초대장을 받은 사람만 참여 가능" },
];

const AUTH_TYPES: { value: AuthType; label: string }[] = [
  { value: "NONE", label: "인증 없음" },
  { value: "PHONE", label: "휴대폰 인증" },
  { value: "EMAIL", label: "이메일 인증" },
  { value: "SNS", label: "SNS 인증" },
];

export function Step4Operation({ form, onChange, onNext, onPrev }: Step4Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">운영 설정</h2>
        <p className="text-sm text-muted-foreground mt-0.5">캠페인 공개 방식과 운영 정보를 설정하세요</p>
      </div>

      {/* 공개 방식 */}
      <div className="space-y-3">
        <Label>공개 방식</Label>
        <div className="space-y-2">
          {PUBLISH_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => onChange({ publishType: pt.value })}
              className={`w-full flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                form.publishType === pt.value
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <div
                className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                  form.publishType === pt.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              />
              <div>
                <p className="text-sm font-medium">{pt.label}</p>
                <p className="text-xs text-muted-foreground">{pt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 인증 방식 */}
      <div className="space-y-2">
        <Label>인증 방식</Label>
        <Select
          value={form.authType}
          onValueChange={(v) => onChange({ authType: v as AuthType })}
        >
          <SelectTrigger>
            <SelectValue placeholder="인증 방식 선택" />
          </SelectTrigger>
          <SelectContent>
            {AUTH_TYPES.map((at) => (
              <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 당첨자 정보 수집 */}
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Checkbox
          id="collectWinnerInfo"
          checked={form.collectWinnerInfo}
          onCheckedChange={(checked) => onChange({ collectWinnerInfo: !!checked })}
        />
        <div className="space-y-0.5">
          <Label htmlFor="collectWinnerInfo" className="font-medium cursor-pointer">
            당첨자 정보 수집
          </Label>
          <p className="text-xs text-muted-foreground">
            당첨 시 이름, 연락처, 주소 등의 정보를 수집합니다
          </p>
        </div>
      </div>

      {/* 유의사항 */}
      <div className="space-y-2">
        <Label htmlFor="notice">유의사항</Label>
        <Textarea
          id="notice"
          value={form.notice}
          onChange={(e) => onChange({ notice: e.target.value })}
          placeholder="참여자가 반드시 알아야 할 유의사항을 입력하세요"
          rows={4}
        />
      </div>

      {/* CS 안내 */}
      <div className="space-y-2">
        <Label htmlFor="csGuide">CS 안내</Label>
        <Textarea
          id="csGuide"
          value={form.csGuide}
          onChange={(e) => onChange({ csGuide: e.target.value })}
          placeholder="고객 문의 안내 내용을 입력하세요 (이메일, 전화번호 등)"
          rows={3}
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onPrev}>이전</Button>
        <Button onClick={onNext}>미리보기</Button>
      </div>
    </div>
  );
}
