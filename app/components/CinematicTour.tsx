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
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${step === 2 ? 'opacity-100 z-20 scale-100' : step > 2 ? 'opacity-30 scale-90 translate-x-[-20%] sm:translate-x-[-30%] z-0' : 'opacity-0 scale-110 z-0 pointer-events-none'}`}>
        
        {/* Module Label */}
        <div className="absolute top-24 left-6 sm:left-12 z-30 max-w-xs">
          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1">Phase 01: Simulation</div>
          <div className="text-xl font-black text-white mb-2">/dashboard/report</div>
          <p className="text-xs text-zinc-400 leading-relaxed">We scan the prospect's infrastructure inside a synthetic sandbox. Anomalies like DOM fragility and Thread Locks are isolated and rendered as threat vectors.</p>
        </div>

        <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] [transform:scale(0.8)_rotateX(60deg)_rotateZ(45deg)] sm:[transform:scale(1.0)_rotateX(60deg)_rotateZ(45deg)] [transform-style:preserve-3d]">
           <div className="absolute inset-0 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] bg-cyan-950/40 backdrop-blur-sm" />
           <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-[hologramScan_3s_linear_infinite]" />
           
           {/* Threat Tower (Thread Lock) */}
           <div className="absolute left-1/4 top-1/2 w-12 h-12 sm:w-16 sm:h-16 [transform-style:preserve-3d]">
             <div className="absolute bottom-0 left-0 w-full bg-red-600/90 h-[140px] sm:h-[180px] border border-red-400/50 origin-bottom [transform:rotateX(-90deg)]" />
             <div className="absolute top-0 right-0 h-full bg-red-800/90 w-[140px] sm:w-[180px] border border-red-400/50 origin-right [transform:rotateY(-90deg)]" />
             <div className="absolute inset-0 bg-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.8)] border border-red-300 [transform:translateZ(140px)] sm:[transform:translateZ(180px)]" />
             
             {/* Vitals Dossier */}
             <div className="absolute top-0 left-1/2 [transform:translateZ(190px)_translateX(-50%)_rotateZ(-45deg)_rotateX(-60deg)] sm:[transform:translateZ(240px)_translateX(-50%)_rotateZ(-45deg)_rotateX(-60deg)] w-40 sm:w-48 pointer-events-none">
               <div className="bg-black/90 border border-red-500/50 p-2.5 sm:p-3 rounded-lg backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                 <div className="text-[9px] sm:text-[10px] text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2"><ShieldAlert size={12}/> Critical Threat</div>
                 <div className="text-white text-xs sm:text-sm font-bold">Thread Lock</div>
                 <div className="text-red-300 text-[10px] sm:text-xs mt-1">TBT: 800ms (Main thread frozen)</div>
               </div>
               <div className="w-px h-8 sm:h-12 bg-red-500/50 mx-auto mt-1 sm:mt-2" />
             </div>
           </div>
        </div>
      </div>

      {/* ACT 3: Unpacking the Genome */}
      <div className={`absolute inset-0 flex items-center justify-end pr-6 sm:pr-24 transition-all duration-1000 ${step === 3 ? 'opacity-100 z-30 translate-x-0' : 'opacity-0 translate-x-12 z-0 pointer-events-none'}`}>
         <div className="w-full max-w-[280px] sm:max-w-md space-y-6">
            <h2 className="text-xs sm:text-sm text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6 font-bold">
              <Activity size={16} /> Synthetic DNA Extracted
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">We sequence the exact financial cost of these bottlenecks to build an undeniable business case before a single line of code is touched.</p>
            
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
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${step === 4 ? 'opacity-100 z-40 scale-100' : step > 4 ? 'opacity-0 scale-110 z-0' : 'opacity-0 scale-90 z-0 pointer-events-none'}`}>
        
        {/* Module Label */}
        <div className="absolute top-24 left-6 sm:left-12 z-30 max-w-sm">
          <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Phase 02: Ground Truth</div>
          <div className="text-xl font-black text-white mb-2">/dashboard/boardroom</div>
          <p className="text-xs text-zinc-400 leading-relaxed">The simulation ends. We release the telemetry beacon into the wild, capturing real physical frustration and linking it directly to lost cart revenue.</p>
        </div>

        {/* 3D Data Pipeline Hologram */}
        <div className="relative w-full max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mt-16 sm:mt-0 [perspective:1000px]">
          
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
               <div className="text-green-300 text-[10px] uppercase tracking-wider">Stripe/Shopify API</div>
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
          <button onClick={onClose} className="bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3">
            <Lock size={16} /> Access Mainframe
          </button>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center z-50 px-4">
         {step < 5 && (
           <button 
             onClick={() => setStep(s => s + 1)}
             className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 px-6 sm:px-8 py-3.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-cyan-900 transition-colors backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]"
           >
             {step === 1 ? 'Initiate Core Scan' : step === 2 ? 'Sequence Genome' : step === 3 ? 'Deploy Tracker' : 'Complete Tour'} <ChevronRight size={14} />
           </button>
         )}
      </div>
    </div>
  );
}