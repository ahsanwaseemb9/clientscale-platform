// app/components/RemediationTerminal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Terminal, Play, CheckCircle2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RemediationTerminal({ tenantId }: { tenantId?: string }) {
  const [patches, setPatches] = useState<any[]>([]);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatches = async () => {
      // Fetch ALL patches to bypass any strict filters during your demo
      const { data, error } = await supabase
        .from('autonomous_patches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[Terminal Fetch Error]:', error.message);
        setFetchError(error.message);
      }
      if (data) {
        console.log('[Terminal Loaded Patches]:', data);
        setPatches(data);
      }
    };
    fetchPatches();

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
  }, []);

  const handleDeploy = async (patchId: string) => {
    setDeployingId(patchId);
    
    setTimeout(async () => {
      await supabase.from('autonomous_patches').update({ status: 'deployed' }).eq('id', patchId);
      setPatches((current) => current.filter(p => p.id !== patchId));
      setDeployingId(null);
    }, 2000);
  };

  if (fetchError) {
    return (
      <div className="w-full bg-red-950/40 border border-red-800/50 rounded-xl p-6 font-mono text-sm text-red-400 mt-6">
        <span>Supabase Error: {fetchError}</span>
      </div>
    );
  }

  if (patches.length === 0) {
    return (
      <div className="w-full bg-black/40 border border-gray-800/50 rounded-xl p-6 font-mono text-sm text-gray-500 flex items-center justify-center gap-3 shadow-inner mt-6">
        <Terminal size={16} className="opacity-50" />
        <span className="tracking-widest uppercase text-xs">Monitoring System for Vulnerabilities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </div>
        <h2 className="text-lg font-semibold text-gray-200">Autonomous Healing Required</h2>
      </div>

      {patches.map((patch) => (
        <div key={patch.id} className="w-full bg-black border border-blue-900/40 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.1)]">
          
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <Terminal size={14} className="text-blue-400" />
              <span>client_scale_remediation_agent.sh</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
              {patch.status || 'Ready to Push'}
            </span>
          </div>
          
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300 leading-relaxed font-sans">{patch.patch_description}</p>
            </div>
            
            <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-800 overflow-x-auto shadow-inner">
              <pre className="text-[13px] text-blue-300 font-mono leading-relaxed">
                <code>{patch.code_snippet}</code>
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => handleDeploy(patch.id)}
                disabled={deployingId === patch.id}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg"
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