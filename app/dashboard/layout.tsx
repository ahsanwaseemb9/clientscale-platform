import Link from 'next/link';
import { Activity, Zap, Cpu, Search, ShieldCheck, Brain } from 'lucide-react'; // Added Brain icon

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#09090b] text-gray-200 font-sans selection:bg-cyan-500/30">
      
      {/* Enterprise Sidebar Navigation */}
      <aside className="w-72 border-r border-gray-800 bg-[#0f0f12] flex flex-col">
        
        {/* Branding Header */}
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-widest text-white uppercase">
            Client<span className="text-cyan-400">Scale</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Multi-Tenant Dashboard
          </p>
        </div>
        
        {/* Module Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-2 px-3">
            System Modules
          </div>
          
          <SidebarLink icon={<Activity size={18} />} label="Growth Traffic Intelligence" active={true} />
          <SidebarLink icon={<Zap size={18} />} label="Captured & Ghost Leads" />
          <SidebarLink icon={<Cpu size={18} />} label="Autonomous Code Healing" />
          <SidebarLink icon={<Search size={18} />} label="Technical SEO & Marketing" />
          
          {/* --- Added AI Module --- */}
          <SidebarLink icon={<Brain size={18} />} label="Orchestrated AI Infrastructure" />
          
          <SidebarLink icon={<ShieldCheck size={18} />} label="Isolated Tenant Access" />
        </nav>

        {/* Admin/User Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#0f0f12]">
           <button className="w-full py-2.5 px-4 bg-gray-900 text-gray-300 border border-gray-700 rounded-md hover:bg-gray-800 hover:text-white transition-all text-sm font-medium flex items-center justify-center space-x-2">
             <span>System Settings</span>
           </button>
        </div>
      </aside>

      {/* Main Forensic Data Canvas */}
      <main className="flex-1 overflow-y-auto bg-[url('/grid-pattern.svg')] bg-repeat bg-center">
        {/* The specific page content (like the audit report) will be injected here */}
        <div className="max-w-6xl mx-auto p-8">
            {children}
        </div>
      </main>
      
    </div>
  );
}

// Reusable Sidebar Link Component
function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href="#" 
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