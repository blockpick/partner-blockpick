export type InvoiceStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  PAID: "결제완료",
  PENDING: "결제대기",
  FAILED: "결제실패",
  REFUNDED: "환불완료",
};

export const INVOICE_STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  billedAt: string;
  paidAt: string | null;
  invoicePdfUrl: string | null;
  receiptUrl: string | null;
}
