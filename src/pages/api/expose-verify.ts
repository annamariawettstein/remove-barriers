import type { APIRoute } from 'astro';

async function verifyUrl(url: string): Promise<boolean> {
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ExposeBot/1.0; +https://remove-barriers.vercel.app)'
      }
    }).catch(() => null);
    if (!res || res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ExposeBot/1.0; +https://remove-barriers.vercel.app)',
          Range: 'bytes=0-1024'
        }
      }).catch(() => null);
    }
    clearTimeout(timer);
    if (!res) return false;
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as { urls?: unknown } | null;
  const urls = Array.isArray(body?.urls)
    ? body!.urls.filter((u): u is string => typeof u === 'string').slice(0, 20)
    : null;

  if (!urls) {
    return new Response(JSON.stringify({ error: 'urls[] required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const verified = await Promise.all(urls.map((url) => verifyUrl(url)));
  return new Response(JSON.stringify({ verified }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
};
