'use client';

export default function IncidentTimeline() {
  return (
    <div className="mt-6 p-8 bg-black/70 rounded-xl border border-blue-950 space-y-8 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
      <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        // Incident Response Log: Active Vulnerability
      </div>
      
      <div className="relative border-l border-gray-800 ml-3 space-y-10 pb-4">
        
        {/* Node 1: Rage Tap */}
        <div className="relative pl-6">
          <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-orange-500 ring-4 ring-black"></span>
          <div className="text-xs font-mono text-gray-500 mb-1">PHASE 1 : INTENT COLLISION</div>
          <h4 className="text-white font-medium mb-2">The "Rage-Tap" Anomaly</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            A "rage-tap" is the ultimate signal of high purchase intent colliding with structural failure. When a user taps <code className="bg-black px-1.5 py-0.5 rounded text-orange-400 border border-orange-900/50">button#checkout-mobile</code> 42 times, they are actively trying to give you money. The marketing team succeeded; the infrastructure dropped the ball at the one-yard line.
          </p>
        </div>

        {/* Node 2: Latency */}
        <div className="relative pl-6">
          <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-black"></span>
          <div className="text-xs font-mono text-gray-500 mb-1">PHASE 2 : INFRASTRUCTURE FREEZE</div>
          <h4 className="text-white font-medium mb-2">The Invisible Wall</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Tracing the exact <code className="bg-black px-1.5 py-0.5 rounded text-purple-400 border border-purple-900/50">/api/cart/sync</code> bottleneck at 1205ms removes engineering deniability. In mobile e-commerce, a 1.2-second delay shatters user trust, creating a "Ghost Tap" window where the UI freezes and the user bounces to a competitor.
          </p>
        </div>

        {/* Node 3: Daily Bleed */}
        <div className="relative pl-6">
          <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-black"></span>
          <div className="text-xs font-mono text-gray-500 mb-1">PHASE 3 : ACTIVE HEMORRHAGE</div>
          <h4 className="text-red-400 font-medium mb-2">Quantifiable Daily Bleed (£1,500/day)</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            This bridges the gap between IT and the C-suite. Transforming an abstract technical bug into a highly quantifiable £1,500 daily loss moves the issue from the bottom of an engineering backlog directly to the top of the CFO's priority list.
          </p>
        </div>

        {/* Node 4: Quarterly Threat */}
        <div className="relative pl-6">
          <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-red-600 ring-4 ring-black"></span>
          <div className="text-xs font-mono text-gray-500 mb-1">PHASE 4 : SYSTEMIC THREAT</div>
          <h4 className="text-white font-medium mb-2">The Strategic Anchor (£135,000/Quarter)</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            £1,500 is a bad day, but £135,000 is a missed quarterly revenue target. Projecting the loss over 90 days frames the vulnerability not as a minor glitch, but as a systemic, six-figure threat requiring executive intervention.
          </p>
        </div>

        {/* Node 5: Assumptive Close */}
        <div className="relative pl-6">
          <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-black"></span>
          <div className="text-xs font-mono text-gray-500 mb-1">PHASE 5 : TRIAGE PROTOCOL</div>
          <h4 className="text-blue-400 font-medium mb-2">The Assumptive Close</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            "Immediate technical resolution is essential." This positions you as a triage medic holding the tourniquet, not a vendor pushing software. The only logical next step is deploying the 48-hour telemetry pixel to stop the bleeding.
          </p>
        </div>

      </div>
    </div>
  );
}