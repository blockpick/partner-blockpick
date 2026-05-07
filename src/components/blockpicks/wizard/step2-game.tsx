"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { WizardFormData } from "./use-wizard";
import type { ExtraEntryType } from "@/lib/types/blockpick";

interface Step2Props {
  form: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const EXTRA_ENTRY_OPTIONS: { value: ExtraEntryType; label: string; desc: string }[] = [
  { value: "REFERRAL", label: "친구초대", desc: "친구를 초대하면 추가 참여권 지급" },
  { value: "AD", label: "광고 시청", desc: "광고를 시청하면 추가 참여권 지급" },
  { value: "MISSION", label: "미션 수행", desc: "미션을 완료하면 추가 참여권 지급" },
];

export function Step2Game({ form, onChange, onNext, onPrev }: Step2Props) {
  function toggleExtraEntry(type: ExtraEntryType) {
    const current = form.extraEntryTypes;
    if (current.includes(type)) {
      onChange({ extraEntryTypes: current.filter((t) => t !== type) });
    } else {
      onChange({ extraEntryTypes: [...current, type] });
    }
  }

  const gridDisplay = `${form.gridSize}×${form.gridSize} (${form.gridSize * form.gridSize}칸)`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">게임 설정</h2>
        <p className="text-sm text-muted-foreground mt-0.5">블록픽 게임의 규칙을 설정하세요</p>
      </div>

      {/* 그리드 크기 */}
      <div className="space-y-3">
        <Label>그리드 크기</Label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={form.gridSize}
            onChange={(e) => onChange({ gridSize: Number(e.target.value) })}
            className="flex-1 accent-primary"
          />
          <span className="text-sm font-medium w-36 text-right">{gridDisplay}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5×5 (25칸)</span>
          <span>30×30 (900칸)</span>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          현재 설정: 총 <strong className="text-foreground">{form.gridSize * form.gridSize}개</strong>의 블록 중 당첨 블록이 배치됩니다.
        </div>
      </div>

      {/* 무료 참여 수 */}
      <div className="space-y-2">
        <Label htmlFor="freeEntryCount">
          무료 참여 수 <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="freeEntryCount"
            type="number"
            min={1}
            max={100}
            value={form.freeEntryCount}
            onChange={(e) => onChange({ freeEntryCount: Number(e.target.value) })}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">회 (1인 기본 제공)</span>
        </div>
      </div>

      {/* 1인 최대 참여 수 */}
      <div className="space-y-2">
        <Label htmlFor="maxEntryPerUser">
          1인 최대 참여 수 <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="maxEntryPerUser"
            type="number"
            min={form.freeEntryCount}
            max={1000}
            value={form.maxEntryPerUser}
            onChange={(e) => onChange({ maxEntryPerUser: Number(e.target.value) })}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">회 (무료 포함)</span>
        </div>
      </div>

      {/* 추가 참여 방식 */}
      <div className="space-y-3">
        <Label>추가 참여 허용 방식</Label>
        <div className="space-y-3">
          {EXTRA_ENTRY_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-start gap-3 rounded-lg border p-3">
              <Checkbox
                id={`extra-${opt.value}`}
                checked={form.extraEntryTypes.includes(opt.value)}
                onCheckedChange={() => toggleExtraEntry(opt.value)}
              />
              <div className="space-y-0.5">
                <Label htmlFor={`extra-${opt.value}`} className="font-medium cursor-pointer">
                  {opt.label}
                </Label>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 중복 당첨 */}
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Checkbox
          id="allowDuplicateWin"
          checked={form.allowDuplicateWin}
          onCheckedChange={(checked) => onChange({ allowDuplicateWin: !!checked })}
        />
        <div className="space-y-0.5">
          <Label htmlFor="allowDuplicateWin" className="font-medium cursor-pointer">
            중복 당첨 허용
          </Label>
          <p className="text-xs text-muted-foreground">
            체크 시 동일 참여자가 여러 번 당첨될 수 있습니다
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onPrev}>이전</Button>
        <Button onClick={onNext}>다음 단계</Button>
      </div>
    </div>
  );
}
