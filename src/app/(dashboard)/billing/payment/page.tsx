"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  usePaymentMethods,
  useSetDefaultPaymentMethod,
  useRemovePaymentMethod,
} from "@/lib/hooks/use-subscription";
import { CARD_BRAND_LABELS } from "@/lib/types/payment-method";
import { CreditCard, Plus, Star, Trash2 } from "lucide-react";

export default function BillingPaymentPage() {
  const { data: methods, isLoading } = usePaymentMethods();
  const setDefault = useSetDefaultPaymentMethod();
  const remove = useRemovePaymentMethod();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-4 w-56" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">결제 수단</h1>
          <p className="text-sm text-muted-foreground">등록된 카드를 관리합니다</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          카드 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>등록된 카드</CardTitle>
          <CardDescription>기본 카드로 구독 요금이 자동 청구됩니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!methods || methods.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <CreditCard className="h-10 w-10" />
              <p className="text-sm">등록된 카드가 없습니다</p>
              <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)}>
                카드 추가하기
              </Button>
            </div>
          ) : (
            methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {CARD_BRAND_LABELS[method.brand]} ···· {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          기본
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {method.holderName} · 만료 {method.expMonth.toString().padStart(2, "0")}/
                      {method.expYear} · 등록일{" "}
                      {format(new Date(method.createdAt), "yyyy.M.d", { locale: ko })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={setDefault.isPending}
                      onClick={() => setDefault.mutate(method.id)}
                    >
                      <Star className="mr-1 h-3.5 w-3.5" />
                      기본으로 설정
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setRemoveTarget(method.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 카드 추가 다이얼로그 (PG 연동 placeholder) */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카드 추가</DialogTitle>
            <DialogDescription>
              결제 카드 정보를 입력합니다. PG사 연동 후 실제 결제창이 표시됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            <CreditCard className="mx-auto mb-2 h-8 w-8" />
            <p>Toss Payments / Stripe 결제창</p>
            <p className="mt-1 text-xs">PG 사업자 선정 후 연동 예정</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 카드 삭제 확인 다이얼로그 */}
      <Dialog open={!!removeTarget} onOpenChange={() => setRemoveTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카드를 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>
              삭제한 카드는 복구할 수 없습니다. 기본 결제 카드는 삭제할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={remove.isPending}
              onClick={() => {
                if (removeTarget) {
                  remove.mutate(removeTarget, { onSuccess: () => setRemoveTarget(null) });
                }
              }}
            >
              {remove.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
