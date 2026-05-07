"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Lock,
  Shield,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMe } from "@/lib/hooks/use-me";
import {
  useSessions,
  useRevokeSession,
  useChangePassword,
  useDeleteAccount,
} from "@/lib/hooks/use-settings";
import type { SessionInfo } from "@/lib/types/settings";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { clearTokens } from "@/lib/api/client";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function DeviceIcon({ type }: { type: SessionInfo["deviceType"] }) {
  if (type === "MOBILE") return <Smartphone className="h-4 w-4" />;
  if (type === "TABLET") return <Tablet className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
}

export default function SettingsAccountPage() {
  const { data: me, isLoading: meLoading } = useMe();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const revokeSessionMutation = useRevokeSession();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PasswordForm>();

  const newPassword = watch("newPassword");

  async function onChangePassword(values: PasswordForm) {
    await changePasswordMutation.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    reset();
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  }

  async function handleRevokeSession(sessionId: string) {
    await revokeSessionMutation.mutateAsync(sessionId);
  }

  async function handleDeleteAccount() {
    await deleteAccountMutation.mutateAsync(deletePassword);
    clearTokens();
    window.location.href = "/login";
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">계정 설정</h1>
        <p className="text-sm text-muted-foreground mt-1">
          내 프로필, 보안 설정, 세션을 관리합니다.
        </p>
      </div>

      {/* 프로필 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            내 프로필
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">이름</p>
                  <p className="text-sm font-medium">{me?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">이메일</p>
                  <p className="text-sm font-medium">{me?.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">역할</p>
                <Badge variant="secondary">{me?.partnerRole}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 비밀번호 변경 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" />
            비밀번호 변경
          </CardTitle>
          <CardDescription>
            정기적으로 비밀번호를 변경하면 계정 보안이 향상됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">현재 비밀번호</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword", {
                  required: "현재 비밀번호를 입력해주세요.",
                })}
              />
              {errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword", {
                  required: "새 비밀번호를 입력해주세요.",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 8자 이상이어야 합니다.",
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "비밀번호 확인을 입력해주세요.",
                  validate: (v) =>
                    v === newPassword || "비밀번호가 일치하지 않습니다.",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {pwSuccess && (
              <p className="text-xs text-green-600">
                비밀번호가 성공적으로 변경되었습니다.
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty || changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "변경 중..."
                  : "비밀번호 변경"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            2단계 인증 (2FA)
          </CardTitle>
          <CardDescription>
            2단계 인증으로 계정 보안을 강화합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">2단계 인증</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                현재 비활성화 상태입니다.
              </p>
            </div>
            <Button variant="outline" disabled>
              설정 예정
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 세션 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Monitor className="h-4 w-4" />
            로그인 세션
          </CardTitle>
          <CardDescription>
            현재 로그인된 디바이스 목록입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {(sessions ?? []).map((session, idx) => (
                <div key={session.id}>
                  {idx > 0 && <Separator className="mb-3" />}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-muted-foreground">
                        <DeviceIcon type={session.deviceType} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {session.deviceName}
                          </p>
                          {session.isCurrent && (
                            <Badge
                              variant="outline"
                              className="text-xs border-green-500 text-green-600"
                            >
                              현재
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {session.ipAddress}
                          {session.location && ` · ${session.location}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          마지막 활동:{" "}
                          {format(
                            new Date(session.lastActiveAt),
                            "MM.dd HH:mm",
                            { locale: ko },
                          )}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive shrink-0"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokeSessionMutation.isPending}
                      >
                        종료
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 계정 탈퇴 */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <AlertTriangle className="h-4 w-4" />
            계정 탈퇴
          </CardTitle>
          <CardDescription>
            계정을 탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            계정 탈퇴
          </Button>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말로 탈퇴하시겠습니까?</DialogTitle>
            <DialogDescription>
              탈퇴 후 모든 블록픽, 분석 데이터, 팀 정보가 삭제됩니다. 이
              작업은 되돌릴 수 없습니다. 계속하려면 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="deletePassword">비밀번호 확인</Label>
            <Input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeletePassword("");
              }}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={!deletePassword || deleteAccountMutation.isPending}
              onClick={handleDeleteAccount}
            >
              {deleteAccountMutation.isPending ? "처리 중..." : "탈퇴 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
