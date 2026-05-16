import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

async function verifyUrl(url: string): Promise<boolean> {
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ExposeBot/1.0; +https://expose.app)",
      },
    }).catch(() => null);
    if (!res || res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ExposeBot/1.0; +https://expose.app)",
          Range: "bytes=0-1024",
        },
      }).catch(() => null);
    }
    clearTimeout(t);
    if (!res) return false;
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/verify")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json().catch(() => null)) as {
          urls?: unknown;
        } | null;
        const urls = Array.isArray(body?.urls)
          ? body!.urls.filter((u): u is string => typeof u === "string").slice(0, 20)
          : null;
        if (!urls) {
          return new Response(JSON.stringify({ error: "urls[] required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const verified = await Promise.all(urls.map((u) => verifyUrl(u)));
        return new Response(JSON.stringify({ verified }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
