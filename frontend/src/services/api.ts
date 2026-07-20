import type { CalculateRequest, CalculateResponse } from "../types";

const API_BASE = "/api";

function formatError(err: unknown, fallback: string): string {
  if (typeof err === "string") return err;
  const detail = (err as Record<string, unknown>)?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: Record<string, unknown>) => {
        const loc = Array.isArray(d.loc) ? d.loc.join(".") : "";
        const msg = d.msg || "Error";
        return loc ? `${loc}: ${msg}` : msg;
      })
      .join(" | ");
  }
  if (typeof detail === "string") return detail;
  return fallback;
}

export async function calculateAbc(data: CalculateRequest): Promise<CalculateResponse> {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(formatError(body, `Error del servidor (${res.status})`));
  }
  return res.json();
}

export async function calculateSensitivity(data: CalculateRequest): Promise<CalculateResponse> {
  const res = await fetch(`${API_BASE}/sensitivity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(formatError(body, `Error del servidor (${res.status})`));
  }
  return res.json();
}