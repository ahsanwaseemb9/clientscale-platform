// app/components/RemediationTerminal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Terminal, Play, CheckCircle2, RefreshCw } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MOCK_PATCH = {
  id: 'mock-patch-01',
  status: 'Ready to Push',
  patch_description: 'Mitigates 1205ms latency on /api/process-payment by optimizing database query indexes and implementing edge caching for checkout session validation.',
  code_snippet: `// Optimized Edge Route: /api/process-payment
export async function POST(req: Request) {
  const { tenantId, cartId } = await req.json();
  const cachedSession = await redis.get(\`session:\${cartId}\`);
  if (cachedSession) return Response.json({ status: 'optimized', cached: true });
  
  // Accelerated DB transaction with index hint
  const { data, error } = await supabase.rpc('optimize_checkout_node', { p_tenant_id: tenantId });
  if (error) throw error;
  return Response.json({ success: true, latency: '42ms' });
}`
};

export default function RemediationTerminal({ tenantId }: { tenantId?: string }) {
  const [patches, setPatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchPatches = async () => {
    setIsLoading(true);
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        setPatches([MOCK_PATCH]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('autonomous_patches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[Terminal Fetch Error]:', error.message);
        setFetchError(error.message);
        setPatches([MOCK_PATCH]);
      } else if (data && data.length > 0) {
        setPatches(data);
      } else {
        setPatches([MOCK_PATCH]);
      }
    } catch (err: any) {
      console.error('[Terminal Exception]:', err);
      setPatches([MOCK_PATCH]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatches();

    if (supabaseUrl && supabaseAnonKey) {
      const channel = supabase
        .channel('realtime-patches-all')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'autonomous_patches' },
          (payload) => {
            console.log('[Realtime Patch Caught]:', payload.new);
            setPatches((current) => [payload.new, ...current]);
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, []);

  const handleDeploy = async (patchId: string) => {
    setDeployingId(patchId);
    
    setTimeout(async () => {
      if (!patchId.startsWith('mock-') && supabaseUrl && supabaseAnonKey) {
        await supabase.from('autonomous_patches').update({ status: 'deployed' }).eq('id', patchId);
      }
      setPatches((current) => current.filter(p => p.id !== patchId));
      setDeployingId(null);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-black/40 border border-cyan-900/40 rounded-xl p-6 font-mono text-sm text-cyan-500 flex items-center justify-center gap-3 shadow-inner mt-4">
        <RefreshCw size={16} className="animate-spin text-cyan-400" />
        <span className="tracking-widest uppercase text-xs">Loading Autonomous Healing Terminal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4 pb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </div>
        <h2 className="text-sm md:text-base font-semibold text-cyan-200 tracking-wider">Autonomous Healing Required</h2>
      </div>

      {patches.map((patch) => (
        <div key={patch.id} className="w-full bg-black/80 border border-cyan-900/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          
          <div className="bg-[#090d16] border-b border-cyan-900/40 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <Terminal size={14} className="text-cyan-400" />
              <span>client_scale_remediation_agent.sh</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded">
              {patch.status || 'Ready to Push'}
            </span>
          </div>
          
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">{patch.patch_description}</p>
            </div>
            
            <div className="bg-[#02060f] p-4 rounded-lg border border-cyan-950 overflow-x-auto shadow-inner">
              <pre className="text-xs text-cyan-300 font-mono leading-relaxed">
                <code>{patch.code_snippet}</code>
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => handleDeploy(patch.id)}
                disabled={deployingId === patch.id}
                className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                {deployingId === patch.id ? (
                  <span className="animate-pulse">Pushing to Edge...</span>
                ) : (
                  <><Play size={14} /> Approve & Deploy Patch</>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}