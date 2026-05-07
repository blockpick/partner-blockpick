import { gqlRequest } from "./client";
import type { PaymentMethod } from "@/lib/types/payment-method";
import type { Invoice } from "@/lib/types/invoice";

// ── 목 데이터 (백엔드 미머지 fallback) ──────────────────────────────────────
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    brand: "VISA",
    last4: "4242",
    expMonth: 12,
    expYear: 2027,
    holderName: "심재형",
    isDefault: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-5",
    invoiceNumber: "INV-2025-005",
    amount: 299000,
    currency: "KRW",
    status: "PAID",
    description: "블록픽 그로스 플랜 (2025년 5월)",
    billedAt: "2025-05-01T00:00:00Z",
    paidAt: "2025-05-01T00:01:23Z",
    invoicePdfUrl: null,
    receiptUrl: null,
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2025-004",
    amount: 299000,
    currency: "KRW",
    status: "PAID",
    description: "블록픽 그로스 플랜 (2025년 4월)",
    billedAt: "2025-04-01T00:00:00Z",
    paidAt: "2025-04-01T00:00:45Z",
    invoicePdfUrl: null,
    receiptUrl: null,
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2025-003",
    amount: 299000,
    currency: "KRW",
    status: "PAID",
    description: "블록픽 그로스 플랜 (2025년 3월)",
    billedAt: "2025-03-01T00:00:00Z",
    paidAt: "2025-03-01T00:00:32Z",
    invoicePdfUrl: null,
    receiptUrl: null,
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2025-002",
    amount: 99000,
    currency: "KRW",
    status: "PAID",
    description: "블록픽 스타터 플랜 (2025년 2월)",
    billedAt: "2025-02-01T00:00:00Z",
    paidAt: "2025-02-01T00:00:18Z",
    invoicePdfUrl: null,
    receiptUrl: null,
  },
  {
    id: "inv-1",
    invoiceNumber: "INV-2025-001",
    amount: 99000,
    currency: "KRW",
    status: "PAID",
    description: "블록픽 스타터 플랜 (2025년 1월)",
    billedAt: "2025-01-01T00:00:00Z",
    paidAt: "2025-01-01T00:00:09Z",
    invoicePdfUrl: null,
    receiptUrl: null,
  },
];

// ── GraphQL 쿼리/뮤테이션 ────────────────────────────────────────────────────
const PAYMENT_METHODS_QUERY = `
  query PaymentMethods {
    paymentMethods {
      id brand last4 expMonth expYear holderName isDefault createdAt
    }
  }
`;

const INVOICES_QUERY = `
  query Invoices {
    invoices {
      id invoiceNumber amount currency status description
      billedAt paidAt invoicePdfUrl receiptUrl
    }
  }
`;

const ADD_PAYMENT_METHOD_MUTATION = `
  mutation AddPaymentMethod($token: String!) {
    addPaymentMethod(token: $token) {
      id brand last4 expMonth expYear holderName isDefault createdAt
    }
  }
`;

const SET_DEFAULT_PAYMENT_METHOD_MUTATION = `
  mutation SetDefaultPaymentMethod($id: String!) {
    setDefaultPaymentMethod(id: $id) { id isDefault }
  }
`;

const REMOVE_PAYMENT_METHOD_MUTATION = `
  mutation RemovePaymentMethod($id: String!) {
    removePaymentMethod(id: $id)
  }
`;

async function safeGql<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const paymentService = {
  async paymentMethods(): Promise<PaymentMethod[]> {
    return safeGql(async () => {
      const data = await gqlRequest<{ paymentMethods: PaymentMethod[] }>(PAYMENT_METHODS_QUERY);
      return data.paymentMethods;
    }, MOCK_PAYMENT_METHODS);
  },

  async invoices(): Promise<Invoice[]> {
    return safeGql(async () => {
      const data = await gqlRequest<{ invoices: Invoice[] }>(INVOICES_QUERY);
      return data.invoices;
    }, MOCK_INVOICES);
  },

  async addPaymentMethod(token: string): Promise<PaymentMethod> {
    return safeGql(async () => {
      const data = await gqlRequest<{ addPaymentMethod: PaymentMethod }>(
        ADD_PAYMENT_METHOD_MUTATION,
        { token },
      );
      return data.addPaymentMethod;
    }, {
      id: `pm-${Date.now()}`,
      brand: "VISA",
      last4: "0000",
      expMonth: 12,
      expYear: 2028,
      holderName: "-",
      isDefault: false,
      createdAt: new Date().toISOString(),
    });
  },

  async setDefaultPaymentMethod(id: string): Promise<{ id: string; isDefault: boolean }> {
    return safeGql(async () => {
      const data = await gqlRequest<{
        setDefaultPaymentMethod: { id: string; isDefault: boolean };
      }>(SET_DEFAULT_PAYMENT_METHOD_MUTATION, { id });
      return data.setDefaultPaymentMethod;
    }, { id, isDefault: true });
  },

  async removePaymentMethod(id: string): Promise<boolean> {
    return safeGql(async () => {
      const data = await gqlRequest<{ removePaymentMethod: boolean }>(
        REMOVE_PAYMENT_METHOD_MUTATION,
        { id },
      );
      return data.removePaymentMethod;
    }, true);
  },
};
