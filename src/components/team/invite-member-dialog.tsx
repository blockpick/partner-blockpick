"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteMember } from "@/lib/hooks/use-team";
import type { TeamRole } from "@/lib/types/team";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("VIEWER");
  const [emailError, setEmailError] = useState("");

  const inviteMutation = useInviteMember();

  function validateEmail(value: string) {
    if (!value) return "이메일을 입력해주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "유효한 이메일 형식이 아닙니다.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");
    await inviteMutation.mutateAsync({ email, role });
    setEmail("");
    setRole("VIEWER");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>팀원 초대</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">이메일</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
            />
            {emailError && (
              <p className="text-xs text-destructive">{emailError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">역할</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as TeamRole)}
            >
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANAGER">매니저 — 블록픽 생성/수정, 조회</SelectItem>
                <SelectItem value="VIEWER">뷰어 — 조회만 가능</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? "초대 중..." : "초대 보내기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
