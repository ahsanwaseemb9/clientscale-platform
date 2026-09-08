// app/components/RemediationTerminal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Terminal, Play, CheckCircle2, RefreshCw } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: any = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error('Supabase initialization error:', e);
}

export default function RemediationTerminal({ tenantId }: { tenantId?: string }) {
  const [patches, setPatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deployingId, setDeployingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPatches() {
      if (!supabase) {
        console.error('Supabase client not initialized');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        
        // Fetch all autonomous patches from Supabase
        const { data, error } = await supabase
          .from('autonomous_patches')
          .select('*')
          .order('created_at', { ascending: false });
        
        console.log('SUPABASE PATCHES FETCH RESULT:', { data, error, count: data?.length });

        if (!isMounted) return;

        if (error) {
          console.error('Supabase fetch error:', error);
        } else if (data) {
          setPatches(data);
        }
      } catch (err) {
        console.error('[Terminal Fetch Error]:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchPatches();

    let channel: any = null;
    if (supabase) {
      try {
        channel = supabase
          .channel(`realtime-patches-global-${Date.now()}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'autonomous_patches' },
            (payload: any) => {
              if (!isMounted || !payload?.new) return;
              setPatches((current) => [payload.new, ...(Array.isArray(current) ? current : [])]);
            }
          )
          .subscribe();
      } catch (e) {
        console.error('[Realtime Setup Error]:', e);
      }
    }

    return () => {
      isMounted = false;
      if (supabase && channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      }
    };
  }, []);

  const handleDeploy = async (patchId: string) => {
    setDeployingId(patchId);
    
    setTimeout(async () => {
      try {
        if (patchId && supabase) {
          await supabase.from('autonomous_patches').update({ status: 'deployed' }).eq('id', patchId);
        }
      } catch (e) {
        console.error('[Deploy Error]:', e);
      }
      setPatches((current) => (Array.isArray(current) ? current.filter(p => p?.id !== patchId) : []));
      setDeployingId(null);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4 pb-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <h2 className="text-xs sm:text-sm md:text-base font-semibold text-cyan-200 tracking-wider">
            Autonomous Healing Required ({patches.length})
          </h2>
        </div>
      </div>

      {isLoading && patches.length === 0 && (
        <div className="flex items-center gap-2 text-cyan-500 text-xs py-4 px-1">
          <RefreshCw size={14} className="animate-spin" />
          <span>Syncing live patch nodes...</span>
        </div>
      )}

      {!isLoading && patches.length === 0 && (
        <div className="text-cyan-600 text-xs py-4 px-1 font-mono">
          No pending autonomous patches found in database.
        </div>
      )}

      {Array.isArray(patches) && patches.map((patch) => {
        if (!patch) return null;
        return (
          <div key={patch.id || Math.random()} className="w-full bg-black/80 border border-cyan-900/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            
            <div className="bg-[#090d16] border-b border-cyan-900/40 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-cyan-400 font-mono w-full sm:w-auto overflow-hidden">
                <Terminal size={14} className="text-cyan-400 shrink-0" />
                <span className="truncate">remediation_agent.sh // ID: {patch.id?.substring(0, 8)}...</span>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded shrink-0">
                {patch.status || 'Ready to Push'}
              </span>
            </div>
            
            <div className="p-3 sm:p-6 space-y-4">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]" />
                <p className="text-[11px] sm:text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
                  {patch.patch_description || patch.path_description || 'Autonomous patch generated for system optimization.'}
                </p>
              </div>
              
              <div className="bg-[#02060f] p-3 sm:p-4 rounded-lg border border-cyan-950 overflow-x-auto shadow-inner max-w-full">
                <pre className="text-[10px] sm:text-xs text-cyan-300 font-mono leading-relaxed whitespace-pre">
                  <code>{patch.code_snippet || '// No code snippet provided'}</code>
                </pre>
              </div>

              <div className="flex justify-end pt-2 w-full">
                <button 
                  onClick={() => handleDeploy(patch.id)}
                  disabled={deployingId === patch.id}
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-4 sm:px-5 py-2.5 rounded-lg text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
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
        );
      })}
    </div>
  );
}