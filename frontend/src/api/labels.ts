import type { LabelDto, UpsertLabelRequest } from "./types";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function listLabels(): Promise<LabelDto[]> {
  return api("/api/labels");
}

export function getLabel(id: string): Promise<LabelDto> {
  return api(`/api/labels/${encodeURIComponent(id)}`);
}

export function createLabel(body: UpsertLabelRequest): Promise<LabelDto> {
  return api("/api/labels", { method: "POST", body: JSON.stringify(body) });
}

export function updateLabel(id: string, body: UpsertLabelRequest): Promise<LabelDto> {
  return api(`/api/labels/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteLabel(id: string): Promise<void> {
  return api(`/api/labels/${encodeURIComponent(id)}`, { method: "DELETE" });
}