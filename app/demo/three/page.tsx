'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function HomeDemoThree() {
  const [drawerContent, setDrawerContent] = useState<'what-we-do' | 'pricing' | null>(null);

  return (
    <main className="h-[100dvh] bg-[#09090b] text-gray-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Absolute Top Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="w-10"></div> {/* Spacer */}
        <div className="flex space-x-6 text-sm font-medium tracking-wide uppercase">
          <button 
            onClick={() => setDrawerContent('what-we-do')}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            What We Do
          </button>
          <button 
             onClick={() => setDrawerContent('pricing')}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            Pricing
          </button>
        </div>
      </nav>

      {/* Center Search Engine Layout */}
      <div className="h-full flex flex-col justify-center items-center px-4 z-0">
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-white uppercase mb-12">
          Client<span className="text-cyan-400">Scale</span> Systems
        </h1>

        <div className="w-full max-w-3xl space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              className="w-full bg-[#0f0f12] border border-gray-800 focus:border-cyan-500 rounded-full pl-14 pr-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-2xl transition-all"
              placeholder="Target URL (e.g., https://yourfacility.com)"
            />
          </div>
          <div className="flex justify-center pt-4">
            <button className="bg-gray-900 hover:bg-cyan-600 border border-gray-800 hover:border-cyan-500 text-gray-300 hover:text-white px-8 py-3 rounded-md font-medium text-sm transition-all shadow-[0_0_15px_rgba(8,145,178,0.1)] hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]">
              Run Forensics Scan
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Glass Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#050505]/90 backdrop-blur-xl border-l border-gray-800 p-8 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 ${
          drawerContent ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-lg font-bold tracking-widest text-white uppercase">
            {drawerContent === 'what-we-do' ? 'System Overview' : 'SaaS Pricing'}
          </h2>
          <button 
            onClick={() => setDrawerContent(null)}
            className="p-2 text-gray-500 hover:text-white bg-gray-900 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {drawerContent === 'what-we-do' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-cyan-400 font-semibold mb-3 uppercase tracking-wider text-sm">Diagnostic Forensics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We translate your raw technical latency into actionable business logic. Our system crawls your domain and identifies exact revenue leakages.
              </p>
            </div>
             <div>
              <h3 className="text-cyan-400 font-semibold mb-3 uppercase tracking-wider text-sm">Autonomous Code Healing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our Edge Proxy layer intercepts broken traffic and automatically patches technical SEO flaws, optimizes images, and rewrites scripts in real-time.
              </p>
            </div>
          </div>
        )}

        {drawerContent === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="p-6 bg-[#0f0f12] border border-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">$XXX <span className="text-sm text-gray-500 font-normal">/ month</span></div>
              <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-gray-800">Complete access to the multi-tenant dashboard and forensics engine.</p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Unlimited Pipeline Diagnostics</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Captured & Ghost Lead Tracking</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Technical SEO Marketing</li>
              </ul>
              <button className="w-full mt-8 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors">
                Begin Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Background overlay when drawer is open */}
      {drawerContent && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden" 
          onClick={() => setDrawerContent(null)}
        />
      )}

    </main>
  );
}