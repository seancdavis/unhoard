import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";
import { requireUser, json } from "./_shared/auth.js";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default async (req: Request, _ctx: Context) => {
  const { user, response } = await requireUser();
  if (!user) return response;

  const formData = await req.formData();
  const image = formData.get("image") as File | null;

  if (!image) return json({ error: "No image provided" }, 400);
  if (!ALLOWED_TYPES.has(image.type)) return json({ error: "Unsupported file type" }, 400);
  if (image.size > MAX_SIZE) return json({ error: "File exceeds 5 MB" }, 400);

  const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = /^[a-z0-9]{1,5}$/.test(extension) ? extension : "jpg";
  const key = `${randomUUID()}.${safeExt}`;

  const store = getStore({ name: "images", consistency: "strong" });
  await store.set(key, image, {
    metadata: {
      contentType: image.type,
      originalFilename: image.name,
      uploadedAt: new Date().toISOString(),
      userId: user.id,
    },
  });

  return json({ key, url: `/img/card/${key}` });
};

export const config: Config = {
  path: "/api/upload",
  method: "POST",
};
