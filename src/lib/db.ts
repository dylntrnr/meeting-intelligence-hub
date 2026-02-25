import { sql } from "@vercel/postgres";

export async function runQuery<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]) {
  try {
    const result = await sql<T>(strings, ...values);
    return { data: result.rows, error: null as Error | null };
  } catch (error) {
    return { data: null as T[] | null, error: error as Error };
  }
}
