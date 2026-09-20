// app/components/TelemetryTracker.tsx
'use client';

import { useEffect } from 'react';

export default function TelemetryTracker() {
  useEffect(() => {
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;

    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Target checkout or primary action buttons
      const isInteractive = target.closest('button, a, [data-action="checkout"]');
      if (!isInteractive) return;

      clickCount++;

      // Detect rage clicks (e.g., 3+ rapid clicks on the same element)
      if (clickCount >= 3) {
        // Scrape live cart total from common DOM patterns
        const cartElement = document.querySelector('[data-cart-total], .cart-total, #cart-total, .total-amount');
        const rawCartValue = cartElement ? cartElement.textContent?.replace(/[^0-9.]/g, '') : '0';
        const cart_value = parseFloat(rawCartValue || '149.99'); // Fallback demo value if empty

        const element_id = target.id || target.getAttribute('name') || target.tagName.toLowerCase();

        try {
          await fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'rage_click',
              element_id: element_id,
              rage_clicks: clickCount,
              url: window.location.href,
              cart_value: cart_value, // <-- Scraped live cart total sent to backend
              timestamp: new Date().toISOString()
            })
          });
          console.log(`[Telemetry] Rage click captured on #${element_id} | Scraped Cart: £${cart_value}`);
        } catch (err) {
          console.error('[Telemetry Error]:', err);
        }

        clickCount = 0;
      }

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 600); // Reset window for rapid clicks
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return null;
}