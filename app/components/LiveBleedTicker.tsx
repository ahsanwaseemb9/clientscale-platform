'use client';

export default function LiveBleedTicker({ events }: { events: any[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="flex items-center gap-3 bg-gray-950/30 border border-gray-800 p-4 rounded-lg font-mono w-fit mt-4">
        <span className="text-gray-500 text-xs tracking-[0.2em] uppercase font-semibold">
          Awaiting Live Telemetry...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-red-950/30 border border-red-500/20 p-4 rounded-lg font-mono w-fit mt-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 animate-pulse"></span>
        </div>
        <span className="text-red-400/80 text-xs tracking-[0.2em] uppercase font-semibold">
          Live Friction Stream
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {events.map((event, idx) => (
          <div key={event.id || idx} className="flex justify-between items-center gap-8 text-sm bg-black/40 px-3 py-2 rounded border border-red-900/50">
            <span className="text-orange-400 uppercase font-bold text-[10px] tracking-wider">
              {(event.friction_type || 'rage_click').replace('_', ' ')}
            </span>
            <span className="text-red-200/90 text-xs tabular-nums">
              Element: {event.friction_element_id || 'button#checkout-mobile'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}