"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInvoices } from "@/lib/hooks/use-subscription";
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_VARIANT,
} from "@/lib/types/invoice";
import { Download, Receipt } from "lucide-react";

export default function BillingHistoryPage() {
  const { data: invoices, isLoading } = useInvoices();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const totalPaid =
    invoices
      ?.filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + inv.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">청구 내역</h1>
        <p className="text-sm text-muted-foreground">지금까지의 결제 및 청구 이력입니다</p>
      </div>

      {/* 요약 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">총 결제 건수</p>
            <p className="mt-1 text-2xl font-bold">{invoices?.length ?? 0}건</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">총 결제 금액</p>
            <p className="mt-1 text-2xl font-bold">{totalPaid.toLocaleString()}원</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">최근 결제일</p>
            <p className="mt-1 text-2xl font-bold">
              {invoices?.[0]?.paidAt
                ? format(new Date(invoices[0].paidAt), "M월 d일", { locale: ko })
                : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>청구서 목록</CardTitle>
          <CardDescription>PDF 아이콘을 클릭하면 청구서를 다운로드할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          {!invoices || invoices.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Receipt className="h-10 w-10" />
              <p className="text-sm">청구 내역이 없습니다</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>청구서 번호</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>청구일</TableHead>
                  <TableHead className="text-right">금액</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead className="text-center">다운로드</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(invoice.billedAt), "yyyy.M.d", { locale: ko })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {invoice.amount.toLocaleString()}원
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
                        {INVOICE_STATUS_LABELS[invoice.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1.5">
                        {invoice.invoicePdfUrl ? (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={invoice.invoicePdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            title="PDF 준비 중"
                          >
                            <Download className="h-4 w-4 opacity-40" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
