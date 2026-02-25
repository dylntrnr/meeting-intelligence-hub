import { timingSafeEqual } from "crypto";

export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function isAuthorized(token?: string | null) {
  const expected = process.env.DASHBOARD_TOKEN;
  if (!token || !expected) return false;
  return timingSafeCompare(token, expected);
}
