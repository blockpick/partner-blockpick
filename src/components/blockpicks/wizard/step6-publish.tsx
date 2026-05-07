"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreateBlockpick } from "@/lib/hooks/use-my-blockpicks";
import type { WizardFormData } from "./use-wizard";
import type { BlockpickInput, BlockpickStatus } from "@/lib/types/blockpick";
import { Calendar, Zap, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface Step6Props {
  form: WizardFormData;
  toInput: () => Omit<BlockpickInput, "status">;
  onPrev: () => void;
  onClearDraft: () => void;
}

type PublishMode = "DRAFT" | "SCHEDULED" | "ACTIVE";

const MODES: { value: PublishMode; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    value: "DRAFT",
    icon: <FileText className="h-5 w-5" />,
    label: "임시저장",
    desc: "나중에 발행하기 위해 임시저장합니다",
  },
  {
    value: "SCHEDULED",
    icon: <Calendar className="h-5 w-5" />,
    label: "예약 발행",
    desc: "설정한 시작 일시에 자동으로 발행됩니다",
  },
  {
    value: "ACTIVE",
    icon: <Zap className="h-5 w-5" />,
    label: "즉시 발행",
    desc: "지금 바로 블록픽을 공개합니다",
  },
];

export function Step6Publish({ form, toInput, onPrev, onClearDraft }: Step6Props) {
  const router = useRouter();
  const [mode, setMode] = useState<PublishMode>("DRAFT");
  const [done, setDone] = useState(false);
  const [createdId, setCreatedId] = useState<string>("");
  const create = useCreateBlockpick();

  async function handleSubmit() {
    const input = toInput();
    const result = await create.mutateAsync({ input, status: mode as BlockpickStatus });
    setCreatedId(result.id);
    setDone(true);
    onClearDraft();
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">
          {mode === "DRAFT" && "임시저장 완료!"}
          {mode === "SCHEDULED" && "예약 발행 완료!"}
          {mode === "ACTIVE" && "발행 완료!"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {form.title} 블록픽이{" "}
          {mode === "DRAFT" ? "임시저장되었습니다" :
           mode === "SCHEDULED" ? "예약 발행되었습니다" :
           "발행되었습니다"}
          .
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => router.push("/blockpicks")}>
            목록으로
          </Button>
          <Button onClick={() => router.push(`/blockpicks/${createdId}`)}>
            상세 보기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">발행</h2>
        <p className="text-sm text-muted-foreground mt-0.5">블록픽 발행 방식을 선택하세요</p>
      </div>

      {/* 발행 모드 선택 */}
      <div className="space-y-3">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`w-full flex items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
              mode === m.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                mode === m.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {m.icon}
            </div>
            <div>
              <p className="font-medium">{m.label}</p>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </div>
            <div
              className={`ml-auto h-5 w-5 rounded-full border-2 transition-colors ${
                mode === m.value ? "border-primary bg-primary" : "border-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>

      {/* 유의사항 */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">발행 전 확인사항</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>발행 후 그리드 크기와 보상 수량은 변경이 제한됩니다</li>
          <li>진행 중인 캠페인의 일부 설정은 수정할 수 없습니다</li>
          <li>임시저장은 언제든지 수정하여 발행할 수 있습니다</li>
        </ul>
      </div>

      {create.isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          발행 중 오류가 발생했습니다. 다시 시도해주세요.
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onPrev} disabled={create.isPending}>
          이전
        </Button>
        <Button onClick={handleSubmit} disabled={create.isPending}>
          {create.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {mode === "DRAFT" ? "임시저장" : mode === "SCHEDULED" ? "예약 발행" : "즉시 발행"}
        </Button>
      </div>
    </div>
  );
}
