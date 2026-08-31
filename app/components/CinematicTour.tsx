'use client';

import { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Activity, Database, Zap, Lock, ChevronRight, X } from 'lucide-react';

export default function CinematicTour({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [textStage, setTextStage] = useState(0);

  // Auto-advance narrative text in Act 1
  useEffect(() => {
    if (isOpen && step === 1) {
      const t1 = setTimeout(() => setTextStage(1), 800);
      const t2 = setTimeout(() => setTextStage(2), 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020205] text-white overflow-hidden font-mono selection:bg-cyan-500/30">
      
      {/* Background Holographic Grid */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,#0891b222_1px,transparent_1px),linear-gradient(to_bottom,#0891b222_1px,transparent_1px)] bg-[size:40px_40px] transition-all duration-1000 ${step > 1 ? 'opacity-30' : 'opacity-10'}`} />
      
      <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-50">
        <X size={24} />
      </button>

      {/* ACT 1: Control Room Initialization */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${step === 1 ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'}`}>
        <div className="w-full max-w-2xl px-6">
           <div className="flex items-center gap-3 mb-4 text-cyan-500">
             <Terminal size={20} className="animate-pulse" />
             <span className="text-xs uppercase tracking-[0.3em]">ClientScale Mainframe</span>
           </div>
           <div className="space-y-2 text-sm sm:text-base text-cyan-300">
             <p className={`transition-opacity duration-500 ${textStage >= 0 ? 'opacity-100' : 'opacity-0'}`}>&gt; System online.</p>
             <p className={`transition-opacity duration-500 ${textStage >= 1 ? 'opacity-100' : 'opacity-0'}`}>&gt; Establishing secure connection to target domain...</p>
             <p className={`transition-opacity duration-500 ${textStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>&gt; Initializing containment telemetry. Stand by for structural scan.</p>
           </div>
        </div>
      </div>

      {/* ACT 2: The Specimen Scan */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${step === 2 ? 'opacity-100 z-20 scale-100' : step > 2 ? 'opacity-30 scale-90 translate-x-[-20%] z-0' : 'opacity-0 scale-110 z-0 pointer-events-none'}`}>
        <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] [transform:rotateX(60deg)_rotateZ(45deg)] [transform-style:preserve-3d]">
           {/* Grid Base */}
           <div className="absolute inset-0 border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)] bg-cyan-950/40 backdrop-blur-sm" />
           <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-[hologramScan_3s_linear_infinite]" />
           
           {/* Threat Tower (Thread Lock) */}
           <div className="absolute left-1/4 top-1/2 w-16 h-16 [transform-style:preserve-3d]">
             <div className="absolute bottom-0 left-0 w-full bg-red-600/90 h-[180px] border border-red-400/50 origin-bottom [transform:rotateX(-90deg)]" />
             <div className="absolute top-0 right-0 h-full bg-red-800/90 w-[180px] border border-red-400/50 origin-right [transform:rotateY(-90deg)]" />
             <div className="absolute inset-0 bg-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.8)] border border-red-300 [transform:translateZ(180px)]" />
             
             {/* Vitals Dossier */}
             <div className="absolute top-0 left-1/2 [transform:translateZ(240px)_translateX(-50%)_rotateZ(-45deg)_rotateX(-60deg)] w-48 pointer-events-none">
               <div className="bg-black/90 border border-red-500/50 p-3 rounded-lg backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                 <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2"><ShieldAlert size={12}/> Critical Threat</div>
                 <div className="text-white text-sm font-bold">Thread Lock Detected</div>
                 <div className="text-red-300 text-xs mt-1">TBT: 800ms (Main thread frozen)</div>
               </div>
               <div className="w-px h-12 bg-red-500/50 mx-auto mt-2" />
             </div>
           </div>
        </div>
      </div>

      {/* ACT 3: Unpacking the Genome */}
      <div className={`absolute inset-0 flex items-center justify-end pr-8 sm:pr-24 transition-all duration-1000 ${step === 3 ? 'opacity-100 z-30 translate-x-0' : 'opacity-0 translate-x-12 z-0 pointer-events-none'}`}>
         <div className="w-full max-w-md space-y-6">
            <h2 className="text-sm text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
              <Activity size={16} /> Synthetic DNA Extracted
            </h2>
            
            <div className="space-y-4 relative before:absolute before:left-[19px] before:top-8 before:bottom-8 before:w-px before:bg-gradient-to-b before:from-cyan-500 before:to-red-500">
               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]">65</div>
                 <div>
                   <div className="text-xs text-zinc-400 uppercase tracking-wider">Health Baseline</div>
                   <div className="text-sm text-white">Performance Score</div>
                 </div>
               </div>
               
               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 rounded-full bg-orange-950 border border-orange-500 flex items-center justify-center text-orange-400">x</div>
                 <div>
                   <div className="text-xs text-zinc-400 uppercase tracking-wider">Latency Penalty Factor</div>
                   <div className="text-sm text-white">35% Friction Multiplier</div>
                 </div>
               </div>

               <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]">£</div>
                 <div>
                   <div className="text-xs text-red-400 uppercase tracking-wider font-bold">Quarterly Leakage Projected</div>
                   <div className="text-4xl text-white font-black tracking-tighter">£117,000</div>
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* ACT 4: Live Feed Transition */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ${step === 4 ? 'opacity-100 z-40 scale-100' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center text-green-400 mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <Zap size={32} />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">Simulation Complete.</h2>
          <p className="text-zinc-400 max-w-lg mb-8 leading-relaxed text-sm sm:text-base">
            Synthetic projection mapped the theoretical threat. The real hunt requires ground truth. Drop the telemetry beacon into the ecosystem to capture live Stripe and Shopify transaction data in the boardroom.
          </p>
          <button onClick={() => window.location.href = '/dashboard/boardroom'} className="bg-white text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3">
            <Lock size={16} /> Deploy Telemetry Beacon
          </button>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center z-50">
         {step < 4 && (
           <button 
             onClick={() => setStep(s => s + 1)}
             className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-cyan-900 transition-colors backdrop-blur-md"
           >
             {step === 1 ? 'Initiate Scan' : step === 2 ? 'Extract DNA' : 'View Ground Truth'} <ChevronRight size={14} />
           </button>
         )}
      </div>
    </div>
  );
}