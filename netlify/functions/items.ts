import type { Config, Context } from "@netlify/functions";
import { and, eq } from "drizzle-orm";
import { db, collections, items } from "../../db/index.js";
import { requireUser, json } from "./_shared/auth.js";

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0 && t.length <= 40);
  return Array.from(new Set(cleaned)).slice(0, 20);
}

export default async (req: Request, _ctx: Context) => {
  const { user, response } = await requireUser();
  if (!user) return response;

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const body = (await req.json()) as {
    collectionId?: string;
    name?: string;
    notes?: string;
    tags?: unknown;
    imageKey?: string | null;
  };

  if (!body.collectionId || !body.name?.trim()) {
    return json({ error: "collectionId and name are required" }, 400);
  }

  const [parent] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, body.collectionId), eq(collections.userId, user.id)))
    .limit(1);

  if (!parent) return json({ error: "Collection not found" }, 404);

  const [created] = await db
    .insert(items)
    .values({
      collectionId: body.collectionId,
      userId: user.id,
      name: body.name.trim().slice(0, 160),
      notes: (body.notes ?? "").slice(0, 2000),
      tags: normalizeTags(body.tags),
      imageKey: body.imageKey?.slice(0, 200) || null,
      placeholderSeed: Math.floor(Math.random() * 360),
    })
    .returning();

  return json(created, 201);
};

export const config: Config = {
  path: "/api/items",
  method: ["POST"],
};
