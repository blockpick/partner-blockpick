export type CardBrand =
  | "VISA"
  | "MASTERCARD"
  | "AMEX"
  | "UNIONPAY"
  | "KAKAOPAY"
  | "NAVERPAY"
  | "UNKNOWN";

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  AMEX: "American Express",
  UNIONPAY: "UnionPay",
  KAKAOPAY: "카카오페이",
  NAVERPAY: "네이버페이",
  UNKNOWN: "카드",
};

export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  holderName: string;
  isDefault: boolean;
  createdAt: string;
}
