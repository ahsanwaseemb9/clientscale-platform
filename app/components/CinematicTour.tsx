// components/CinematicTour.tsx
'use client';

import { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Activity, Zap, Lock, ChevronRight, X, Globe, MousePointerClick, CreditCard, ShoppingCart } from 'lucide-react';

export default function CinematicTour({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [textStage, setTextStage] = useState(0);

  // Auto-advance narrative text in Act 1
  useEffect(() => {
    if (isOpen && step === 1) {
      const t1 = setTimeout(() => setTextStage(1), 800);
      const t2 = setTimeout(() => setTextStage(2), 2200);
      const t3 = setTimeout(() => setTextStage(3), 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [isOpen, step]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setTextStage(0);
      }, 500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#020205] text-white overflow-hidden font-mono selection:bg-cyan-500/30">
      
      {/* Background Holographic Grid */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#0891b222_1px,transparent_1px),linear-gradient(to_bottom,#0891b222_1px,transparent_1px)] bg-[size:40px_40px] transition-all duration-1000 ${step > 1 ? 'opacity-30' : 'opacity-10'}`} />
      
      {/* Subtle Scanner Sweep */}
      <div className="absolute top-0 left-0 w-full h-[10vh] bg-gradient-to-b from-cyan-500/10 to-transparent shadow-[0_4px_20px_rgba(6,182,212,0.1)] animate-[hologramScan_6s_linear_infinite] pointer-events-none" />

      <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-50">
        <X size={28} />
      </button>

      {/* ACT 1: The Vision & Initialization */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${step === 1 ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'}`}>
        <div className="w-full max-w-2xl px-6">
           <div className="flex items-center gap-3 mb-6 text-cyan-500">
             <Globe size={24} className="animate-[spin_4s_linear_infinite]" />
             <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-bold">ClientScale Global Telemetry</span>
           </div>
           <div className="space-y-4 text-sm sm:text-base text-cyan-300">
             <p className={`transition-opacity duration-500 ${textStage >= 0 ? 'opacity-100' : 'opacity-0'}`}>&gt; Most digital infrastructures are black boxes.</p>
             <p className={`transition-opacity duration-500 ${textStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>&gt; Businesses lose millions to technical friction they cannot see.</p>
             <p className={`transition-opacity duration-500 ${textStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>&gt; We deploy military-grade telemetry to illuminate revenue leakage.</p>
             <p className={`transition-opacity duration-500 text-white font-bold mt-4 ${textStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>&gt; Booting virtual command center...</p>
           </div>
        </div>
      </div>

      {/* ACT 2: The Specimen Scan (dashboard/report) */}
      <div className={`absolute inset-0 flex flex-col sm:block items-center justify-start sm:justify-center pt-20 sm:pt-0 transition-all duration-1000 ${
        step === 2 ? 'opacity-100 z-20' : 
        step === 3 ? 'opacity-0 sm:opacity-30 sm:scale-90 sm:translate-x-[-30%] z-0 pointer-events-none' : 
        'opacity-0 sm:scale-90 sm:translate-x-[-30%] z-0 pointer-events-none'
      }`}>
        
        {/* Module Label - Pushed to top on mobile, absolute on desktop */}
        <div className="w-full px-6 sm:px-0 sm:absolute sm:top-24 sm:left-12 z-30 max-w-full sm:max-w-md shrink-0">
          <div className="text-[11px] sm:text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1.5">Phase 01: Simulation</div>
          <div className="text-xl sm:text-3xl font-black text-white mb-2.5">/dashboard/report</div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            We scan the prospect's infrastructure inside a synthetic sandbox. Anomalies like DOM fragility and Thread Locks are isolated and rendered as threat vectors.
          </p>
        </div>

        {/* 3D Grid - Scaled to 0.7 and nudged right on mobile to prevent edge cutoffs */}
        <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] [transform:scale(0.7)_translateX(25px)_rotateX(60deg)_rotateZ(45deg)] sm:[transform:scale(1.05)_translateX(0px)_rotateX(60deg)_rotateZ(45deg)] [transform-style:preserve-3d] mt-8 sm:mt-0 shrink-0 transition-transform duration-1000">
           <div className="absolute inset-0 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] bg-cyan-950/40 backdrop-blur-sm" />
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b244_2px,transparent_2px),linear-gradient(to_bottom,#0891b244_2px,transparent_2px)] bg-[size:24px_24px]" />
           <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-[hologramScan_3s_linear_infinite]" />
           
           {/* Tower 1: DOM Nodes (Cyan) */}
           <div className="absolute left-[50px] top-[50px] w-12 h-12 [transform-style:preserve-3d]">
             <div className="absolute bottom-0 left-0 w-full bg-cyan-600/90 h-[100px] border border-cyan-400/50 origin-bottom [transform:rotateX(-90deg)]" />
             <div className="absolute top-0 right-0 h-full bg-cyan-800/90 w-[100px] border border-cyan-400/50 origin-right [transform:rotateY(-90deg)]" />
             <div className="absolute inset-0 bg-cyan-500/80 shadow-[0_0_30px_rgba(34,211,238,0.7)] border border-cyan-300 [transform:translateZ(100px)]" />
             <div className="absolute top-0 left-1/2 [transform:translateZ(135px)_translateX(-50%)_rotateZ(-45deg)_rotateX(-60deg)] pointer-events-none flex flex-col items-center">
               <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/80 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap mb-0.5">DOM Nodes</span>
               <span className="text-xs font-black text-white bg-black/90 px-2 py-0.5 rounded border border-white/20">1,200</span>
             </div>
           </div>

           {/* Tower 2: Parasite Load (Purple) */}
           <div className="absolute left-[270px] top-[60px] w-11 h-11 [transform-style:preserve-3d]">
             <div className="absolute bottom-0 left-0 w-full bg-purple-600/90 h-[60px] border border-purple-400/50 origin-bottom [transform:rotateX(-90deg)]" />
             <div className="absolute top-0 right-0 h-full bg-purple-800/90 w-[60px] border border-purple-400/50 origin-right [transform:rotateY(-90deg)]" />
             <div className="absolute inset-0 bg-purple-500/80 shadow-[0_0_30px_rgba(168,85,247,0.7)] border border-purple-300 [transform:translateZ(60px)]" />
             <div className="absolute top-0 left-1/2 [transform:translateZ(95px)_translateX(-50%)_rotateZ(-45deg)_rotateX(-60deg)] pointer-events-none flex flex-col items-center">
               <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/80 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap mb-0.5">Parasite Load</span>
               <span className="text-xs font-black text-white bg-black/90 px-2 py-0.5 rounded border border-white/20">0%</span>
             </div>
           </div>

           {/* Tower 3: Latency INP (Orange) */}
           <div className="absolute left-[220px] top-[260px] w-11 h-12 [transform-style:preserve-3d]">
             <div className="absolute bottom-0 left-0 w-full bg-orange-600/90 h-[80px] border border-orange-400/50 origin-bottom [transform:rotateX(-90deg)]" />
             <div className="absolute top-0 right-0 h-full bg-orange-800/90 w-[80px] border border-orange-400/50 origin-right [transform:rotateY(-90deg)]" />
             <div className="absolute inset-0 bg-orange-500/80 shadow-[0_0_30px_rgba(249,115,22,0.7)] border border-orange-300 [transform:translateZ(80px)]" />
             <div className="absolute top-0 left-1/2 [transform:translateZ(115px)_translateX(-50%)_rotateZ(-45deg)_rotateX(-60deg)] pointer-events-none flex flex-col items-center">
               <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/80 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap mb-0.5">Latency (INP)</span>
               <span className="text-xs font-black text-white bg-black/90 px-2 py-0.5 rounded border border-white/20">302ms</span>
             </div>
           </div>

           {/* Tower 4: Threat Vector (Thread Lock - Red) */}
           <div className="absolute left-[50px] top-[260px] w-12 h-12 [transform-style:preserve-3d]">
             <div className="absolute bottom-0 left-0 w-full bg-red-600/90 h-[140px] sm:h-[160px] border border-red-400/50 origin-bottom [transform:rotateX(-90deg)]" />
             <div className="absolute top-0 right-0 h-full bg-red-800/90 w-[140px] sm:h-[160px] border border-red-400/50 origin-right [transform:rotateY(-90deg)]" />
             <div className="absolute inset-0 bg-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.8)] border border-red-300 [transform:translateZ(140px)] sm:[transform:translateZ(160px)]" />
             
             {/* Vitals Dossier - Adjusted width and origin (-35%) to fit mobile screen edge */}
             <div className="absolute top-0 left-1/2 [transform:translateZ(195px)_translateX(-35%)_rotateZ(-45deg)_rotateX(-60deg)] sm:[transform:translateZ(215px)_translateX(-50%)_rotateZ(-45deg)_rotateX(-60deg)] w-[160px] sm:w-48 pointer-events-none">
               <div className="bg-black/95 border border-red-500/70 p-2.5 sm:p-3 rounded-lg backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse">
                 <div className="text-[9px] sm:text-[10px] text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1.5 font-bold"><ShieldAlert size={12}/> Critical Threat</div>
                 <div className="text-white text-[11px] sm:text-sm font-bold truncate">Thread Lock</div>
                 <div className="text-red-300 text-[9px] sm:text-xs mt-0.5 truncate">TBT: 800ms (Frozen)</div>
               </div>
               <div className="w-px h-8 bg-red-500/50 mx-auto mt-1" />
             </div>
           </div>
        </div>
      </div>

      {/* ACT 3: Unpacking the Genome */}
      <div className={`absolute inset-0 flex items-center justify-center sm:justify-end px-6 sm:pr-24 transition-all duration-1000 ${step === 3 ? 'opacity-100 z-30 translate-x-0' : 'opacity-0 translate-x-12 z-0 pointer-events-none'}`}>
         <div className="w-full max-w-[320px] sm:max-w-md space-y-6">
            <h2 className="text-xs sm:text-sm text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6 font-bold">
              <Activity size={16} /> Synthetic DNA Extracted
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-light">
              We sequence the exact financial cost of these bottlenecks to build an undeniable business case before a single line of code is touched.
            </p>
            
            <div className="space-y-4 relative before:absolute before:left-[19px] before:top-8 before:bottom-8 before:w-px before:bg-gradient-to-b before:from-cyan-500 before:to-red-500">
               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 shrink-0 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]">65</div>
                 <div>
                   <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">Health Baseline</div>
                   <div className="text-xs sm:text-sm text-white">Performance Score</div>
                 </div>
               </div>
               
               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 shrink-0 rounded-full bg-orange-950 border border-orange-500 flex items-center justify-center text-orange-400">x</div>
                 <div>
                   <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">Latency Penalty Factor</div>
                   <div className="text-xs sm:text-sm text-white">35% Friction Multiplier</div>
                 </div>
               </div>

               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 shrink-0 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">£</div>
                 <div>
                   <div className="text-[10px] sm:text-xs text-red-400 uppercase tracking-wider font-bold">Quarterly Leakage</div>
                   <div className="text-2xl sm:text-4xl text-white font-black tracking-tighter">£117,000</div>
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* ACT 4: The Live Feed / Boardroom */}
      <div className={`absolute inset-0 flex flex-col sm:block items-center justify-start sm:justify-center pt-20 sm:pt-0 transition-all duration-1000 ${
        step === 4 ? 'opacity-100 z-40 scale-100' : 
        step > 4 ? 'opacity-0 scale-110 z-0 pointer-events-none' : 
        'opacity-0 scale-90 z-0 pointer-events-none'
      }`}>
        
        {/* Module Label */}
        <div className="w-full px-6 sm:px-0 sm:absolute sm:top-24 sm:left-12 z-30 max-w-full sm:max-w-md shrink-0">
          <div className="text-[11px] sm:text-xs text-purple-400 font-bold uppercase tracking-widest mb-1.5">Phase 02: Ground Truth</div>
          <div className="text-xl sm:text-3xl font-black text-white mb-2.5">/dashboard/boardroom</div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            The simulation ends. We release the telemetry beacon into the wild, capturing real physical frustration and linking it directly to lost cart revenue.
          </p>
        </div>

        {/* 3D Data Pipeline Hologram */}
        <div className="relative w-full max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mt-12 sm:mt-0 [perspective:1000px] shrink-0">
          
          {/* Node 1: Client UI */}
          <div className="flex flex-col items-center relative z-10 [transform:rotateY(15deg)]">
             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black border border-purple-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-4">
                <MousePointerClick className="text-purple-400 w-8 h-8 sm:w-10 sm:h-10" />
             </div>
             <div className="bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded text-center backdrop-blur-md">
               <div className="text-white text-sm font-bold font-sans">42 Rage Taps</div>
               <div className="text-purple-300 text-[10px] uppercase tracking-wider">Button Frozen</div>
             </div>
          </div>

          {/* Glowing Connection Line */}
          <div className="hidden sm:block absolute top-1/2 left-[25%] right-[25%] h-1 bg-gradient-to-r from-purple-500/20 via-cyan-500/50 to-green-500/20 -translate-y-8 z-0">
             <div className="absolute top-0 left-0 h-full w-24 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[hologramScan_2s_linear_infinite]" />
          </div>
          {/* Mobile Connection Line */}
          <div className="sm:hidden w-1 h-12 bg-gradient-to-b from-purple-500/50 to-green-500/50 relative z-0">
             <div className="absolute top-0 left-0 w-full h-8 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[hologramScan_2s_linear_infinite]" />
          </div>

          {/* Node 2: Payment Gateway */}
          <div className="flex flex-col items-center relative z-10 [transform:rotateY(-15deg)]">
             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black border border-green-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-4">
                <div className="flex gap-2">
                  <CreditCard className="text-green-400 w-6 h-6 sm:w-8 sm:h-8" />
                  <ShoppingCart className="text-cyan-400 w-6 h-6 sm:w-8 sm:h-8" />
                </div>
             </div>
             <div className="bg-green-950/60 border border-green-500/30 px-3 py-1.5 rounded text-center backdrop-blur-md">
               <div className="text-white text-sm font-bold font-sans">£4,200 Lost</div>
               <div className="text-green-300 text-[10px] uppercase tracking-wider">Stripe/Shopify/Custom APIs</div>
             </div>
          </div>

        </div>
      </div>

      {/* ACT 5: Final CTA */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ${step === 5 ? 'opacity-100 z-40 scale-100' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            <Zap size={32} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Tour Complete.</h2>
          <p className="text-zinc-400 max-w-lg mb-8 leading-relaxed text-sm sm:text-base">
            You've seen the mechanics. Now see your own data. Enter a target URL on the mainframe to initialize a live structural scan of your infrastructure.
          </p>
          <button onClick={onClose} className="bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3 cursor-pointer">
            <Lock size={16} /> Access Mainframe
          </button>
      </div>

      {/* Raised Navigation Controls - Hidden until Text Stage 3 is reached */}
      <div className={`absolute bottom-16 sm:bottom-20 left-0 w-full flex justify-center z-50 px-4 transition-all duration-1000 ${step === 1 && textStage < 3 ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}>
         {step < 5 && (
           <button 
             onClick={() => setStep(s => s + 1)}
             className="flex items-center gap-2 bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 px-7 sm:px-9 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-cyan-900 transition-all backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 cursor-pointer"
           >
             {step === 1 ? 'Initiate Core Scan' : step === 2 ? 'Sequence Genome' : step === 3 ? 'Deploy Tracker' : 'Complete Tour'} <ChevronRight size={14} />
           </button>
         )}
      </div>
    </div>
  );
}