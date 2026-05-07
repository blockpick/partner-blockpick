"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEndBlockpick } from "@/lib/hooks/use-my-blockpicks";
import { Loader2, StopCircle } from "lucide-react";

interface EndBlockpickDialogProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function EndBlockpickDialog({ id, open, onClose }: EndBlockpickDialogProps) {
  const end = useEndBlockpick();

  async function handleEnd() {
    await end.mutateAsync(id);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StopCircle className="h-5 w-5 text-destructive" />
            블록픽 종료
          </DialogTitle>
          <DialogDescription>
            이 블록픽을 종료하시겠습니까?
            <br />
            종료 후에는 다시 진행 상태로 변경할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        {end.isError && (
          <p className="text-sm text-destructive">
            종료 처리 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={end.isPending}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleEnd}
            disabled={end.isPending}
          >
            {end.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            종료하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
