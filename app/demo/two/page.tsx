'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function HomeDemoTwo() {
  const [activeTab, setActiveTab] = useState('what-we-do');

  return (
    <main className="min-h-[100dvh] bg-[#09090b] text-gray-200 font-sans selection:bg-cyan-500/30 flex flex-col items-center justify-center px-4 relative bg-[url('/grid-pattern.svg')]">
      
      {/* Top Bar Login */}
      <div className="absolute top-0 w-full p-6 flex justify-end">
         <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
           Tenant Login &rarr;
         </button>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-white uppercase mb-10">
        Client<span className="text-cyan-400">Scale</span> Systems
      </h1>

      <div className="w-full max-w-2xl space-y-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input 
            type="text" 
            className="w-full bg-[#0f0f12] border border-gray-800 focus:border-cyan-500 rounded-t-lg pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            placeholder="Target URL (e.g., https://yourfacility.com)"
          />
        </div>
        <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3.5 rounded-b-lg font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] mt-0">
          INITIALIZE DIAGNOSTIC SCAN
        </button>
      </div>

      {/* Tabbed Command Console */}
      <div className="w-full max-w-2xl border border-gray-800 rounded-xl bg-[#0f0f12] overflow-hidden shadow-2xl">
        <div className="flex border-b border-gray-800">
          <TabButton label="What We Do" isActive={activeTab === 'what-we-do'} onClick={() => setActiveTab('what-we-do')} />
          <TabButton label="AI Infrastructure" isActive={activeTab === 'infrastructure'} onClick={() => setActiveTab('infrastructure')} />
          <TabButton label="SaaS Pricing" isActive={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
        </div>
        
        <div className="p-6 md:p-8 min-h-[200px]">
          {activeTab === 'what-we-do' && (
            <div className="animate-in fade-in duration-300 space-y-2">
              <h3 className="text-cyan-400 font-semibold mb-2 uppercase tracking-wider text-sm">Diagnostic Forensics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We translate your raw technical latency into actionable business logic. Our system crawls your domain and identifies exact revenue leakages, mobile UI friction points, and missing DNS protocols killing your lead generation.
              </p>
            </div>
          )}
          {activeTab === 'infrastructure' && (
            <div className="animate-in fade-in duration-300 space-y-2">
              <h3 className="text-cyan-400 font-semibold mb-2 uppercase tracking-wider text-sm">Autonomous Code Healing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Once identified, our Edge Proxy layer intercepts your broken traffic and automatically patches technical SEO flaws, optimizes images, and rewrites broken scripts in real-time before it hits the browser.
              </p>
            </div>
          )}
          {activeTab === 'pricing' && (
            <div className="animate-in fade-in duration-300 space-y-2">
              <h3 className="text-cyan-400 font-semibold mb-2 uppercase tracking-wider text-sm">Transparent Scaling</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Unlock your multi-tenant dashboard and automated forensics engine for <strong className="text-white">$XXX/mo</strong>. Stop bleeding traffic and start capturing the revenue your facility deserves.
              </p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}

function TabButton({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
        isActive ? 'bg-gray-800/50 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/20'
      }`}
    >
      {label}
    </button>
  );
}