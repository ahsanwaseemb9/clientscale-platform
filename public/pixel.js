// public/pixel.js
(function() {
  const ENDPOINT = 'https://clientscale.io/api/telemetry'; // Update to your production domain
  const scriptTag = document.currentScript;
  const tenantId = scriptTag ? scriptTag.getAttribute('data-tenant-id') : 'unknown_tenant';

  // 1. Rage Click Detection
  let clicks = [];
  document.addEventListener('click', function(e) {
    const now = Date.now();
    clicks.push({ time: now, target: e.target });
    
    // Filter out clicks older than 1.5 seconds
    clicks = clicks.filter(c => now - c.time < 1500); 

    // If 3 or more clicks occur on the same target within 1.5s, trigger the anomaly
    if (clicks.length >= 3) {
      const isSameTarget = clicks.every(c => c.target === e.target);
      
      if (isSameTarget) {
        // Construct the CSS selector path for the broken element
        const elementId = e.target.id ? `#${e.target.id}` : e.target.tagName.toLowerCase();
        const elementClass = e.target.className && typeof e.target.className === 'string' 
            ? `.${e.target.className.split(' ').join('.')}` 
            : '';
        const identifier = elementId + (elementId.includes('#') ? '' : elementClass);

        sendBeacon({
          event_type: 'rage_click',
          element_id: identifier,
          rage_clicks: clicks.length,
          url: window.location.href,
          tenant_id: tenantId,
          timestamp: new Date().toISOString()
        });
        
        clicks = []; // Reset after firing to prevent duplicate bursts
      }
    }
  });

  // 2. API Latency Bottleneck Detection
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Intercept slow fetch or XHR requests taking longer than 800ms
        if ((entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') && entry.duration > 800) {
          
          // Filter out third-party analytics calls to focus strictly on their infrastructure
          if (!entry.name.includes('google-analytics') && !entry.name.includes('facebook.com')) {
            sendBeacon({
              event_type: 'latency_spike',
              api_endpoint: entry.name,
              latency_ms: Math.round(entry.duration),
              url: window.location.href,
              tenant_id: tenantId,
              timestamp: new Date().toISOString()
            });
          }
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }

  // 3. Payload Dispatcher
  function sendBeacon(payload) {
    // navigator.sendBeacon is non-blocking and fires even if the user is closing the page
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, JSON.stringify(payload));
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true // Ensures the request finishes if the user navigates away
      }).catch(() => {});
    }
  }
})();