'use client';

import { useState, useEffect, useRef } from 'react';
import { handleAuditSubmit } from './actions';
import DecryptedLogo from './components/DecryptedLogo';

export default function Home() {
  // Navigation states: 'none' | 'features' | 'pricing'
  const [activeSection, setActiveSection] = useState<'none' | 'features' | 'pricing'>('none');
  // Custom cursor state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Create a reference to the content area for scrolling
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  // Auto-scroll effect when a section is opened
  useEffect(() => {
    if (activeSection !== 'none' && contentRef.current) {
      // Small timeout ensures the DOM has updated before scrolling
      setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [activeSection]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#020205] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden pb-24 relative">
      {/* Custom Animated Cursor */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-500/50 pointer-events-none z-50 mix-blend-screen transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 16}px, ${mousePosition.y - 16}px)`
        }}
      />

      {/* --- SPACE AGENCY TELEMETRY LAYERS --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,24,48,0.85),rgba(2,2,5,1)_65%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_45%)] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute top-[30%] left-[10%] right-[10%] h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent_50%)] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#262d3d_1px,transparent_1px),linear-gradient(to_bottom,#262d3d_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-100 blur-[1px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#fff,transparent_100%),radial-gradient(1px_1px_at_75px_140px,rgba(255,255,255,0.7),transparent_100%),radial-gradient(1.5px_1.5px_at_120px_50px,#fff,transparent_100%),radial-gradient(1px_1px_at_240px_320px,rgba(255,255,255,0.5),transparent_100%)] bg-[size:300px_300px] opacity-40 pointer-events-none z-0 animate-pulse [animation-duration:8s]" />
      <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_45px_210px,#fff,transparent_100%),radial-gradient(1px_1px_at_180px_80px,rgba(255,255,255,0.8),transparent_100%),radial-gradient(1px_1px_at_290px_190px,#fff,transparent_100%)] bg-[size:400px_400px] opacity-25 pointer-events-none z-0 animate-pulse [animation-duration:12s]" />

      {/* Hero Section Container */}
      <div className="w-full max-w-5xl px-4 pt-10 sm:pt-28 pb-0 text-center z-10 space-y-8 sm:space-y-10 animate-fade-in">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Animated Logo Replaces the Static h2 */}
          <div className="mt-6 mb-12 sm:mt-8 sm:mb-16">
            <DecryptedLogo text="Client Scale Systems" />
          </div>

          <div className="flex mt-4 items-center">
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-white leading-[1.3] sm:leading-[1.25]">
              We turn fitness websites into <span className="font-bold text-white border-b-2 border-cyan-400 pb-0.5 whitespace-nowrap">client acquisition machines.</span>
            </h1>
          </div>
          <div className="text-zinc-300 text-xs sm:text-sm md:text-base tracking-wider max-w-[90vw] sm:max-w-2xl mx-auto pt-8 leading-relaxed px-4 antialiased font-light uppercase">
            <span className="font-mono block sm:inline whitespace-normal sm:whitespace-nowrap">
              The ultimate <span className="text-cyan-400 font-semibold drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] normal-case">Client Growth Platform</span> & <span className="text-blue-400 font-semibold drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] normal-case">Automated Maintenance Engine</span>
            </span>

            <div className="mt-4 font-mono">
              Designed exclusively for high-end fitness clubs,
              <br className="hidden sm:block" />
              gyms and wellness collectives.
            </div>
          </div>
        </div>

        {/* --- FIXED FORM SECTION --- */}
        <form action={handleAuditSubmit} noValidate className="mt-8 sm:mt-12 flex flex-col items-center space-y-5 sm:space-y-6 max-w-2xl mx-auto w-full group px-2 relative">
          <div className="relative flex items-center w-full bg-[#07070f]/90 border border-zinc-800/90 group-focus-within:border-cyan-400 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 transition-all duration-300 backdrop-blur-2xl ring-1 ring-zinc-900/50 group-focus-within:ring-2 group-focus-within:ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.12)] hover:shadow-[0_0_25px_rgba(6,182,212,0.22)] group-focus-within:shadow-[0_0_30px_rgba(6,182,212,0.35),_inset_0_0_12px_rgba(6,182,212,0.15)] transform hover:-translate-y-1 hover:scale-[1.012] group-focus-within:-translate-y-1 group-focus-within:scale-[1.012] hover:bg-[#090916]">
            <div className="pl-3 pr-1 sm:pl-4 sm:pr-2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              name="url" 
              required 
              autoComplete="off"
              placeholder="Enter your gym website URL..." 
              className="w-full bg-transparent py-3 sm:py-3.5 px-2 text-zinc-100 placeholder-zinc-600 focus:outline-none text-sm font-normal tracking-wide" 
            />
            <div className="hidden sm:flex items-center gap-2 bg-[#0d111c]/90 border border-zinc-800 rounded-lg px-3 py-1.5 mr-1 font-mono text-[10px] tracking-widest text-zinc-500 uppercase transition-all duration-300 group-focus-within:border-cyan-500/20 group-focus-within:text-cyan-400">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400/60 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span></span>
              READY
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-cyan-500/50 active:border-cyan-500/50 text-zinc-300 hover:text-cyan-400 active:text-cyan-400 font-semibold px-4 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-xl text-[11px] xs:text-xs sm:text-sm tracking-widest uppercase active:scale-[0.98] whitespace-nowrap">
            Audit Conversion Leakage & System Latency
          </button>
        </form>
      </div>

      {/* --- REMAINDER OF PAGE --- */}
      <div className="w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent relative my-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
      </div>

      <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 z-20 pb-16 w-full max-w-xl px-4">
        <button onClick={() => setActiveSection(activeSection === 'features' ? 'none' : 'features')} className={`w-1/2 px-3 sm:px-8 py-4 rounded-xl border text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 transform active:scale-95 whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] ${activeSection === 'features' ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] ring-2 ring-cyan-500 scale-[1.02]' : 'bg-zinc-900/80 border-zinc-700 text-zinc-200 hover:text-white hover:border-cyan-500/70 hover:bg-zinc-800'}`}>
          {activeSection === 'features' ? '✕ Hide' : '🧭 What We Do'}
        </button>
        <button onClick={() => setActiveSection(activeSection === 'pricing' ? 'none' : 'pricing')} className={`w-1/2 px-3 sm:px-8 py-4 rounded-xl border text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 transform active:scale-95 whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] ${activeSection === 'pricing' ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] ring-2 ring-cyan-500 scale-[1.02]' : 'bg-zinc-900/80 border-zinc-700 text-zinc-200 hover:text-white hover:border-cyan-500/70 hover:bg-zinc-800'}`}>
          {activeSection === 'pricing' ? '✕ Hide' : '💳 Pricing'}
        </button>
      </div>

      <div ref={contentRef} className="w-full flex justify-center scroll-mt-24">
        {activeSection === 'features' && (
          <div className="w-full max-w-5xl px-4 py-4 z-10 space-y-12 animate-fade-in">
            <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
              <h3 className="text-sm sm:text-base font-extrabold font-mono tracking-[0.35em] text-cyan-400 uppercase">System Modules</h3>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-wide text-zinc-200 leading-relaxed balance">Automated software tools built to turn your website traffic into high-value members.</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: '📡', title: 'Growth Traffic Intelligence', desc: 'Track multi-channel client acquisition pipelines. Pinpoint exact member locations through localized GPS/Geo-IP tracking to see where your marketing dollars match membership signups.' },
                { icon: '📊', title: 'Captured & Ghost Leads', desc: 'Full pipeline clarity. Log fully completed membership forms as Captured Leads while tracking real-time form inputs on-change to salvage Ghost Leads who drop off midway.' },
                { icon: '🔧', title: 'Autonomous Code Healing', desc: 'Continuous diagnostic sweeps find structural errors, latency bottle-necks, and core performance deficiencies—fixing layout script bugs automatically.' },
                { icon: '🔍', title: 'Technical SEO & Digital Marketing', desc: 'Track where your ad traffic comes from and fix slow landing pages so you don’t waste your marketing budget. Automatically update your site\'s code so your gym ranks #1 on Google Maps when local members search for fitness clubs.' },
                { icon: '🛡️', title: 'Isolated Multi-Tenant Dashboards', desc: 'Complete administrative access via secure admin/tenantID portals. Grant staff members operational visibility over isolated data grids safely.' },
                { icon: '🤖', title: 'Orchestrated AI Infrastructure', desc: 'Automated AI logic models continuously process server architecture latency data, rewriting sub-optimal code and auto-generating high-intent landing copies.' }
              ].map((card, idx) => (
                <div key={idx} className="bg-[#05050c]/80 border border-zinc-800/80 p-5 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4 hover:border-cyan-500/30 hover:bg-zinc-900/50 backdrop-blur-md transition-all duration-300 group shadow-xl">
                  <div className="text-xl sm:text-2xl filter brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all">{card.icon}</div>
                  <h3 className="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors">{card.title}</h3>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'pricing' && (
          <div className="w-full max-w-5xl px-4 py-4 z-10 text-center space-y-12 animate-fade-in">
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold font-mono tracking-[0.35em] text-cyan-400 uppercase">
                Pricing Core
              </h3>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">Deployment Options</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4 text-left">
              {[
                { phase: 'Phase 01', title: 'Engine Integration', sub: 'Setup Fee', desc: 'Covers deep technical analysis, pixel script deployment, secure administrative database provisioning, and initial custom multi-tenant configuration.' },
                { phase: 'Phase 02', title: 'SaaS Allocation', sub: 'Software Platform', desc: 'Unlocks continuous 24/7 access to your multi-tenant dashboard tracking engines, real-time ghost lead forensics, automated technical healing, and AI diagnostic workflows.' },
                { phase: 'Full Service', title: 'Done-For-You Scaling', sub: 'Managed Growth Engine', desc: 'We take total execution control. Our marketing team runs hyper-targeted Meta/Google ads based on your geo-insights, executes technical local SEO optimization, and deploys high-converting ghost lead retrieval campaigns directly on behalf.' }
              ].map((plan, idx) => (
                <div key={idx} className={`${idx === 2 ? 'bg-[#05050c]/70 border-cyan-500/20' : 'bg-[#05050c]/50 border-zinc-800/80'} border p-5 sm:p-6 rounded-xl sm:rounded-2xl relative overflow-hidden flex flex-col justify-between hover:bg-zinc-900/50 hover:border-cyan-500/30 backdrop-blur-md transition-all duration-300 shadow-xl group`}>
                  <div>
                    <div className={`absolute top-0 right-0 ${idx === 2 ? 'bg-cyan-950/60 text-cyan-400 border-l border-b border-cyan-500/20' : 'bg-zinc-900 text-zinc-400 border-l border-b border-zinc-800/80'} text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl`}>{plan.phase}</div>
                    <h4 className="text-[10px] sm:text-xs font-bold text-zinc-500 tracking-wider uppercase">{plan.title}</h4>
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 mt-1 sm:mt-2 transition-colors group-hover:text-cyan-400">{plan.sub}</h3>
                    <p className="text-sm sm:text-base text-zinc-400 mt-3 sm:mt-4 leading-relaxed font-light">{plan.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

