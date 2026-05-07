"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDuplicateBlockpick } from "@/lib/hooks/use-my-blockpicks";
import { Copy, Loader2 } from "lucide-react";

interface DuplicateBlockpickDialogProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function DuplicateBlockpickDialog({
  id,
  open,
  onClose,
}: DuplicateBlockpickDialogProps) {
  const router = useRouter();
  const duplicate = useDuplicateBlockpick();

  async function handleDuplicate() {
    const result = await duplicate.mutateAsync(id);
    onClose();
    router.push(`/blockpicks/${result.id}/edit`);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            블록픽 복제
          </DialogTitle>
          <DialogDescription>
            이 블록픽을 복제하시겠습니까?
            <br />
            복제된 블록픽은 임시저장 상태로 생성됩니다.
          </DialogDescription>
        </DialogHeader>
        {duplicate.isError && (
          <p className="text-sm text-destructive">
            복제 처리 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={duplicate.isPending}>
            취소
          </Button>
          <Button onClick={handleDuplicate} disabled={duplicate.isPending}>
            {duplicate.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            복제하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
