import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="client-scale-tracker" strategy="beforeInteractive">
          {`
            window.ClientScale = { 
              sessionId: crypto.randomUUID(),
              recovered: false 
            };
            console.log("[ClientScale Tracker]: Initialized successfully. Session ID:", window.ClientScale.sessionId);

            // Rage-click behavioral capture listener
            let clickCount = 0;
            let clickTimer = null;
            window.addEventListener('click', (e) => {
              clickCount++;
              if (clickCount >= 3) {
                console.log("[ClientScale]: Rage-click detected on element:", e.target);
                fetch('/api/telemetry', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    event: 'rage_click',
                    session_id: window.ClientScale.sessionId,
                    element: e.target.tagName,
                    timestamp: new Date().toISOString()
                  })
                }).catch(() => {});
                clickCount = 0;
              }
              clearTimeout(clickTimer);
              clickTimer = setTimeout(() => { clickCount = 0; }, 600);
            });
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}