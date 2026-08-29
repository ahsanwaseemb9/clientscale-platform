// app/dashboard/boardroom/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function BoardroomDashboard() {
  const [showMath, setShowMath] = useState(false);
  const [briefing, setBriefing] = useState('Fetching live database metrics and generating briefing...');
  const [isLoading, setIsLoading] = useState(true);
  
  // Start with empty state instead of hardcoded numbers
  const [financialData, setFinancialData] = useState<{
    businessName: string;
    projectedQuarterlyLeakage: number;
    dailyLeakage: number;
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

        // THE FIX: Provide a fallback if business_name doesn't exist in the DB
        const displayName = liveData.business_name || `Tenant: ${liveData.tenant_id.substring(0, 8)}...`;

        // Set the UI to show the real database numbers
        setFinancialData({
          businessName: displayName,
          projectedQuarterlyLeakage: liveData.projected_quarterly_leakage,
          dailyLeakage: liveData.defensible_daily_leakage,
        });

        // 2. Feed the LIVE database numbers directly into the OpenAI Agent
        const aiResponse = await fetch('/api/ai/executive-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName: displayName, // Using the fallback name here too
            projectedQuarterlyLeakage: liveData.projected_quarterly_leakage,
            dailyLeakage: liveData.defensible_daily_leakage,
            primaryFriction: "violent rage-tapping on the mobile 'Submit Order' button"
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

        {/* Step 4.3: The Executive Briefing UI */}
        <section className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Structural Health Summary</h2>
          <div className={`text-lg leading-relaxed text-gray-300 text-justify ${isLoading ? 'animate-pulse' : ''}`}>
            {briefing}
          </div>
        </section>

        {/* Step 4.2: The "Show Your Work" Financials */}
        {financialData && (
          <section className="bg-gray-900 border border-red-900/30 p-8 rounded-xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Projected Quarterly Leakage</h2>
            <div className="text-6xl font-black text-white mb-6">
              £{financialData.projectedQuarterlyLeakage}
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
                <p>Sessions × Conversion Rate × AOV = £{financialData.dailyLeakage} / day</p>
                <div className="h-px bg-gray-800 my-3"></div>
                <p className="text-gray-500 mb-2">// 90-Day Extrapolation</p>
                <p>£{financialData.dailyLeakage} × 90 Days = <span className="text-red-400 font-bold">£{financialData.projectedQuarterlyLeakage}</span></p>
              </div>
            )}
          </section>
        )}

        {/* Step 4.1: The Friction Modules */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Identified Friction Points</h2>
          
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-orange-400 mb-2">Visual Friction (UI/UX)</h3>
            <p className="text-gray-300 text-sm">
              Your users violently tapped the <code className="bg-black px-1.5 py-0.5 rounded text-red-400 border border-red-900/50">button#submit-order</code> element 14 times yesterday across mobile devices.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}