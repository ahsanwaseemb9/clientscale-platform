'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DecryptedLogo from './components/DecryptedLogo';

const FREE_EMAIL_SUBSTRINGS = ['gmail', 'gmall', 'gmai', 'yahoo', 'yaho', 'hotmail', 'hotmai', 'outlook', 'outlok', 'aol', 'icloud', 'iclud', 'proton', 'zoho', 'live', 'msn'];

export default function Home() {
  // Navigation states: 'none' | 'features' | 'pricing'
  const [activeSection, setActiveSection] = useState<'none' | 'features' | 'pricing'>('none');

  // Step 1: Form & Navigation States
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Real-time email validation states (using substring matching to catch typos like gmall.co)
  const [emailValue, setEmailValue] = useState('');
  const domain = emailValue.split('@')[1]?.toLowerCase() || '';
  const hasValidFormat = emailValue.includes('@') && domain.includes('.');
  const isFreeProvider = FREE_EMAIL_SUBSTRINGS.some(substring => domain.includes(substring));
  const isCorporateValid = hasValidFormat && !isFreeProvider;

  // Create a reference to the content area for scrolling
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Client-side submission logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Failsafe: prevent submission if somehow triggered without valid email
    if (!isCorporateValid) return;

    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    
    setIsLoading(true);

    // Route to the standalone /scan page so the sidebar doesn't show!
    router.push(`/scan?url=${encodeURIComponent(url)}`);
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center bg-[#020205] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden pb-24 relative">

      {/* --- SPACE AGENCY TELEMETRY LAYERS --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,24,48,0.85),rgba(2,2,5,1)_65%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_45%)] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute top-[30%] left-[10%] right-[10%] h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04),transparent_50%)] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#262d3d_1px,transparent_1px),linear-gradient(to_bottom,#262d3d_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-100 blur-[1px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_30px,#fff,transparent_100%),radial-gradient(1px_1px_at_75px_140px,rgba(255,255,255,0.7),transparent_100%),radial-gradient(1.5px_1.5px_at_120px_50px,#fff,transparent_100%),radial-gradient(1px_1px_at_240px_320px,rgba(255,255,255,0.5),transparent_100%)] bg-[size:300px_300px] opacity-40 pointer-events-none z-0 animate-pulse [animation-duration:8s]" />
      <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_45px_210px,#fff,transparent_100%),radial-gradient(1px_1px_at_180px_80px,rgba(255,255,255,0.8),transparent_100%),radial-gradient(1px_1px_at_290px_190px,#fff,transparent_100%)] bg-[size:400px_400px] opacity-25 pointer-events-none z-0 animate-pulse [animation-duration:12s]" />

      {/* --- FIXED NAVIGATION DOCK (FLOATS OVER EVERYTHING) --- */}
      <div className="fixed top-12 sm:top-16 left-1/2 -translate-x-1/2 flex items-center p-1 bg-[#07070f]/90 border border-zinc-800/90 rounded-full backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] z-[100] transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] w-max">
        <button 
          onClick={() => setActiveSection(activeSection === 'features' ? 'none' : 'features')} 
          className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-full transition-all duration-500 ease-out border text-[10px] sm:text-xs font-mono font-bold tracking-[0.15em] uppercase outline-none
            ${activeSection === 'features' 
              ? 'bg-cyan-400/20 border-cyan-400/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.4),0_0_40px_rgba(34,211,238,0.2),inset_0_0_15px_rgba(34,211,238,0.3)]' 
              : 'bg-transparent border-transparent text-zinc-300 hover:text-white hover:bg-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2),0_0_40px_rgba(255,255,255,0.1),inset_0_0_15px_rgba(255,255,255,0.15)]'}`}
        >
          {activeSection === 'features' ? '✕ Close' : 'What We Do'}
        </button>
        
        {/* Center flickering blue/cyan LED dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-200 mx-2 shadow-[0_0_10px_rgba(6,182,212,0.9),0_0_15px_rgba(59,130,246,0.7)] animate-pulse [animation-duration:0.8s]"></div>

        <button 
          onClick={() => setActiveSection(activeSection === 'pricing' ? 'none' : 'pricing')} 
          className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-full transition-all duration-500 ease-out border text-[10px] sm:text-xs font-mono font-bold tracking-[0.15em] uppercase outline-none
            ${activeSection === 'pricing' 
              ? 'bg-cyan-400/20 border-cyan-400/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.4),0_0_40px_rgba(34,211,238,0.2),inset_0_0_15px_rgba(34,211,238,0.3)]' 
              : 'bg-transparent border-transparent text-zinc-300 hover:text-white hover:bg-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2),0_0_40px_rgba(255,255,255,0.1),inset_0_0_15px_rgba(255,255,255,0.15)]'}`}
        >
          {activeSection === 'pricing' ? '✕ Close' : 'Pricing'}
        </button>
      </div>

      {/* --- SIDE PANEL DRAWER --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#050508] border-l border-zinc-800/50 shadow-2xl z-[200] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto flex flex-col
          ${activeSection !== 'none' ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 sticky top-0 bg-[#050508]/90 backdrop-blur-md z-10">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-zinc-300 uppercase">
            {activeSection === 'pricing' ? 'Deployment Options' : 'System Modules'}
          </h2>
          <button 
            onClick={() => setActiveSection('none')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 sm:p-8 flex-grow">
          {activeSection === 'features' && (
            <div className="space-y-4 animate-fade-in">
              {[
                { icon: '📡', title: 'Growth Traffic Intelligence', desc: 'Track multi-channel client acquisition pipelines. Pinpoint exact member locations through localized GPS/Geo-IP tracking to see where your marketing dollars match membership signups.' },
                { icon: '📊', title: 'Captured & Ghost Leads', desc: 'Full pipeline clarity. Log fully completed membership forms as Captured Leads while tracking real-time form inputs on-change to salvage Ghost Leads who drop off midway.' },
                { icon: '🔧', title: 'Autonomous Code Healing', desc: 'Continuous diagnostic sweeps find structural errors, latency bottle-necks, and core performance deficiencies—fixing layout script bugs automatically.' },
                { icon: '🔍', title: 'Technical SEO & Digital Marketing', desc: 'Track where your ad traffic comes from and fix slow landing pages so you don’t waste your marketing budget. Automatically update your site\'s code so your gym ranks #1 on Google Maps when local members search for fitness clubs.' },
                { icon: '🛡️', title: 'Isolated Multi-Tenant Dashboards', desc: 'Complete administrative access via secure admin/tenantID portals. Grant staff members operational visibility over isolated data grids safely.' },
                { icon: '🤖', title: 'Orchestrated AI Infrastructure', desc: 'Automated AI logic models continuously process server architecture latency data, rewriting sub-optimal code and auto-generating high-intent landing copies.' }
              ].map((card, idx) => (
                <div key={idx} className="bg-[#0a0a0f] border border-zinc-800/80 p-5 rounded-xl space-y-3 hover:border-cyan-500/30 hover:bg-zinc-900/50 transition-all duration-300 group shadow-md">
                  <div className="text-xl filter brightness-90 group-hover:brightness-110 group-hover:scale-110 transition-all origin-left">{card.icon}</div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors">{card.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">{card.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'pricing' && (
            <div className="space-y-4 animate-fade-in">
              {[
                { phase: 'Phase 01', title: 'Engine Integration', sub: 'Setup Fee', desc: 'Covers deep technical analysis, pixel script deployment, secure administrative database provisioning, and initial custom multi-tenant configuration.' },
                { phase: 'Phase 02', title: 'SaaS Allocation', sub: 'Software Platform', desc: 'Unlocks continuous 24/7 access to your multi-tenant dashboard tracking engines, real-time ghost lead forensics, automated technical healing, and AI diagnostic workflows.' },
                { phase: 'Full Service', title: 'Done-For-You Scaling', sub: 'Managed Growth Engine', desc: 'We take total execution control. Our marketing team runs hyper-targeted Meta/Google ads based on your geo-insights, executes technical local SEO optimization, and deploys high-converting ghost lead retrieval campaigns directly on behalf.' }
              ].map((plan, idx) => (
                <div key={idx} className={`${idx === 2 ? 'bg-[#05050c]/70 border-cyan-500/20' : 'bg-[#0a0a0f] border-zinc-800/80'} border p-5 rounded-xl relative overflow-hidden flex flex-col justify-between hover:bg-zinc-900/50 hover:border-cyan-500/30 transition-all duration-300 shadow-md group`}>
                  <div>
                    <div className={`absolute top-0 right-0 ${idx === 2 ? 'bg-cyan-950/60 text-cyan-400 border-l border-b border-cyan-500/20' : 'bg-zinc-900 text-zinc-400 border-l border-b border-zinc-800/80'} text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg`}>{plan.phase}</div>
                    <h4 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mt-1">{plan.title}</h4>
                    <h3 className="text-lg font-bold text-zinc-100 mt-1 transition-colors group-hover:text-cyan-400">{plan.sub}</h3>
                    <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-light">{plan.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dimming overlay when drawer is open */}
      <div 
        onClick={() => setActiveSection('none')}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[150] transition-opacity duration-500 ${activeSection !== 'none' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Hero Section Container */}
      <div className="w-full max-w-5xl px-4 pt-40 sm:pt-56 pb-0 text-center z-10 space-y-8 sm:space-y-10 animate-fade-in">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Animated Logo */}
          <div className="mt-0 mb-8 sm:mb-10">
            <DecryptedLogo text="Client Scale Systems" />
          </div>

          <div className="text-zinc-300 text-sm md:text-base tracking-wider max-w-[90vw] sm:max-w-2xl mx-auto pt-0 leading-relaxed px-4 antialiased font-light">
            <span className="font-mono block sm:inline whitespace-normal sm:whitespace-nowrap">
              We Turn <span className="text-cyan-400 font-semibold drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">Websites into</span> <span className="text-blue-400 font-semibold drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">Client Acquisition Machines</span>
            </span>
          </div>
        </div>

        {/* --- DYNAMIC FORM SECTION --- */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-12 flex flex-col items-center space-y-4 max-w-2xl mx-auto w-full px-2 relative">
          
          {/* Target URL Input */}
          <div className="relative flex items-center w-full bg-[#07070f]/90 border border-zinc-800/90 focus-within:border-cyan-400 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 transition-all duration-300 backdrop-blur-2xl ring-1 ring-zinc-900/50 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.12)] hover:shadow-[0_0_25px_rgba(6,182,212,0.22)] focus-within:shadow-[0_0_30px_rgba(6,182,212,0.35),_inset_0_0_12px_rgba(6,182,212,0.15)] transform hover:-translate-y-1 hover:scale-[1.012] focus-within:-translate-y-1 focus-within:scale-[1.012] hover:bg-[#090916]">
            <div className="pl-3 pr-1 sm:pl-4 sm:pr-2 text-zinc-500 focus-within:text-cyan-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input 
              type="text" 
              name="url" 
              required 
              pattern="^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
              title="Please enter a valid website (e.g., google.com, www.google.com, https://google.com)"
              autoComplete="off"
              placeholder="Target URL (e.g., https://yourfacility.com)" 
              className="w-full bg-transparent py-3 sm:py-3.5 px-2 text-zinc-100 placeholder-zinc-600 focus:outline-none text-sm font-normal tracking-wide [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]" 
            />
          </div>

          {/* Work Email Input (Live Validated) */}
          <div className={`relative flex items-center w-full bg-[#07070f]/90 border ${isFreeProvider ? 'border-red-500/50 focus-within:border-red-500/80' : 'border-zinc-800/90 focus-within:border-cyan-400'} rounded-xl sm:rounded-2xl p-2 sm:p-2.5 transition-all duration-300 backdrop-blur-2xl ring-1 ring-zinc-900/50 ${isFreeProvider ? 'focus-within:ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.12)]' : 'focus-within:ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.12)]'} hover:shadow-[0_0_25px_rgba(6,182,212,0.22)] transform hover:-translate-y-1 hover:scale-[1.012] focus-within:-translate-y-1 focus-within:scale-[1.012] hover:bg-[#090916]`}>
            <div className={`pl-3 pr-1 sm:pl-4 sm:pr-2 transition-colors ${isFreeProvider ? 'text-red-400' : 'text-zinc-500 focus-within:text-cyan-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="email" 
              name="email" 
              required 
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Work Email (Required)" 
              className="w-full bg-transparent py-3 sm:py-3.5 px-2 text-zinc-100 placeholder-zinc-600 focus:outline-none text-sm font-normal tracking-wide [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]" 
            />
            {/* Dynamic Status Indicator */}
            <div className={`flex items-center gap-1.5 sm:gap-2 bg-[#0d111c]/90 border border-zinc-800 rounded-lg px-2 sm:px-3 py-1.5 mr-1 font-mono text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase transition-all duration-300 shrink-0 ${isFreeProvider ? 'text-red-500 border-red-500/20' : isCorporateValid ? 'text-cyan-400 border-cyan-500/20' : 'text-zinc-500'}`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCorporateValid ? 'bg-cyan-400/60' : 'hidden'}`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isFreeProvider ? 'bg-red-500' : isCorporateValid ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse'}`}></span>
              </span>
              {isCorporateValid ? 'READY' : isFreeProvider ? 'BLOCKED' : 'WAITING'}
            </div>
          </div>
          
          {/* Conditional Rendering: Submit Button OR Sleek Full-Width Notice */}
          <div className="w-full flex justify-center mt-2 min-h-[60px]">
            {isCorporateValid ? (
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-auto bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 text-zinc-300 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-xl text-[11px] xs:text-xs sm:text-sm tracking-widest uppercase whitespace-nowrap animate-fade-in
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] active:text-cyan-400 active:scale-[0.98]'}`}
              >
                {isLoading ? 'Establishing Connection...' : 'Initialize Diagnostic Scan'}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 px-3 py-3 bg-[#07070f]/90 border border-cyan-500/20 rounded-xl sm:rounded-2xl text-white text-[10px] sm:text-xs tracking-tight sm:tracking-wide w-full backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.08)] animate-fade-in font-mono text-center whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                <span className="truncate">
                  {isFreeProvider 
                    ? "Free email providers are not accepted." 
                    : "Corporate domain required for enterprise telemetry."}
                </span>
              </div>
            )}
          </div>
        </form>
      </div>

    </main>
  );
}