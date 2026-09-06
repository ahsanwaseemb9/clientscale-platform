'use client';

import { useState } from 'react';

export default function IncidentTimeline() {
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    {
      label: "NODE 01 // INTENT_COLLISION",
      title: "THE 'RAGE-TAP' ANOMALY",
      nodeColor: "bg-yellow-500",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-900/50",
      content: (
        <>
          A "RAGE-TAP" IS THE ULTIMATE SIGNAL OF HIGH PURCHASE INTENT COLLIDING WITH STRUCTURAL FAILURE. WHEN A USER TAPS <code className="bg-black/50 px-1 py-0.5 border border-yellow-900/50 text-yellow-300">BUTTON#CHECKOUT-MOBILE</code> 42 TIMES, THEY ARE ACTIVELY TRYING TO COMPLETE A TRANSACTION. THE FRONT-END ACQUISITION SUCCEEDED; THE INFRASTRUCTURE DROPPED THE SIGNAL AT THE TERMINAL NODE.
        </>
      )
    },
    {
      label: "NODE 02 // INFRASTRUCTURE_FREEZE",
      title: "THE INVISIBLE WALL",
      nodeColor: "bg-purple-500",
      textColor: "text-purple-400",
      borderColor: "border-purple-900/50",
      content: (
        <>
          TRACING THE EXACT <code className="bg-black/50 px-1 py-0.5 border border-purple-900/50 text-purple-300">/API/CART/SYNC</code> BOTTLENECK AT 1205MS REMOVES ENGINEERING DENIABILITY. IN MOBILE ARCHITECTURE, A 1.2-SECOND DELAY SHATTERS USER TRUST, CREATING A "GHOST TAP" WINDOW WHERE THE UI FREEZES AND THE USER ABORTS THE SESSION TO A COMPETITOR.
        </>
      )
    },
    {
      label: "NODE 03 // ACTIVE_HEMORRHAGE",
      title: "QUANTIFIABLE DAILY BLEED",
      nodeColor: "bg-red-500",
      textColor: "text-red-500",
      borderColor: "border-red-900/50",
      pulse: true,
      content: (
        <>
          THIS BRIDGES THE GAP BETWEEN TELEMETRY DATA AND THE C-SUITE. TRANSFORMING AN ABSTRACT TECHNICAL BUG INTO A HIGHLY QUANTIFIABLE £1,500 DAILY LOSS ESCALATES THE VULNERABILITY FROM THE BOTTOM OF AN ENGINEERING BACKLOG DIRECTLY TO THE TOP OF THE CFO'S PRIORITY LIST.
        </>
      )
    },
    {
      label: "NODE 04 // SYSTEMIC_THREAT",
      title: "THE STRATEGIC ANCHOR",
      nodeColor: "bg-red-600",
      textColor: "text-red-400",
      borderColor: "border-red-900/80",
      pulse: true,
      content: (
        <>
          £1,500 IS A BAD CYCLE, BUT £135,000 IS A MISSED QUARTERLY REVENUE TARGET. PROJECTING THE LOSS OVER 90 DAYS FRAMES THE VULNERABILITY NOT AS A MINOR GLITCH, BUT AS A SYSTEMIC, SIX-FIGURE THREAT REQUIRING IMMEDIATE EXECUTIVE INTERVENTION.
        </>
      )
    },
    {
      label: "NODE 05 // TRIAGE_PROTOCOL",
      title: "THE ASSUMPTIVE CLOSE",
      nodeColor: "bg-cyan-500",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-900/50",
      content: (
        <>
          "IMMEDIATE TECHNICAL RESOLUTION IS ESSENTIAL." THIS POSITIONS CLIENT SCALE AS A TRIAGE MEDIC HOLDING THE TOURNIQUET, NOT A VENDOR PUSHING SOFTWARE. THE ONLY LOGICAL NEXT STEP IS DEPLOYING THE AUTONOMOUS CODE REMEDIATION PROTOCOL TO SEVER THE BLEED.
        </>
      )
    }
  ];

  return (
    <div className="mt-4 p-4 md:p-6 bg-black/60 border border-cyan-900/40 relative overflow-hidden font-mono text-[9px] md:text-[10px] tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.05)]">
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500"></div>

      {/* Header & Neural Pathway Visualizer */}
      <div className="mb-6">
        <div className="text-cyan-500 uppercase flex items-center gap-3 mb-4 border-b border-cyan-900/50 pb-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          TRACE_LOG: ACTIVE_VULNERABILITY_PATHWAY
        </div>
        
        {/* Neural Pathway Nodes */}
        <div className="flex items-center justify-between relative px-2">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-cyan-900/30 z-0"></div>
          
          {phases.map((phase, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-3 h-3 border transition-all duration-300 ${
                  idx === currentPhase 
                    ? `bg-black ${phase.borderColor} shadow-[0_0_8px_currentColor] ${phase.textColor}` 
                    : idx < currentPhase 
                      ? 'bg-cyan-800 border-cyan-600' 
                      : 'bg-black border-cyan-900/50'
                } ${idx === currentPhase && phase.pulse ? 'animate-pulse' : ''} ${idx === currentPhase ? 'rotate-45' : ''}`} 
              />
              <span className={`text-[8px] absolute top-5 whitespace-nowrap transition-colors duration-300 ${
                idx === currentPhase ? phase.textColor : 'text-cyan-800'
              }`}>
                N_0{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Slide Content */}
      <div 
        key={currentPhase} 
        className={`mt-10 min-h-[140px] p-4 border bg-black/40 ${phases[currentPhase].borderColor} animate-in fade-in slide-in-from-right-4 duration-300`}
      >
        <div className="text-cyan-600 mb-2 border-b border-cyan-900/30 pb-1">
          {phases[currentPhase].label}
        </div>
        <h4 className={`${phases[currentPhase].textColor} font-bold text-xs md:text-sm tracking-[0.2em] mb-3 drop-shadow-[0_0_3px_currentColor]`}>
          {phases[currentPhase].title}
        </h4>
        <p className="text-cyan-300/70 leading-loose text-justify">
          {phases[currentPhase].content}
        </p>
      </div>

      {/* Terminal Navigation Controls */}
      <div className="mt-6 flex items-center justify-between border-t border-cyan-900/40 pt-4">
        <button
          onClick={() => setCurrentPhase(prev => Math.max(0, prev - 1))}
          disabled={currentPhase === 0}
          className="text-cyan-700 hover:text-cyan-400 disabled:opacity-0 transition-colors cursor-pointer"
        >
          [ &lt; PREV_NODE ]
        </button>

        {currentPhase < phases.length - 1 ? (
          <button
            onClick={() => setCurrentPhase(prev => Math.min(phases.length - 1, prev + 1))}
            className="text-cyan-400 hover:text-white transition-colors cursor-pointer bg-cyan-950/30 border border-cyan-800/50 px-4 py-1"
          >
            [ NEXT_NODE &gt; ]
          </button>
        ) : (
          <button
            onClick={() => alert("Ready to deploy autonomous patch.")}
            className="text-red-400 hover:text-white transition-all cursor-pointer bg-red-950/30 border border-red-800 px-4 py-1 animate-pulse"
          >
            [ INITIATE_PATCH_DEPLOYMENT ]
          </button>
        )}
      </div>

    </div>
  );
}