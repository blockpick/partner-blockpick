"use client";

import { useState } from "react";
import { UserPlus, MoreHorizontal, Shield, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { RoleBadge } from "@/components/team/role-badge";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import {
  useTeamMembers,
  useChangeRole,
  useRemoveMember,
} from "@/lib/hooks/use-team";
import type { TeamMember, TeamRole } from "@/lib/types/team";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  if (status === "ACTIVE") {
    return (
      <Badge className="border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        활성
      </Badge>
    );
  }
  if (status === "INVITED") {
    return (
      <Badge className="border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
        초대 중
      </Badge>
    );
  }
  return <Badge variant="secondary">비활성</Badge>;
}

function formatLastLogin(dateStr?: string) {
  if (!dateStr) return "-";
  return format(new Date(dateStr), "MM.dd HH:mm", { locale: ko });
}

export default function TeamMembersPage() {
  const { data: members, isLoading } = useTeamMembers();
  const changeRoleMutation = useChangeRole();
  const removeMutation = useRemoveMember();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  async function handleChangeRole(memberId: string, role: TeamRole) {
    await changeRoleMutation.mutateAsync({ memberId, role });
  }

  async function handleRemove() {
    if (!removeTarget) return;
    await removeMutation.mutateAsync(removeTarget.id);
    setRemoveTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">팀원 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            팀원을 초대하고 역할을 관리합니다.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          팀원 초대
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>멤버</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(members ?? []).map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>
                          {member.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={member.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatLastLogin(member.lastLoginAt)}
                  </TableCell>
                  <TableCell>
                    {member.role !== "OWNER" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Shield className="mr-2 h-4 w-4" />
                              역할 변경
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {(["MANAGER", "VIEWER"] as TeamRole[])
                                .filter((r) => r !== member.role)
                                .map((r) => (
                                  <DropdownMenuItem
                                    key={r}
                                    onClick={() =>
                                      handleChangeRole(member.id, r)
                                    }
                                  >
                                    {r === "MANAGER" ? "매니저" : "뷰어"}로 변경
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setRemoveTarget(member)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            멤버 제거
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <Dialog
        open={!!removeTarget}
        onOpenChange={(v) => !v && setRemoveTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>멤버 제거</DialogTitle>
            <DialogDescription>
              <span className="font-medium">{removeTarget?.name}</span>(
              {removeTarget?.email})을 팀에서 제거하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? "제거 중..." : "제거"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
