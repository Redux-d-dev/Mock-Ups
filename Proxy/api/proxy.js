export const config = { runtime: 'edge' };

const CANVA = 'https://kiwi-3dytlt.my.canva.site';
const STRIP = new Set(['x-frame-options', 'content-security-policy', 'content-security-policy-report-only']);

export default async function handler(req) {
  const url = new URL(req.url);
  const target = `${CANVA}${url.pathname}${url.search}`;

  const upstream = await fetch(target, {
    headers: {
      'accept':          req.headers.get('accept') || '*/*',
      'accept-language': req.headers.get('accept-language') || 'en',
      'user-agent':      req.headers.get('user-agent') || 'Mozilla/5.0',
    },
  });

  const headers = new Headers();
  upstream.headers.forEach((v, k) => {
    if (!STRIP.has(k.toLowerCase())) headers.set(k, v);
  });

  return new Response(upstream.body, { status: upstream.status, headers });
}