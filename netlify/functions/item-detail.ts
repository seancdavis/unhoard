import type { Config, Context } from "@netlify/functions";
import { and, eq } from "drizzle-orm";
import { getStore } from "@netlify/blobs";
import { db, items } from "../../db/index.js";
import { requireUser, json } from "./_shared/auth.js";

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0 && t.length <= 40);
  return Array.from(new Set(cleaned)).slice(0, 20);
}

export default async (req: Request, ctx: Context) => {
  const { user, response } = await requireUser();
  if (!user) return response;

  const id = ctx.params.id;
  const [found] = await db
    .select()
    .from(items)
    .where(and(eq(items.id, id), eq(items.userId, user.id)))
    .limit(1);

  if (!found) return json({ error: "Not found" }, 404);

  if (req.method === "PATCH") {
    const body = (await req.json()) as {
      name?: string;
      notes?: string;
      tags?: unknown;
      imageKey?: string | null;
    };

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.name?.trim()) updates.name = body.name.trim().slice(0, 160);
    if (typeof body.notes === "string") updates.notes = body.notes.slice(0, 2000);
    if (body.tags !== undefined) updates.tags = normalizeTags(body.tags);
    if (body.imageKey !== undefined) {
      updates.imageKey = body.imageKey ? body.imageKey.slice(0, 200) : null;
    }

    const [updated] = await db
      .update(items)
      .set(updates)
      .where(and(eq(items.id, id), eq(items.userId, user.id)))
      .returning();

    return json(updated);
  }

  if (req.method === "DELETE") {
    if (found.imageKey) {
      try {
        const store = getStore({ name: "images", consistency: "strong" });
        await store.delete(found.imageKey);
      } catch {
        // Non-fatal — record deletion still proceeds
      }
    }
    await db.delete(items).where(and(eq(items.id, id), eq(items.userId, user.id)));
    return json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/items/:id",
  method: ["PATCH", "DELETE"],
};
