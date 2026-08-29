// app/dashboard/report/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  AlertTriangle, DollarSign, Ghost, ShieldAlert, Activity, 
  Database, ServerCrash, X, ChevronRight, MapPin, MailWarning,
  ListOrdered, Layers, Globe, Image as ImageIcon, Accessibility, 
  CheckCircle, AlertCircle, Cpu, Lock, Unlock, Search, Info, ArrowUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- UPGRADE MAPPING DICTIONARY ---
const TECH_UPGRADES: Record<string, { upgrade: string; reason: string }> = {
  "WordPress": { upgrade: "Next.js / React Architecture", reason: "Eliminates plugin bloat and achieves sub-200ms load times." },
  "Wix": { upgrade: "ClientScale Core Framework", reason: "Removes proprietary lock-in and dramatically reduces DOM fragility." },
  "Squarespace": { upgrade: "Custom Next.js Frontend", reason: "Unlocks advanced local SEO capabilities previously blocked by platform limits." },
  "Shopify": { upgrade: "Headless Commerce API", reason: "Separates the frontend presentation from backend inventory for instant page loads." },
  "Google Analytics": { upgrade: "Server-Side Tracking", reason: "Bypasses iOS ad-blockers to capture 'Ghost Leads' normally lost to privacy settings." },
  "Meta Pixel": { upgrade: "Conversion API (CAPI)", reason: "Direct server-to-server tracking for 100% accurate client acquisition costs." },
  "TikTok Pixel": { upgrade: "Server-Side Events", reason: "Prevents client-side script execution from blocking the main thread." },
  "Intercom": { upgrade: "Automated AI Lead Nurture", reason: "Replaces expensive human latency with instant AI triage for mid-sized operations." },
  "Mindbody": { upgrade: "Headless Booking API", reason: "Removes third-party iframe lag to keep users inside your optimized conversion funnel." },
  "Calendly": { upgrade: "Native API Scheduling", reason: "Prevents external CSS/JS injection and keeps the user on your domain." },
  "Apache": { upgrade: "Vercel Edge Network", reason: "Shifts compute to the edge for instant Time-to-First-Byte globally." },
  "Nginx": { upgrade: "Vercel Edge Network", reason: "Shifts compute to the edge for instant Time-to-First-Byte globally." },
  "Apple MapKit JS": { upgrade: "Lazy-Loaded Native Maps", reason: "Defers map rendering until the user scrolls, saving bandwidth and initial load time." },
  "Google Maps": { upgrade: "Static Edge Maps API", reason: "Replaces heavy interactive iframes with static placeholders to eliminate JS execution lag." },
  "HSTS": { upgrade: "Edge Node Routing", reason: "Maintains strict transport security while distributing server load across global edge nodes." },
};

