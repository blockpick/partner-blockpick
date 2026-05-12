"use client";

import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddPaymentMethod,
  usePaymentMethods,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
} from "@/lib/hooks/use-subscription";
import { CARD_BRAND_LABELS } from "@/lib/types/payment-method";

export default function BillingPaymentPage() {
  const { data, isLoading } = usePaymentMethods();
  const add = useAddPaymentMethod();
  const remove = useRemovePaymentMethod();
  const setDefault = useSetDefaultPaymentMethod();
  const [token, setToken] = useState("");

  const methods = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="결제수단"
        description="결제 카드와 기본 결제수단을 관리합니다."
      />

      <Card>
        <CardHeader>
          <CardDescription>새 카드 등록</CardDescription>
          <CardTitle className="text-base">결제수단 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!token.trim()) return;
              await add.mutateAsync(token);
              setToken("");
            }}
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="payment-token">결제 토큰</Label>
              <Input
                id="payment-token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="PG에서 발급받은 결제 토큰을 입력하세요"
              />
            </div>
            <Button
              type="submit"
              disabled={!token.trim() || add.isPending}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              {add.isPending ? "추가 중..." : "카드 등록"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? null : !methods.length ? (
        <EmptyState
          title="등록된 결제수단이 없어요"
          description="구독을 유지하려면 결제수단을 먼저 등록해주세요."
        />
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <Card key={method.id}>
              <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-14 items-center justify-center rounded-md border border-border bg-muted/40">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {CARD_BRAND_LABELS[method.brand]} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <Badge variant="success">기본</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {method.holderName} · 만료{" "}
                      {String(method.expMonth).padStart(2, "0")}/{method.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefault.mutate(method.id)}
                      disabled={setDefault.isPending}
                    >
                      기본 설정
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove.mutate(method.id)}
                    disabled={remove.isPending}
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
