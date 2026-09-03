'use client';

import { useState } from 'react';

export default function IncidentTimeline() {
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    {
      label: "PHASE 1 : INTENT COLLISION",
      title: 'The "Rage-Tap" Anomaly',
      color: "bg-orange-500",
      titleColor: "text-white",
      content: (
        <>
          A "rage-tap" is the ultimate signal of high purchase intent colliding with structural failure. When a user taps <code className="bg-black px-1.5 py-0.5 rounded text-orange-400 border border-orange-900/50">button#checkout-mobile</code> 42 times, they are actively trying to give you money. The marketing team succeeded; the infrastructure dropped the ball at the one-yard line.
        </>
      )
    },
    {
      label: "PHASE 2 : INFRASTRUCTURE FREEZE",
      title: "The Invisible Wall",
      color: "bg-purple-500",
      titleColor: "text-white",
      content: (
        <>
          Tracing the exact <code className="bg-black px-1.5 py-0.5 rounded text-purple-400 border border-purple-900/50">/api/cart/sync</code> bottleneck at 1205ms removes engineering deniability. In mobile e-commerce, a 1.2-second delay shatters user trust, creating a "Ghost Tap" window where the UI freezes and the user bounces to a competitor.
        </>
      )
    },
    {
      label: "PHASE 3 : ACTIVE HEMORRHAGE",
      title: "Quantifiable Daily Bleed (£1,500/day)",
      color: "bg-red-500",
      titleColor: "text-red-400",
      pulse: true,
      content: (
        <>
          This bridges the gap between IT and the C-suite. Transforming an abstract technical bug into a highly quantifiable £1,500 daily loss moves the issue from the bottom of an engineering backlog directly to the top of the CFO's priority list.
        </>
      )
    },
    {
      label: "PHASE 4 : SYSTEMIC THREAT",
      title: "The Strategic Anchor (£135,000/Quarter)",
      color: "bg-red-600",
      titleColor: "text-white",
      content: (
        <>
          £1,500 is a bad day, but £135,000 is a missed quarterly revenue target. Projecting the loss over 90 days frames the vulnerability not as a minor glitch, but as a systemic, six-figure threat requiring executive intervention.
        </>
      )
    },
    {
      label: "PHASE 5 : TRIAGE PROTOCOL",
      title: "The Assumptive Close",
      color: "bg-blue-500",
      titleColor: "text-blue-400",
      content: (
        <>
          "Immediate technical resolution is essential." This positions you as a triage medic holding the tourniquet, not a vendor pushing software. The only logical next step is deploying the 48-hour telemetry pixel to stop the bleeding.
        </>
      )
    }
  ];

  return (
    <div className="mt-6 p-8 bg-black/80 rounded-xl border border-blue-950 shadow-2xl relative overflow-hidden">
      
      {/* Header & Segmented Progress Bar */}
      <div className="mb-8">
        <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Incident Response Log: Active Vulnerability
        </div>
        <div className="flex gap-2">
          {phases.map((phase, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                idx <= currentPhase ? phase.color : 'bg-gray-800'
              } ${idx === currentPhase && phase.pulse ? 'animate-pulse' : ''}`} 
            />
          ))}
        </div>
      </div>

      {/* Dynamic Slide Content (Keys on currentPhase to re-trigger animation) */}
      <div key={currentPhase} className="min-h-[160px] animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-xs font-mono text-gray-500 mb-2">
          {phases[currentPhase].label}
        </div>
        <h4 className={`${phases[currentPhase].titleColor} font-semibold text-xl tracking-wide mb-4`}>
          {phases[currentPhase].title}
        </h4>
        <p className="text-gray-300 text-base leading-relaxed">
          {phases[currentPhase].content}
        </p>
      </div>

      {/* Tour Navigation Controls */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-6">
        <button
          onClick={() => setCurrentPhase(prev => Math.max(0, prev - 1))}
          disabled={currentPhase === 0}
          className="text-sm font-mono text-gray-500 hover:text-gray-300 disabled:opacity-0 transition-colors cursor-pointer"
        >
          &lt; PREVIOUS
        </button>

        {currentPhase < phases.length - 1 ? (
          <button
            onClick={() => setCurrentPhase(prev => Math.min(phases.length - 1, prev + 1))}
            className="px-6 py-2 bg-blue-900/50 hover:bg-blue-800 text-blue-300 border border-blue-700/50 text-sm font-semibold rounded transition-colors cursor-pointer"
          >
            NEXT PHASE &gt;
          </button>
        ) : (
          <button
            onClick={() => alert("Ready to deploy tracking pixel.")}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
          >
            INITIATE PIXEL DEPLOYMENT
          </button>
        )}
      </div>

    </div>
  );
}