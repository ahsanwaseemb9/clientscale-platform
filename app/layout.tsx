// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Client Scale Systems",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Await the headers promise securely on the server
  const headersList = await headers();
  const tenantDomain = headersList.get("host") || "unknown";
  
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Stream 1: Native Custom Pixel with Persistent Session ID (Mobile Optimized) */}
        <Script id="native-pixel" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
          window.ClientScaleConfig = { tenantDomain: '${tenantDomain}' };

          (function() {
            // Retrieve or create a persistent session ID across page navigations
            let sessionId = localStorage.getItem('client_scale_session');
            if (!sessionId) {
              sessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
              localStorage.setItem('client_scale_session', sessionId);
            }

            let interactionTimestamps = [];
            const RAGE_TAP_THRESHOLD = 3;
            const RAGE_TAP_TIMEFRAME = 400; // ms
            
            // Upgraded to 'pointerup' for zero-delay mobile and desktop tracking
            window.addEventListener('pointerup', function(e) {
              const now = Date.now();
              interactionTimestamps.push(now);

              // Filter out interactions older than our 400ms window
              interactionTimestamps = interactionTimestamps.filter(t => now - t <= RAGE_TAP_TIMEFRAME);

              if (interactionTimestamps.length >= RAGE_TAP_THRESHOLD) {
                console.log("[Telemetry] Mobile-Optimized Rage Tap captured! Firing to backend...");
                
                // Precision Element Targeting
                const target = e.target;
                const elementTag = target && target.tagName ? target.tagName.toLowerCase() : 'unknown';
                const elementId = target && target.id ? '#' + target.id : '';
                const elementClass = target && typeof target.className === 'string' 
                  ? '.' + target.className.split(' ').filter(Boolean).join('.') 
                  : '';
                
                const cssSelector = elementTag + elementId + elementClass;

                fetch('/api/telemetry', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    event: 'rage_click', // Keeping the same event name for downstream Phase 3 compatibility
                    session_id: sessionId,
                    element: cssSelector,
                    x_coordinate: e.clientX,
                    y_coordinate: e.clientY,
                    timestamp: new Date().toISOString(),
                    tenant_domain: '${tenantDomain}'
                  })
                }).catch(() => {});
                
                // Clear the array to prevent duplicate rapid-firing
                interactionTimestamps = [];
              }
            });
          })();
        `}} />

        {/* Stream 2: PostHog Behavioral Tracking */}
        <Script id="posthog-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init('${posthogKey}', { 
            api_host: 'https://eu.i.posthog.com',
            loaded: function(ph) {
              ph.register({ tenant_domain: '${tenantDomain}' });
            }
          });
        `}} />

        {/* Stream 3: Sentry RUM */}
        <Script id="sentry-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
          window.sentryOnLoad = function () {
            if (typeof Sentry !== 'undefined') {
              Sentry.init({
                dsn: "${sentryDsn}",
                integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
                tracesSampleRate: 1.0,
                replaysSessionSampleRate: 0.1,
                replaysOnErrorSampleRate: 1.0,
                initialScope: { tags: { tenant_domain: '${tenantDomain}' } }
              });
            }
          };
        `}} />
        <Script 
          src="https://js-de.sentry-cdn.com/a15742f687c92e3dd2f71907f98c8458.min.js" 
          strategy="beforeInteractive" 
          crossOrigin="anonymous" 
          data-lazy="false" 
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}