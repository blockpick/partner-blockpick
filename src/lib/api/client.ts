const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/graphql";
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY ?? "partner_access_token";
const REFRESH_TOKEN_KEY =
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY ?? "partner_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: unknown[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface GqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: { code?: string } }>;
}

/**
 * GraphQL 요청 클라이언트
 * - JWT Authorization 헤더 자동 부착
 * - partnerId 컨텍스트 헤더 자동 부착 (JWT 클레임에서 파싱)
 */
export async function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;

    // JWT payload에서 partnerId 파싱해서 헤더로 부착 (멀티테넌트 컨텍스트)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.partnerId) {
        headers["X-Partner-Id"] = payload.partnerId;
      }
    } catch {
      // 파싱 실패 시 무시
    }
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 401) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError(401, "인증이 만료되었습니다. 다시 로그인해주세요.");
  }

  if (!res.ok) {
    throw new ApiError(res.status, `서버 오류가 발생했습니다. (${res.status})`);
  }

  const json: GqlResponse<T> = await res.json();

  if (json.errors && json.errors.length > 0) {
    const firstError = json.errors[0];
    const code = firstError.extensions?.code;
    if (code === "UNAUTHENTICATED") {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw new ApiError(400, firstError.message, json.errors);
  }

  if (json.data === undefined) {
    throw new ApiError(500, "응답 데이터가 없습니다.");
  }

  return json.data;
}
