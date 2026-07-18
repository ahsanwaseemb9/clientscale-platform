export default function BusinessCard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-zinc-200 py-12 antialiased">
      
      <div className="text-zinc-600 text-sm font-mono mb-4 text-center">
        Business Card Renderer (Light Mode) <br/>
        <span className="text-xs">Resolution: 1050px x 600px (Standard 3.5" x 2" ratio)</span>
      </div>

      {/* FRONT OF CARD */}
      <div className="relative w-[1050px] h-[600px] bg-white shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle light grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f4f4f5_2px,transparent_2px),linear-gradient(to_bottom,#f4f4f5_2px,transparent_2px)] bg-[size:4rem_4rem] opacity-70 pointer-events-none z-0" />
        
        <div className="z-10 flex flex-col items-center text-center">
          <h1 className="text-6xl font-bold tracking-[0.15em] text-zinc-900 uppercase mb-6">
            Client Scale Systems
          </h1>
          <h2 className="text-2xl font-mono text-cyan-600 tracking-wider mb-8 font-semibold">
            Client Growth Platform & Automated Maintenance Engine
          </h2>
          <div className="text-zinc-500 font-mono text-lg tracking-widest uppercase leading-relaxed font-bold">
            Designed exclusively for high-end fitness clubs, <br />
            gyms and wellness collectives.
          </div>
        </div>
      </div>

      {/* BACK OF CARD */}
      <div className="relative w-[1050px] h-[600px] bg-white shadow-2xl flex flex-col justify-between p-16 overflow-hidden">
        
        {/* Top: The Hook */}
        <div className="w-full text-center z-10 mt-2">
          {/* Changed font-medium to font-bold for better visibility */}
          <p className="text-zinc-800 text-2xl italic tracking-wide font-bold">
            Scan to audit your gym's conversion leakage and system latency.
          </p>
        </div>

        {/* Center: Real Generated QR Code */}
        <div className="flex-grow flex items-center justify-center z-10 mt-4 mb-4">
          <div className="p-2 border-2 border-zinc-100 rounded-xl">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://clientscale.io&margin=0" 
              alt="Client Scale QR Code"
              className="w-56 h-56"
            />
          </div>
        </div>

        {/* Bottom: Contact Info */}
        <div className="w-full flex flex-col z-10 border-t-2 border-zinc-100 pt-6">
          <h3 className="text-3xl font-bold text-zinc-900 uppercase tracking-wider">
            Ahsan Waseem
          </h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-zinc-500 text-xl font-medium">
              Lead Systems Architect
            </p>
            <p className="text-cyan-600 font-mono text-xl tracking-wider font-semibold">
              ahsan@clientscale.io
            </p>
          </div>
        </div>
        
      </div>
    </main>
  );
}