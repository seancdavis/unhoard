import { getUser } from "@netlify/identity";

type User = NonNullable<Awaited<ReturnType<typeof getUser>>>;
type RequireUserResult =
  | { user: User; response: null }
  | { user: null; response: Response };

export async function requireUser(): Promise<RequireUserResult> {
  const user = await getUser();
  if (!user) {
    return {
      user: null,
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }
  return { user, response: null };
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
