import type { Config, Context } from "@netlify/functions";
import { eq, and, desc } from "drizzle-orm";
import { db, collections, items } from "../../db/index.js";
import { requireUser, json } from "./_shared/auth.js";

const ACCENTS = new Set(["tomato", "sun", "sea", "blush", "plum"]);

export default async (req: Request, _ctx: Context) => {
  const { user, response } = await requireUser();
  if (!user) return response;

  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, user.id))
      .orderBy(desc(collections.createdAt));

    const counts = await db
      .select({ collectionId: items.collectionId, id: items.id })
      .from(items)
      .where(and(eq(items.userId, user.id), eq(items.isWishlist, false)));

    const countByCollection = counts.reduce<Record<string, number>>((acc, row) => {
      acc[row.collectionId] = (acc[row.collectionId] ?? 0) + 1;
      return acc;
    }, {});

    return json(
      rows.map((c) => ({ ...c, itemCount: countByCollection[c.id] ?? 0 })),
    );
  }

  if (req.method === "POST") {
    const body = (await req.json()) as {
      name?: string;
      emoji?: string;
      accent?: string;
    };
    if (!body.name?.trim()) return json({ error: "Name is required" }, 400);

    const accent = body.accent && ACCENTS.has(body.accent) ? body.accent : "tomato";
    const [created] = await db
      .insert(collections)
      .values({
        userId: user.id,
        name: body.name.trim().slice(0, 120),
        emoji: body.emoji?.slice(0, 16) || "✨",
        accent,
      })
      .returning();

    return json({ ...created, itemCount: 0 }, 201);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/collections",
  method: ["GET", "POST"],
};
