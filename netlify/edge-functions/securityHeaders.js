export default async (request, context) => {
  const response = await context.next();
  const headers = new Headers(response.headers);

  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  headers.set('X-XSS-Protection', '1; mode=block');

  // Light caching for static assets, leave HTML mostly uncached for freshness
  const url = new URL(request.url);
  if (/\.(css|js|png|jpg|jpeg|svg|webp|gif)$/i.test(url.pathname)) {
    headers.set('Cache-Control', 'public, max-age=604800, immutable');
  } else {
    headers.set('Cache-Control', headers.get('Cache-Control') || 'public, max-age=600');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
