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
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
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
    return <Badge variant="success">활성</Badge>;
  }
  if (status === "INVITED") {
    return <Badge variant="warning">초대 중</Badge>;
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
      <PageHeader
        title="멤버 관리"
        description="대시보드에 접근하는 팀원을 초대하고 역할을 관리합니다."
        actions={
          <Button onClick={() => setInviteOpen(true)} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            멤버 초대
          </Button>
        }
      />

      <div className="rounded-md border border-border bg-card">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !(members ?? []).length ? (
          <div className="px-4 py-6">
            <EmptyState
              title="아직 등록된 멤버가 없어요"
              description="팀원을 초대해 함께 캠페인을 운영해 보세요."
              action={
                <Button size="sm" onClick={() => setInviteOpen(true)}>
                  멤버 초대
                </Button>
              }
            />
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
