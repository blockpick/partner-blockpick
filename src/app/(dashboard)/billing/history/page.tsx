"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatCurrency, formatDateTime } from "@/lib/format";
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_VARIANT,
} from "@/lib/types/invoice";

export default function BillingHistoryPage() {
  const { data, isLoading } = useInvoices();
  const items = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="청구 내역"
        description="월별 청구와 수납 상태를 확인합니다."
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !items.length ? (
            <div className="px-4 py-6">
              <EmptyState
                title="아직 청구 내역이 없어요"
                description="첫 결제가 발생하면 이곳에 표시됩니다."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>청구번호</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>청구 일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium tabular-nums">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell className="tabular-nums">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
                        {INVOICE_STATUS_LABELS[invoice.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(invoice.billedAt)}
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
