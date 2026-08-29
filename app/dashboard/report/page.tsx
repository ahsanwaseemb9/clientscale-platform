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
    // This will eventually fire the API route, for now we simulate the redirect to the Boardroom
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
  // Using the industry standard baseline formula to generate the hook
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

  const meta = auditData?.metaAndSocial || {};
  const a11y = auditData?.accessibility || {};
  const displayTitle = meta.title ? String(meta.title).replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"') : 'No Title Found';

  const brandName = (() => {
    try {
      const name = new URL(auditData.target).hostname.replace(/^www\./, '').split('.')[0];
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'This business';
    } catch { return 'This business'; }
  })();

  const industryTerms = auditData?.industryContext || { shortAction: `convert`, penalty: 'search engine visibility', buttons: 'forms and contact buttons' };
  const dynamicSynthesis = auditData?.industryContext?.executiveSynthesis || "Analyzing structural pipeline friction against conversion health...";

  const activeLeakagePoints = [
    `Latency is actively deflating conversions.`,
    isMapPenalized ? `Interaction to Next Paint (${rawInp}ms) is triggering Google Maps and Local SEO penalties.` : null,
    !isGhostOptimal ? `Main thread is blocked for ${ghostTapWindow}s, causing 'ghost taps' on mobile devices.` : null,
    isFragile ? `Massive DOM structure (${domSize} nodes) is draining mobile batteries and risking crashes.` : null,
    parseFloat(parasiteImpact) > 0 ? `${thirdPartyCount} external marketing trackers are responsible for ${parasiteImpact}% of mobile pipeline lag.` : null,
    isEmailVulnerable ? `Missing DMARC/SPF protocols. Automated free-trial follow-ups risk spam routing.` : null
  ].filter(Boolean) as string[];

  const dynamicSeverityTier = activeLeakagePoints.length >= 3 || rawInp > 200 ? 'HIGH' : activeLeakagePoints.length > 0 ? 'MODERATE' : 'OPTIMIZED';

  const frictionCards = [
    {
      id: 'revenue',
      isGreen: false, // Always false for the synthetic hook to create urgency
      title: 'Projected Quarterly Leakage',
      icon: AlertTriangle,
      value: `£${syntheticQuarterlyLeakage.toLocaleString()}`,
      description: `Synthetic projection based on standard ${syntheticDailySessions} daily sessions, £${estimatedAOV} AOV, and a 15% friction drop-off rate.`,
      drawerKey: 'revenue' as const,
      isZero: false,
      iconComp: DollarSign,
      highlight: true // Custom flag to style this specific card
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
    <div className="min-h-screen bg-[#020205] text-white flex flex-col lg:flex-row overflow-hidden antialiased">
      
      {/* LEFT PANE: The Hologram / Atmospheric Visual */}
      <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-screen bg-black overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-800 lg:sticky lg:top-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-gray-950 to-black pointer-events-none"></div>
        {/* Placeholder for Spline or Video component */}
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center animate-[spin_10s_linear_infinite] mb-4 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                <div className="w-24 h-24 rounded-full border border-purple-500/30 animate-[spin_6s_linear_infinite_reverse]"></div>
            </div>
            <p className="text-cyan-500 font-mono text-sm tracking-widest uppercase animate-pulse">
                [ Holographic Visual Engine ]
            </p>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Scanning {brandName} Infrastructure</span>
        </div>
      </div>

      {/* RIGHT PANE: The Cold Data & Call to Action */}
      <div 
        ref={scrollContainerRef}
        className="w-full lg:w-1/2 h-auto lg:h-screen overflow-y-auto p-6 sm:p-12 xl:p-16 custom-scrollbar relative z-10 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.05),transparent_60%)]"
      >
        <div className="max-w-xl mx-auto w-full space-y-10 lg:space-y-12 pb-24">
          
          {/* Header */}
          <header className="border-b border-zinc-800 pb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Synthetic Baseline Scan</h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm flex items-center gap-2">
                <Globe size={14} className="text-cyan-500" /> Target: {auditData.target.replace(/^https?:\/\//, '')}
            </p>
          </header>

          {/* AI Executive Synthesis */}
          <section className="bg-[#0a0a0f]/95 border border-zinc-700/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-600/5 pointer-events-none"></div>
            <div className="flex gap-4 items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <Cpu size={20} className="text-cyan-300" /> 
                </div>
                <div>
                    <h2 className="text-[10px] sm:text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-widest mb-2">
                        Initial AI Assessment
                    </h2>
                    <p className="text-sm text-zinc-200 leading-relaxed font-light">
                        {dynamicSynthesis}
                    </p>
                </div>
            </div>
          </section>

          {/* Friction Cards Grid */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {frictionCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div 
                    key={card.id}
                    className={`bg-[#12121c] border ${
                        card.highlight 
                        ? 'border-red-900/60 shadow-[0_0_30px_rgba(220,38,38,0.15)] bg-gradient-to-br from-[#1a0f14] to-[#12121c]'
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
             <div className="space-y-4">
              {infrastructure.length > 0 ? infrastructure.slice(0, 4).map((tech: any, idx: number) => {
                const rec = TECH_UPGRADES[tech.name] || { upgrade: "Edge Compute Offloading", reason: "Shifts processing to edge servers." };
                return (
                  <div key={idx} className="p-4 bg-black/40 border border-zinc-800 rounded-xl">
                      <div className="text-sm font-bold text-zinc-200 mb-1">{tech.name}</div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Upgrade &rarr; {rec.upgrade}</div>
                      <p className="text-xs text-zinc-500 font-light">{rec.reason}</p>
                  </div>
                );
              }) : (
                <div className="text-zinc-500 text-sm font-mono">No infrastructure data available.</div>
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
                  className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
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