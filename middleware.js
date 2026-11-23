// Check legacy homepage links before Vercel serves the static index.
export const config = { matcher: '/' };

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.searchParams.has('lang')) {
    url.searchParams.delete('lang');
    return Response.redirect(url, 308);
  }
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}
