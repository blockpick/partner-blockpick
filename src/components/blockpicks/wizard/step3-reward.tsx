"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WizardFormData } from "./use-wizard";
import type { RewardType, DeliveryPayer } from "@/lib/types/blockpick";

interface Step3Props {
  form: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const REWARD_TYPES: { value: RewardType; label: string }[] = [
  { value: "COUPON", label: "쿠폰" },
  { value: "VOUCHER", label: "교환권" },
  { value: "PHYSICAL", label: "실물 상품" },
  { value: "POINT", label: "포인트" },
];

const DELIVERY_PAYERS: { value: DeliveryPayer; label: string }[] = [
  { value: "PARTNER", label: "파트너 부담" },
  { value: "WINNER", label: "당첨자 부담" },
];

export function Step3Reward({ form, onChange, onNext, onPrev }: Step3Props) {
  const isValid = form.rewardName.trim().length > 0 && !!form.rewardType && form.rewardQuantity > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">보상 설정</h2>
        <p className="text-sm text-muted-foreground mt-0.5">당첨자에게 지급할 경품을 설정하세요</p>
      </div>

      {/* 경품명 */}
      <div className="space-y-2">
        <Label htmlFor="rewardName">
          경품명 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="rewardName"
          value={form.rewardName}
          onChange={(e) => onChange({ rewardName: e.target.value })}
          placeholder="예: 스타벅스 아메리카노 기프티콘"
        />
      </div>

      {/* 보상 유형 */}
      <div className="space-y-2">
        <Label>
          보상 유형 <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.rewardType}
          onValueChange={(v) => onChange({ rewardType: v as RewardType })}
        >
          <SelectTrigger>
            <SelectValue placeholder="보상 유형 선택" />
          </SelectTrigger>
          <SelectContent>
            {REWARD_TYPES.map((rt) => (
              <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 수량 */}
      <div className="space-y-2">
        <Label htmlFor="rewardQuantity">
          수량 <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="rewardQuantity"
            type="number"
            min={1}
            value={form.rewardQuantity}
            onChange={(e) => onChange({ rewardQuantity: Number(e.target.value) })}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">개</span>
        </div>
      </div>

      {/* 유효기간 */}
      <div className="space-y-2">
        <Label htmlFor="rewardExpireAt">유효기간</Label>
        <Input
          id="rewardExpireAt"
          type="datetime-local"
          value={form.rewardExpireAt}
          onChange={(e) => onChange({ rewardExpireAt: e.target.value })}
        />
      </div>

      {/* 지급 방식 */}
      <div className="space-y-2">
        <Label htmlFor="rewardDeliveryMethod">지급 방식</Label>
        <Input
          id="rewardDeliveryMethod"
          value={form.rewardDeliveryMethod}
          onChange={(e) => onChange({ rewardDeliveryMethod: e.target.value })}
          placeholder="예: 이메일 발송, 앱 내 지급, 직접 배송"
        />
      </div>

      {/* 배송 필요 여부 */}
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border p-3">
          <Checkbox
            id="requireDelivery"
            checked={form.requireDelivery}
            onCheckedChange={(checked) => onChange({ requireDelivery: !!checked })}
          />
          <div className="space-y-0.5">
            <Label htmlFor="requireDelivery" className="font-medium cursor-pointer">
              배송 필요
            </Label>
            <p className="text-xs text-muted-foreground">
              실물 상품 배송이 필요한 경우 체크하세요
            </p>
          </div>
        </div>

        {form.requireDelivery && (
          <div className="ml-3 space-y-4 border-l-2 pl-4 border-muted">
            {/* 배송 가능 국가 */}
            <div className="space-y-2">
              <Label htmlFor="deliveryAvailable">배송 가능 국가</Label>
              <Input
                id="deliveryAvailable"
                value={form.deliveryAvailableCountries.join(", ")}
                onChange={(e) =>
                  onChange({
                    deliveryAvailableCountries: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="예: KR, US, JP (쉼표로 구분)"
              />
            </div>

            {/* 배송 불가 국가 */}
            <div className="space-y-2">
              <Label htmlFor="deliveryUnavailable">배송 불가 국가</Label>
              <Input
                id="deliveryUnavailable"
                value={form.deliveryUnavailableCountries.join(", ")}
                onChange={(e) =>
                  onChange({
                    deliveryUnavailableCountries: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="예: CN, RU (쉼표로 구분)"
              />
            </div>

            {/* 배송비/관세 부담 */}
            <div className="space-y-2">
              <Label>배송비/관세 부담</Label>
              <Select
                value={form.deliveryPayer}
                onValueChange={(v) => onChange({ deliveryPayer: v as DeliveryPayer })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="부담 주체 선택" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_PAYERS.map((dp) => (
                    <SelectItem key={dp.value} value={dp.value}>{dp.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onPrev}>이전</Button>
        <Button onClick={onNext} disabled={!isValid}>다음 단계</Button>
      </div>
    </div>
  );
}
