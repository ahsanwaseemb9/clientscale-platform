'use client';

import { useState } from 'react';

export default function PixelIntegrationCard({ tenantId }: { tenantId: string }) {
  const [copied, setCopied] = useState(false);

  const snippet = `<script 
  src="https://clientscale.io/pixel.js" 
  data-tenant-id="${tenantId}" 
  async>
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full border border-cyan-900/40 bg-black/40 p-4 md:p-6 rounded-xl font-mono text-cyan-500 text-[10px] md:text-xs tracking-widest relative">
      <div className="flex justify-between items-center border-b border-cyan-900/50 pb-3 mb-4">
        <div>
          <h3 className="text-cyan-300 font-bold">TELEMETRY PIXEL DEPLOYMENT</h3>
          <p className="text-[8px] text-cyan-600 mt-0.5">Install this script in your application root layout to stream real-time friction events.</p>
        </div>
        <span className="text-[8px] px-2 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded">
          STATUS: READY TO DEPLOY
        </span>
      </div>

      <div className="relative bg-black/80 border border-cyan-950 p-4 rounded-lg overflow-x-auto my-3">
        <pre className="text-cyan-300 text-[10px] whitespace-pre-wrap">
          {snippet}
        </pre>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
        <p className="text-[8px] text-cyan-600">
          Target Stack: Next.js (`app/layout.tsx`), React, or HTML Head.
        </p>
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto py-2 px-4 bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-200 font-bold rounded transition-all cursor-pointer text-[9px]"
        >
          {copied ? '[ CODE COPIED TO CLIPBOARD ]' : '[ COPY SNIPPET ]'}
        </button>
      </div>
    </div>
  );
}