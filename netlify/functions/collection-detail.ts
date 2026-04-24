import type { Config, Context } from "@netlify/functions";
import { eq, and, desc } from "drizzle-orm";
import { db, collections, items } from "../../db/index.js";
import { requireUser, json } from "./_shared/auth.js";

const ACCENTS = new Set(["tomato", "sun", "sea", "blush", "plum"]);

export default async (req: Request, ctx: Context) => {
  const { user, response } = await requireUser();
  if (!user) return response;

  const id = ctx.params.id;
  const [found] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, user.id)))
    .limit(1);

  if (!found) return json({ error: "Not found" }, 404);

  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(items)
      .where(and(eq(items.collectionId, id), eq(items.userId, user.id)))
      .orderBy(desc(items.createdAt));

    const collected = rows.filter((r) => !r.isWishlist);
    const wishlist = rows.filter((r) => r.isWishlist);

    return json({ collection: found, items: collected, wishlist });
  }

  if (req.method === "PATCH") {
    const body = (await req.json()) as {
      name?: string;
      emoji?: string;
      accent?: string;
    };
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.name?.trim()) updates.name = body.name.trim().slice(0, 120);
    if (body.emoji) updates.emoji = body.emoji.slice(0, 16);
    if (body.accent && ACCENTS.has(body.accent)) updates.accent = body.accent;

    const [updated] = await db
      .update(collections)
      .set(updates)
      .where(and(eq(collections.id, id), eq(collections.userId, user.id)))
      .returning();

    return json(updated);
  }

  if (req.method === "DELETE") {
    await db
      .delete(collections)
      .where(and(eq(collections.id, id), eq(collections.userId, user.id)));
    return json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/collections/:id",
  method: ["GET", "PATCH", "DELETE"],
};