// --- 3D CITY NODE GENERATOR (Hologram Table Effect) ---
const CityNode = ({ x, y, w, d, h, delay = 0 }: any) => {
  const u = 24; // Grid unit scale in pixels
  return (
    <div 
      className="absolute [transform-style:preserve-3d] animate-[pulse_4s_ease-in-out_infinite]" 
      style={{ left: x * u, top: y * u, width: w * u, height: d * u, animationDelay: `${delay}s` }}
    >
      {/* Base Floor Shadow/Glow */}
      <div className="absolute inset-0 bg-cyan-500/40 blur-md" />
      
      {/* Front/Bottom Wall (Faces Bottom-Left in Isometric) */}
      <div 
        className="absolute bottom-0 left-0 bg-gradient-to-t from-cyan-800/90 to-cyan-400/20 border-l border-r border-t border-cyan-400/60 origin-bottom backdrop-blur-sm"
        style={{ width: w * u, height: h * u, transform: `rotateX(-90deg)` }}
      />
      
      {/* Right Wall (Faces Bottom-Right in Isometric) */}
      <div 
        className="absolute top-0 right-0 bg-gradient-to-l from-cyan-900/90 to-cyan-500/20 border-t border-b border-l border-cyan-500/60 origin-right backdrop-blur-sm"
        style={{ width: h * u, height: d * u, transform: `rotateY(-90deg)` }}
      />
      
      {/* Top Face (Roof) */}
      <div 
        className="absolute inset-0 bg-cyan-400/30 border-2 border-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.8)] flex items-center justify-center overflow-hidden backdrop-blur-md"
        style={{ transform: `translateZ(${h * u}px)` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#67e8f944_1px,transparent_1px),linear-gradient(to_bottom,#67e8f944_1px,transparent_1px)] bg-[size:4px_4px]" />
      </div>
    </div>
  );
};

// The architectural layout of the 3D City hologram
const cityNodes = [
  { id: 1, x: 2, y: 2, w: 2, d: 2, h: 3, delay: 0.1 },
  { id: 2, x: 6, y: 1, w: 3, d: 2, h: 4, delay: 0.5 },
  { id: 3, x: 14, y: 2, w: 2, d: 3, h: 3, delay: 1.2 },
  { id: 4, x: 1, y: 8, w: 2, d: 4, h: 4, delay: 0.8 },
  { id: 5, x: 16, y: 7, w: 3, d: 2, h: 5, delay: 0.3 },
  { id: 6, x: 2, y: 15, w: 3, d: 3, h: 4, delay: 1.5 },
  { id: 7, x: 15, y: 14, w: 2, d: 2, h: 3, delay: 0.6 },
  { id: 8, x: 5, y: 6, w: 3, d: 3, h: 7, delay: 0.4 },
  { id: 9, x: 11, y: 5, w: 4, d: 2, h: 6, delay: 0.9 },
  { id: 10, x: 6, y: 11, w: 2, d: 4, h: 8, delay: 0.2 },
  { id: 11, x: 12, y: 10, w: 3, d: 3, h: 7, delay: 1.1 },
  { id: 12, x: 8, y: 7, w: 4, d: 4, h: 12, delay: 0.0 }, // Central Core Tower
];

export default function AuditReportPage() {
  const router = useRouter();
  const [auditData, setAuditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDrawer, setActiveDrawer] = useState<'revenue' | 'ghost' | 'parasite' | 'dom' | 'inp' | 'dns' | 'accessibility' | null>(null);
  const [isUpgradeUnlocked, setIsUpgradeUnlocked] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('clientScale_auditData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed && parsed.target) {
          setAuditData(parsed);
        }
      } catch (e) {
        setAuditData(null);
      }
    }
    setIsLoading(false);
  }, []);

  const handleDeployPixel = async () => {
    router.push('/dashboard/boardroom');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#020205] text-white">
        <div className="text-cyan-400 animate-pulse text-sm tracking-widest uppercase font-mono">
          Hydrating Executive Visuals...
        </div>
      </div>
    );
  }

  if (!auditData || !auditData.target) {
    return (
      <div className="min-h-screen w-full bg-[#020205] text-white flex flex-col items-center justify-center pb-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(8,145,178,0.3)]">
          <Search size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">No Target Domain Audited</h1>
        <p className="text-zinc-300 text-sm max-w-md leading-relaxed mt-2">
          Please scan a prospect URL to initialize the synthetic baseline projection.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors mt-6"
        >
          Return to Scanner
        </button>
      </div>
    );
  }

  // --- DEFENSIVE DATA SANITIZER ---
  const safeExtractNumber = (val: any, fallback: number): number => {
    if (val === null || val === undefined || val === 'N/A') return fallback;
    const parsed = parseInt(String(val).replace(/[^0-9-]/g, ''), 10);
    return isNaN(parsed) ? fallback : Math.max(0, parsed);
  };

  // --- SYNTHETIC FINANCIAL CALCULATIONS ---
  const syntheticDailySessions = 200;
  const estimatedAOV = 50;
  const syntheticDailyLeakage = syntheticDailySessions * 0.15 * estimatedAOV;
  const syntheticQuarterlyLeakage = syntheticDailyLeakage * 90;

  const perfScore = safeExtractNumber(auditData?.diagnostics?.performanceScore, 50);
  const rawTbt = safeExtractNumber(auditData?.diagnostics?.latency?.tbt, 800);
  const rawInp = safeExtractNumber(auditData?.diagnostics?.latency?.inp, 340);
  const thirdPartyCount = safeExtractNumber(auditData?.diagnostics?.thirdPartyScriptCount, 5);
  const isMapPenalized = rawInp > 200;
  
  const hasDmarc = auditData?.security?.dmarcConfigured === true; 
  const hasSpf = auditData?.security?.spfConfigured === true;
  const isEmailVulnerable = !hasDmarc || !hasSpf;

  const ghostTapWindow = (rawTbt / 1000).toFixed(1); 
  const isGhostOptimal = parseFloat(ghostTapWindow) === 0;
  const parasiteImpact = Math.min(95, (thirdPartyCount * 12)).toFixed(0);
  
  const rawDomNodes = safeExtractNumber(auditData?.diagnostics?.domElements, 1200 + (thirdPartyCount * 15));
  const domSize = rawDomNodes.toLocaleString();
  const isFragile = rawDomNodes > 800;

  const rawInfrastructure = Array.isArray(auditData?.infrastructure) ? auditData.infrastructure : [];
  const infrastructure = Array.from(
    new Map(rawInfrastructure.filter((tech: any) => tech && tech.name).map((tech: any) => [String(tech.name).toLowerCase().trim(), tech])).values()
  );

  const brandName = (() => {
    try {
      const name = new URL(auditData.target).hostname.replace(/^www\./, '').split('.')[0];
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'This business';
    } catch { return 'This business'; }
  })();

  const industryTerms = auditData?.industryContext || { shortAction: `convert`, penalty: 'search engine visibility', buttons: 'forms and contact buttons' };
  const dynamicSynthesis = auditData?.industryContext?.executiveSynthesis || "Analyzing structural pipeline friction against conversion health...";

  const frictionCards = [
    {
      id: 'revenue',
      isGreen: false,
      title: 'Projected Quarterly Leakage',
      icon: AlertTriangle,
      value: `£${syntheticQuarterlyLeakage.toLocaleString()}`,
      description: `Synthetic projection based on standard ${syntheticDailySessions} daily sessions, £${estimatedAOV} AOV, and a 15% friction drop-off rate.`,
      drawerKey: 'revenue' as const,
      isZero: false,
      iconComp: DollarSign,
      highlight: true
    },
    {
      id: 'ghost',
      isGreen: isGhostOptimal,
      title: 'Ghost Tap Window',
      icon: Ghost,
      value: isGhostOptimal ? '0.0s' : `${ghostTapWindow}s`,
      description: isGhostOptimal ? 'Main thread is unblocked.' : `Screen appears loaded, but taps on ${industryTerms.buttons} are ignored for ${ghostTapWindow}s.`,
      drawerKey: 'ghost' as const,
      isZero: isGhostOptimal,
      iconComp: Ghost
    },
    {
      id: 'inp',
      isGreen: !isMapPenalized,
      title: 'Local SEO Penalty',
      icon: MapPin,
      value: `${rawInp}ms`,
      description: isMapPenalized ? `INP exceeds 200ms threshold. Google is actively suppressing ${industryTerms.penalty}.` : `INP is within passing limits.`,
      drawerKey: 'inp' as const,
      isZero: !isMapPenalized,
      iconComp: MapPin
    },
    {
      id: 'parasite',
      isGreen: parseFloat(parasiteImpact) === 0,
      title: 'Parasite Load',
      icon: ServerCrash,
      value: `${parasiteImpact}%`,
      description: parseFloat(parasiteImpact) === 0 ? 'Zero external tracking scripts detected.' : `${thirdPartyCount} external marketing scripts cause ${parasiteImpact}% of mobile lag.`,
      drawerKey: 'parasite' as const,
      isZero: parseFloat(parasiteImpact) === 0,
      iconComp: ShieldAlert
    },
    {
      id: 'dns',
      isGreen: !isEmailVulnerable,
      title: 'Nurture Trust Risk',
      icon: MailWarning,
      value: isEmailVulnerable ? 'VULNERABLE' : 'SECURE',
      description: isEmailVulnerable ? `Missing DMARC/SPF. Outreach is highly likely routing to spam folders.` : `Domain authentication is intact.`,
      drawerKey: 'dns' as const,
      isZero: !isEmailVulnerable,
      iconComp: MailWarning
    },
    {
      id: 'dom',
      isGreen: !isFragile,
      title: 'DOM Fragility',
      icon: Database,
      value: domSize,
      description: !isFragile ? `HTML structure is optimized.` : 'Massive HTML node count is draining batteries and risking browser crashes.',
      drawerKey: 'dom' as const,
      isZero: !isFragile,
      iconComp: Database
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col antialiased w-full">
      
      {/* Injecting Custom Animation Keyframes for the Hologram Table & HUD */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hologramScan {
          0% { transform: translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(480px); opacity: 0; }
        }
        @keyframes hudFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}} />

      {/* TOP PANE: 3D Holographic Table Header (Axiom Style) */}
      <div className="relative w-full h-[60vh] min-h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-[#020205] to-black overflow-hidden flex items-center justify-center border-b border-zinc-800 z-20 shrink-0">
        
        {/* The 3D Isometric Projection Engine */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1200px] z-10 pointer-events-none mt-12">
          
          {/* Base Table Orientation */}
          <div className="relative w-[480px] h-[480px] [transform:scale(0.7)_rotateX(60deg)_rotateZ(45deg)] sm:[transform:scale(0.9)_rotateX(60deg)_rotateZ(45deg)] md:[transform:scale(1.1)_rotateX(60deg)_rotateZ(45deg)] [transform-style:preserve-3d]">
              
              {/* Glowing Base Plate */}
              <div className="absolute inset-0 bg-cyan-950/80 border-2 border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.4)] backdrop-blur-md" />
              
              {/* Grid Floor */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b266_2px,transparent_2px),linear-gradient(to_bottom,#0891b266_2px,transparent_2px)] bg-[size:24px_24px] opacity-80" />
              
              {/* Scanning Laser */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-white shadow-[0_0_40px_#22d3ee,0_0_20px_#22d3ee] animate-[hologramScan_4s_linear_infinite]" />
              
              {/* Vertical Glass Screen (Standing up from the grid) */}
              <div 
                 className="absolute border-2 border-cyan-400/40 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_40px_rgba(34,211,238,0.2)] flex items-center justify-center overflow-hidden"
                 style={{ 
                   left: '10%', top: '50%', width: '80%', height: '180px', 
                   transform: 'rotateX(-90deg)', transformOrigin: 'bottom' 
                 }}
              >
                 <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0891b244_1px,transparent_1px)] bg-[size:100%_4px]" />
                 <div className="text-cyan-300 font-mono text-2xl font-black tracking-[0.5em] opacity-50 drop-shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse">
                   TELEMETRY
                 </div>
              </div>

              {/* Render the 3D City Nodes */}
              {cityNodes.map(n => <CityNode key={n.id} {...n} />)}
          </div>
        </div>

        {/* --- FLOATING HOLOGRAPHIC DATA HUD (2D Overlay) --- */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center max-w-5xl mx-auto w-full">
            <div className="absolute top-[15%] left-[5%] sm:left-[15%] md:left-[20%] flex flex-col items-start animate-in fade-in zoom-in duration-700 delay-300" style={{ animation: 'hudFloat 6s ease-in-out infinite' }}>
                <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Database size={10} /> DOM Nodes
                </span>
                <span className="text-sm font-mono font-bold text-cyan-100 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1.5 rounded backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    {domSize}
                </span>
            </div>
            
            <div className="absolute top-[25%] right-[5%] sm:right-[15%] md:right-[20%] flex flex-col items-end text-right animate-in fade-in zoom-in duration-700 delay-500" style={{ animation: 'hudFloat 5s ease-in-out infinite' }}>
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <ServerCrash size={10} /> Parasite Load
                </span>
                <span className="text-sm font-mono font-bold text-purple-100 bg-purple-950/60 border border-purple-800/50 px-3 py-1.5 rounded backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    {parasiteImpact}%
                </span>
            </div>

            <div className="absolute bottom-[25%] left-[5%] sm:left-[10%] md:left-[15%] flex flex-col items-start animate-in fade-in zoom-in duration-700 delay-700" style={{ animation: 'hudFloat 7s ease-in-out infinite' }}>
                <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Ghost size={10} /> Thread Lock
                </span>
                <span className="text-sm font-mono font-bold text-red-100 bg-red-950/60 border border-red-800/50 px-3 py-1.5 rounded backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    {rawTbt}ms
                </span>
            </div>

            <div className="absolute bottom-[15%] right-[10%] sm:right-[20%] md:right-[25%] flex flex-col items-end text-right animate-in fade-in zoom-in duration-700 delay-1000" style={{ animation: 'hudFloat 6s ease-in-out infinite' }}>
                <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <MapPin size={10} /> Latency (INP)
                </span>
                <span className="text-sm font-mono font-bold text-orange-100 bg-orange-950/60 border border-orange-800/50 px-3 py-1.5 rounded backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    {rawInp}ms
                </span>
            </div>
        </div>

        <div className="absolute bottom-6 left-6 flex items-center gap-3 z-30 pointer-events-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,1)]"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest bg-black/80 px-3 py-1.5 rounded border border-cyan-900/80 backdrop-blur-md shadow-lg">
              Scanning {brandName} Infrastructure
            </span>
        </div>
      </div>

      {/* BOTTOM PANE: The Cold Data & Call to Action */}
      <div 
        ref={scrollContainerRef}
        className="w-full relative z-10 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.05),transparent_60%)] flex-grow"
      >
        <div className="max-w-3xl mx-auto w-full p-6 sm:p-12 xl:p-16 space-y-10 lg:space-y-12 pb-24">
          
          {/* Header */}
          <header className="border-b border-zinc-800 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Synthetic Baseline Scan</h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm flex items-center gap-2">
                <Globe size={14} className="text-cyan-500" /> Target: {auditData.target.replace(/^https?:\/\//, '')}
            </p>
          </header>

          {/* AI Executive Synthesis - Modernized & Justified */}
          <section className="bg-gradient-to-br from-[#0a0a0f] to-[#12121c] border border-zinc-700/60 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-600/5 pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Cpu size={22} className="text-cyan-400" /> 
                </div>
                <div className="flex-1 w-full">
                    <h2 className="text-[11px] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        Initial AI Assessment
                        <span className="h-px flex-1 bg-gradient-to-r from-cyan-900/50 to-transparent"></span>
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-300 leading-[1.8] font-light text-justify tracking-[0.015em] antialiased">
                        {dynamicSynthesis}
                    </p>
                </div>
            </div>
          </section>

          {/* Friction Cards Grid */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {frictionCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div 
                    key={card.id}
                    className={`bg-[#12121c] border ${
                        card.highlight 
                        ? 'border-red-900/60 shadow-[0_0_30px_rgba(220,38,38,0.15)] bg-gradient-to-br from-[#1a0f14] to-[#12121c] sm:col-span-2'
                        : card.isGreen 
                          ? 'border-green-900/30' 
                          : 'border-zinc-700/50'
                    } rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all flex flex-col justify-between`}
                  >
                    {card.highlight && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
                    )}
                    <div className="relative z-10">
                      <div className={`flex items-center justify-between mb-4 ${card.highlight ? 'text-red-400' : card.isGreen ? 'text-green-400' : 'text-blue-400'}`}>
                        <div className="flex items-center gap-2 font-mono font-bold">
                            <IconComponent size={18} />
                            <h3 className="text-[11px] uppercase tracking-widest">{card.title}</h3>
                        </div>
                        {card.highlight && <span className="text-[9px] px-2 py-1 bg-red-500/10 border border-red-500/20 rounded font-mono uppercase tracking-widest">Synthetic</span>}
                      </div>
                      <div className={`${card.highlight ? 'text-5xl sm:text-6xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-3xl sm:text-4xl text-white'} font-black tracking-tight mb-3`}>
                        {card.value}
                      </div>
                      <p className={`text-sm ${card.highlight ? 'text-zinc-300 font-mono' : 'text-zinc-400 font-light'} leading-relaxed`}>
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tech Stack Upgrade Path */}
          <section className="bg-[#12121c] border border-zinc-700/50 rounded-2xl p-6 sm:p-8">
             <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                <Layers className="text-purple-400 shrink-0" size={18} />
                <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-widest">Tech Stack Migration</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infrastructure.length > 0 ? infrastructure.slice(0, 4).map((tech: any, idx: number) => {
                const rec = TECH_UPGRADES[tech.name] || { upgrade: "Edge Compute Offloading", reason: "Shifts processing to edge servers." };
                return (
                  <div key={idx} className="p-4 bg-black/40 border border-zinc-800 rounded-xl flex flex-col">
                      <div className="text-sm font-bold text-zinc-200 mb-1">{tech.name}</div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2">Upgrade &rarr; {rec.upgrade}</div>
                      <p className="text-xs text-zinc-500 font-light mt-auto">{rec.reason}</p>
                  </div>
                );
              }) : (
                <div className="text-zinc-500 text-sm font-mono col-span-full">No infrastructure data available.</div>
              )}
             </div>
          </section>

          {/* The Conversion Lock CTA */}
          <section className="mt-8 pt-8 border-t border-zinc-800">
            <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-700/80 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl group hover:border-cyan-500/50 transition-colors">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_70%)] pointer-events-none"></div>
                <Lock size={24} className="text-zinc-400 mx-auto mb-4 group-hover:text-cyan-400 transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2">Verify The Damage</h3>
                <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto">
                    The £{syntheticQuarterlyLeakage.toLocaleString()} leakage above is a synthetic projection. Deploy the ClientScale tracker to capture actual user rage-taps and API failures.
                </p>
                <button 
                  onClick={handleDeployPixel}
                  className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Deploy Live Telemetry Pixel (48 Hrs)
                </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}