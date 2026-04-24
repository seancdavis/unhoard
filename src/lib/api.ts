import type { Collection, Item } from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listCollections: () => request<Collection[]>("/api/collections"),
  createCollection: (body: { name: string; emoji?: string; accent?: string }) =>
    request<Collection>("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getCollection: (id: string) =>
    request<{ collection: Collection; items: Item[] }>(`/api/collections/${id}`),
  updateCollection: (
    id: string,
    body: { name?: string; emoji?: string; accent?: string },
  ) =>
    request<Collection>(`/api/collections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  deleteCollection: (id: string) =>
    request<{ ok: true }>(`/api/collections/${id}`, { method: "DELETE" }),

  createItem: (body: {
    collectionId: string;
    name: string;
    notes?: string;
    tags?: string[];
    imageKey?: string | null;
  }) =>
    request<Item>("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  updateItem: (
    id: string,
    body: {
      name?: string;
      notes?: string;
      tags?: string[];
      imageKey?: string | null;
    },
  ) =>
    request<Item>(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  deleteItem: (id: string) =>
    request<{ ok: true }>(`/api/items/${id}`, { method: "DELETE" }),

  uploadImage: async (file: File): Promise<{ key: string; url: string }> => {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
