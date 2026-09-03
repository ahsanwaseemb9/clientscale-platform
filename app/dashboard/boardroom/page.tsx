// app/dashboard/boardroom/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function BoardroomDashboard() {
  const [showMath, setShowMath] = useState(false);
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const [briefing, setBriefing] = useState('Fetching live database metrics and generating briefing...');
  const [isLoading, setIsLoading] = useState(true);
  
  // Financial State
  const [financialData, setFinancialData] = useState<{
    businessName: string;
    projectedQuarterlyLeakage: number;
    dailyLeakage: number;
  } | null>(null);

  // NEW: Dynamic Telemetry State
  const [frictionData, setFrictionData] = useState<{
    elementId: string;
    rageClicks: number;
    apiEndpoint: string;
    latencyMs: number;
  } | null>(null);

  useEffect(() => {
    async function loadLiveDashboard() {
      try {
        // 1. Pull the live data from your Supabase Phase 3 cron job
        const dbResponse = await fetch('/api/financials');
        const dbResult = await dbResponse.json();

        if (!dbResult.success || !dbResult.data) {
          setBriefing("Awaiting telemetry data. Install the tracking pixel to begin.");
          setIsLoading(false);
          return;
        }

        const liveData = dbResult.data;

        // Fallback if business_name doesn't exist in the DB
        const displayName = liveData.business_name || `Tenant: ${liveData.tenant_id.substring(0, 8)}...`;

        // Wire live financial numbers
        setFinancialData({
          businessName: displayName,
          projectedQuarterlyLeakage: liveData.projected_quarterly_leakage || 0,
          dailyLeakage: liveData.defensible_daily_leakage || 0,
        });

        // Wire live friction data (with safe fallbacks if DB fields are empty)
        const elementId = liveData.friction_element_id || 'button#submit-order';
        const rageClicks = liveData.rage_clicks || 0;
        const apiEndpoint = liveData.api_endpoint || '/api/checkout/process';
        const latencyMs = liveData.latency_ms || 0;

        setFrictionData({
          elementId,
          rageClicks,
          apiEndpoint,
          latencyMs
        });

        // 2. Feed the LIVE database numbers AND LIVE friction data directly into the OpenAI Agent
        const aiResponse = await fetch('/api/ai/executive-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: displayName,
            projectedQuarterlyLeakage: liveData.projected_quarterly_leakage,
            dailyLeakage: liveData.defensible_daily_leakage,
            // Replaced hardcoded string with dynamic friction variables
            primaryFriction: `${rageClicks} rage-taps on the '${elementId}' element, and ${latencyMs}ms latency bottlenecks on the ${apiEndpoint} endpoint`
          })
        });
        
        const aiData = await aiResponse.json();
        if (aiData.success) {
          setBriefing(aiData.briefing);
        } else {
          setBriefing("Error generating AI briefing.");
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        setBriefing("Failed to connect to the telemetry pipeline.");
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 sm:p-16 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Executive Telemetry Report</h1>
          <p className="text-gray-400 mt-2">
            Client: {financialData ? financialData.businessName : 'Loading...'}
          </p>
        </header>

        {/* Step 4.3: The Executive Briefing UI with Toggleable Detailed Explanation */}
        <section className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Structural Health Summary</h2>
            <div className={`text-lg leading-relaxed text-gray-300 text-justify ${isLoading ? 'animate-pulse' : ''}`}>
              {briefing}
            </div>
          </div>

          {!isLoading && (
            <div className="border-t border-gray-800 pt-4">
              <button 
                onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-500/50 underline-offset-4 font-mono flex items-center gap-2 cursor-pointer"
              >
                {showDetailedExplanation ? "Hide Detailed Explanation" : "Show Detailed Explanation"}
              </button>

              {showDetailedExplanation && (
                <div className="mt-6 p-6 bg-black/60 rounded-xl border border-blue-950 space-y-4 text-sm text-gray-300 animate-in fade-in slide-in-from-top-2 font-light leading-relaxed">
                  <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-2">
                    // Strategic Breakdown & Sales Mechanics
                  </div>
                  
                  <p>
                    <strong className="text-white font-medium">The Psychology of the "Rage-Tap":</strong> When users tap a button repeatedly, they aren't just browsing—they have high purchase intent colliding with structural failure. Your marketing team did their job, but the infrastructure dropped the ball at the one-yard line.
                  </p>
                  
                  <p>
                    <strong className="text-white font-medium">The Invisible Wall (Latency):</strong> A latency bottleneck on the backend API creates a "Ghost Tap" window where the UI freezes, forcing users to bounce to a competitor. Naming the exact database endpoint removes all deniability from their engineering team.
                  </p>
                  
                  <p>
                    <strong className="text-white font-medium">The Daily Bleed:</strong> Executives rarely care about generic software bugs, but they care deeply about losing revenue every 24 hours. This translates an abstract IT metric into a quantifiable daily hemorrhage for the CFO.
                  </p>
                  
                  <p>
                    <strong className="text-white font-medium">The Strategic Threat:</strong> Projecting the loss over 90 days frames the issue not as a minor glitch, but as a six-figure quarterly revenue threat, creating the absolute urgency required to close the deal.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Step 4.2: The "Show Your Work" Financials */}
        {financialData && (
          <section className="bg-gray-900 border border-red-900/30 p-8 rounded-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Projected Quarterly Leakage</h2>
            <div className="text-6xl font-black text-white mb-6">
              £{financialData.projectedQuarterlyLeakage.toLocaleString()}
            </div>
            
            <button 
              onClick={() => setShowMath(!showMath)}
              className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-gray-600 underline-offset-4"
            >
              {showMath ? "Hide Financial Formula" : "Show Defensible Math"}
            </button>

            {showMath && (
              <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-800 text-sm font-mono text-gray-300 animate-in fade-in slide-in-from-top-2">
                <p className="text-gray-500 mb-2">// Daily Leakage Calculation (The Moat)</p>
                <p>Sessions × Conversion Rate × AOV = £{financialData.dailyLeakage.toLocaleString()} / day</p>
                <div className="h-px bg-gray-800 my-3"></div>
                <p className="text-gray-500 mb-2">// 90-Day Extrapolation</p>
                <p>£{financialData.dailyLeakage.toLocaleString()} × 90 Days = <span className="text-red-400 font-bold">£{financialData.projectedQuarterlyLeakage.toLocaleString()}</span></p>
              </div>
            )}
          </section>
        )}

        {/* Step 4.1: The Friction Modules */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Identified Friction Points</h2>
          
          {frictionData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Visual Friction Card (Dynamically Rendered) */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg hover:border-orange-500/30 transition-colors">
                <h3 className="text-sm font-semibold text-orange-400 mb-3">Visual Friction (UI/UX)</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your users violently tapped the <code className="bg-black px-1.5 py-0.5 rounded text-red-400 border border-red-900/50">{frictionData.elementId}</code> element <strong className="text-white text-base">{frictionData.rageClicks}</strong> times yesterday across mobile devices.
                </p>
              </div>

              {/* Infrastructure Friction Card (Dynamically Rendered) */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg hover:border-purple-500/30 transition-colors">
                <h3 className="text-sm font-semibold text-purple-400 mb-3">Infrastructure Friction (API)</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Critical latency detected. The <code className="bg-black px-1.5 py-0.5 rounded text-purple-400 border border-purple-900/50">{frictionData.apiEndpoint}</code> endpoint is hanging at <strong className="text-white text-base">{frictionData.latencyMs}ms</strong>, causing cart abandonment.
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl text-sm text-gray-500 animate-pulse">
              Awaiting telemetry synchronization...
            </div>
          )}
        </section>

      </div>
    </div>
  );
}