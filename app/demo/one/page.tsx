'use client';

import { ArrowDown, Search, Activity, Cpu } from 'lucide-react';

export default function HomeDemoOne() {
  return (
    <main className="min-h-screen bg-[#09090b] text-gray-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* 100vh Hero Section */}
      <section className="h-[100dvh] flex flex-col justify-center items-center relative px-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-white uppercase mb-12">
          Client<span className="text-cyan-400">Scale</span> Systems
        </h1>

        <div className="w-full max-w-2xl space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              className="w-full bg-[#0f0f12] border border-gray-800 focus:border-cyan-500 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-lg"
              placeholder="Target URL (e.g., https://yourfacility.com)"
            />
          </div>
          <p className="text-xs text-center text-gray-500 uppercase tracking-widest">
            *Requires a valid domain to extract Local SEO and Latency metrics
          </p>
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-md font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]">
            INITIALIZE DIAGNOSTIC SCAN
          </button>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center animate-bounce text-gray-600">
          <span className="text-[10px] uppercase tracking-widest mb-2">Scroll to explore SaaS</span>
          <ArrowDown size={20} />
        </div>
      </section>

      {/* The Fold - Content Section */}
      <section className="py-24 max-w-6xl mx-auto px-4 space-y-32">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="w-12 h-12 bg-cyan-900/20 rounded-lg flex items-center justify-center border border-cyan-900/50">
              <Activity className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Diagnostic Forensics</h2>
            <p className="text-gray-400 leading-relaxed">
              We translate raw technical latency into actionable business logic. Our system crawls your domain and identifies the exact UI bottlenecks and ghost leaks that are restricting your revenue pipeline.
            </p>
          </div>
          <div className="flex-1 w-full h-64 bg-[#0f0f12] border border-gray-800 rounded-xl bg-[url('/grid-pattern.svg')] flex items-center justify-center text-gray-700 font-mono text-sm">
             [ Forensic Data Visualization ]
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 space-y-6">
             <div className="w-12 h-12 bg-cyan-900/20 rounded-lg flex items-center justify-center border border-cyan-900/50">
              <Cpu className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">SaaS Pricing & Access</h2>
            <p className="text-gray-400 leading-relaxed">
              Enterprise-grade infrastructure starting at $XXX/month. Secure your isolated tenant workspace to deploy autonomous code healing and orchestrate your growth traffic directly from the edge.
            </p>
          </div>
          <div className="flex-1 w-full h-64 bg-[#0f0f12] border border-gray-800 rounded-xl flex items-center justify-center text-gray-700 font-mono text-sm">
             [ Pricing Tier Visualization ]
          </div>
        </div>
      </section>

    </main>
  );
}