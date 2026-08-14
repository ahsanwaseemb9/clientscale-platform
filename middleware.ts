import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only inject into HTML pages (skip API routes, static assets, etc.)
  if (request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/_next')) {
    return response;
  }

  // Unified script payload to inject into the <head>
  const edgeArsenalScript = `
    <script>
      window.ClientScaleConfig = { tenantId: '00000000-0000-0000-0000-000000000000' };

      (function() {
        let clickCount = 0;
        let lastClickTime = 0;
        
        window.addEventListener('click', function(e) {
          const now = Date.now();
          if (now - lastClickTime < 300) {
            clickCount++;
            if (clickCount >= 3) {
              fetch('/api/telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  event: 'rage_click',
                  session_id: 'edge_sess_' + Math.random().toString(36).substring(2, 9),
                  element: e.target ? e.target.tagName : 'UNKNOWN',
                  timestamp: new Date().toISOString()
                })
              }).catch(() => {});
              clickCount = 0;
            }
          } else {
            clickCount = 1;
          }
          lastClickTime = now;
        });
      })();
    </script>
  `;

  return new (globalThis as any).HTMLRewriter()
    .on('head', {
      element(element: any) {
        element.append(edgeArsenalScript, { html: true });
      }
    })
    .transform(response);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};