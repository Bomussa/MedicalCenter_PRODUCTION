/* New file – safe fetch helpers – 2025-09-26 */
export async function safe<T = any>(p: Promise<Response>): Promise<{ ok: boolean; data?: T; error?: any }> {
  try {
    const r = await p;
    if (!r.ok) {
      let msg: any = "";
      try { msg = await r.json(); } catch { msg = await r.text(); }
      return { ok: false, error: msg };
    }
    const data = (await r.json()) as T;
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: (e as any)?.message ?? e };
  }
}
export const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

