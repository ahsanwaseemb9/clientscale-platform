// app/dashboard/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Zap, Cpu, Search, ShieldCheck, Brain, Menu, X } from 'lucide-react'; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHealingDrawerOpen, setIsHealingDrawerOpen] = useState(false);
  const pathname = usePathname() || ''; // Retrieves the current URL path

  // Listen for the custom event from the boardroom page to open the mobile healing drawer reliably
  useEffect(() => {
    const handleOpenHealing = () => setIsHealingDrawerOpen(true);
    window.addEventListener('open-healing-drawer', handleOpenHealing);
    return () => window.removeEventListener('open-healing-drawer', handleOpenHealing);
  }, []);

  return (
    <div className="flex h-[100dvh] bg-[#09090b] text-gray-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Universal Floating Menu Trigger */}
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-40 p-2.5 bg-[#0f0f12]/90 backdrop-blur-md border border-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-900/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all group"
        aria-label="Open Navigation"
      >
        <Menu size={20} className="transition-transform group-active:scale-95" />
      </button>

      {/* Backdrop Overlay (closes drawer when clicking outside) */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 
        w-[85vw] sm:w-72 
        border-r border-gray-800 bg-[#0f0f12] 
        flex flex-col 
        z-50
        transform transition-transform duration-300 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.8)]
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Branding Header */}
        <div className="p-6 border-b border-gray-800 shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-widest text-white uppercase">
              Client<span className="text-cyan-400">Scale</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
              Multi-Tenant Dashboard
            </p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)} 
            className="text-gray-500 hover:text-white p-1 transition-colors rounded-md hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Module Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-2 px-3">
            System Modules
          </div>
          
          <SidebarLink onClick={() => setIsDrawerOpen(false)} href="/dashboard/report" icon={<Activity size={18} />} label="Growth Traffic Intelligence" active={pathname.includes('/dashboard/report')} />
          <SidebarLink onClick={() => setIsDrawerOpen(false)} href="/dashboard/leads" icon={<Zap size={18} />} label="Captured & Ghost Leads" active={pathname.includes('/dashboard/leads')} />
          <SidebarLink onClick={() => setIsDrawerOpen(false)} href="/dashboard/healing" icon={<Cpu size={18} />} label="Autonomous Code Healing" active={pathname.includes('/dashboard/healing')} />
          <SidebarLink onClick={() => setIsDrawerOpen(false)} href="/dashboard/seo" icon={<Search size={18} />} label="Technical SEO & Marketing" active={pathname.includes('/dashboard/seo')} />
          <SidebarLink onClick={() => setIsDrawerOpen(false)} href="/dashboard/ai" icon={<Brain size={18} />} label="Orchestrated AI Infrastructure" active={pathname.includes('/dashboard/ai')} />
          <SidebarLink onClick={() => setIsDrawerOpen(false)} href="/dashboard/tenant" icon={<ShieldCheck size={18} />} label="Isolated Tenant Access" active={pathname.includes('/dashboard/tenant')} />
        </nav>

        {/* Admin/User Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#0f0f12] shrink-0">
           <button className="w-full py-2.5 px-4 bg-gray-900 text-gray-300 border border-gray-700 rounded-md hover:bg-gray-800 hover:text-white transition-all text-sm font-medium flex items-center justify-center space-x-2">
             <span>System Settings</span>
           </button>
        </div>
      </aside>

      {/* Main Forensic Data Canvas - Expanded to full width */}
      <main className="flex-1 overflow-y-auto bg-[url('/grid-pattern.svg')] bg-repeat bg-center relative z-0 w-full">
        <div className="w-full p-4 md:p-8 pt-16 md:pt-20">
            {children}
        </div>
      </main>

      {/* GLOBAL LAYOUT-LEVEL MOBILE HEALING DRAWER */}
      {isHealingDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden">
          <div className="flex-1" onClick={() => setIsHealingDrawerOpen(false)} />
          
          <div className="w-full bg-[#020714] border-t-2 border-cyan-500 rounded-t-2xl p-4 max-h-[85vh] flex flex-col shadow-[0_-10px_30px_rgba(6,182,212,0.3)] relative overflow-hidden">
            <div className="w-12 h-1 bg-cyan-800/80 rounded-full mx-auto mb-3 shrink-0" />
            
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-cyan-900/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <h4 className="text-[10px] text-cyan-300 font-bold tracking-widest">AUTONOMOUS HEALING TERMINAL</h4>
              </div>
              <button
                onClick={() => setIsHealingDrawerOpen(false)}
                className="text-cyan-400 hover:text-white text-[9px] px-2.5 py-1 border border-cyan-800 rounded bg-cyan-950/60 active:bg-cyan-900"
              >
                [ CLOSE ✕ ]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 text-cyan-400 text-xs">
              <p className="p-4 text-center">Loading Autonomous Healing Terminal...</p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

// Reusable Sidebar Link Component 
function SidebarLink({ 
  href, 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  href: string, 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void
}) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-cyan-900/10 text-cyan-400 border border-cyan-900/30' 
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
      }`}
    >
      <span className={`${active ? 'text-cyan-400' : 'text-gray-500'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </Link>
  );
}