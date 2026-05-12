export function formatNumber(value?: number | null): string {
  return new Intl.NumberFormat("ko-KR").format(value ?? 0);
}

export function formatCurrency(
  value?: number | null,
  currency: string = "KRW",
): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatPercent(
  value?: number | null,
  options?: { scale100?: boolean; digits?: number },
): string {
  const scale100 = options?.scale100 ?? true;
  const digits = options?.digits ?? 1;
  const normalized = (value ?? 0) * (scale100 ? 100 : 1);
  return `${normalized.toFixed(digits)}%`;
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(date);
}

export function toDateTimeLocalValue(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function computeBlockpickProgress(
  startAt?: string | null,
  endAt?: string | null,
): number {
  if (!startAt || !endAt) return 0;
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return clampPercent(((now - start) / (end - start)) * 100);
}

export function formatDday(endAt?: string | null): string {
  if (!endAt) return "";
  const end = new Date(endAt).getTime();
  if (Number.isNaN(end)) return "";
  const now = Date.now();
  const diffMs = end - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "D-DAY";
  if (diffDays > 0) return `D-${diffDays}`;
  return `종료 ${Math.abs(diffDays)}일 경과`;
}
