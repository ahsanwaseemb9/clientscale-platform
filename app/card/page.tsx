export default function BusinessCard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-zinc-200 py-12 antialiased">
      
      <div className="text-zinc-600 text-sm font-mono mb-4 text-center">
        Business Card Renderer (Light Mode - Enterprise) <br/>
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
          <h2 className="text-2xl font-mono text-cyan-600 tracking-wider font-semibold uppercase">
            Enterprise Pipeline Intelligence & Edge Infrastructure
          </h2>
        </div>
      </div>

      {/* BACK OF CARD */}
      <div className="relative w-[1050px] h-[600px] bg-white shadow-2xl flex flex-col justify-between p-16 overflow-hidden">
        
        {/* Top: The Hook & Core Competencies */}
        <div className="w-full text-center z-10 mt-2">
          <p className="text-zinc-900 text-3xl tracking-wide font-bold mb-4">
            We eliminate revenue leakage at the network edge.
          </p>
          <p className="text-zinc-500 font-mono text-lg tracking-widest uppercase font-bold">
            Digital Due Diligence <span className="text-cyan-600 mx-2">|</span> Latency Mitigation <span className="text-cyan-600 mx-2">|</span> AI Search Visibility
          </p>
        </div>

        {/* Center: Real Generated QR Code */}
        <div className="flex-grow flex flex-col items-center justify-center z-10 mt-6 mb-2">
          <div className="p-2 border-2 border-zinc-100 rounded-xl mb-3 bg-white shadow-sm">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://clientscale.io&margin=0" 
              alt="Client Scale QR Code"
              className="w-44 h-44"
            />
          </div>
          <p className="text-zinc-400 text-sm italic font-medium">
            Scan to initiate a forensic pipeline audit.
          </p>
        </div>

        {/* Bottom: Contact Info & CTA */}
        <div className="w-full flex justify-between items-end z-10 border-t-2 border-zinc-100 pt-6">
          
          {/* Left: Name and New Title */}
          <div>
            <h3 className="text-3xl font-bold text-zinc-900 uppercase tracking-wider">
              Ahsan Waseem
            </h3>
            <p className="text-zinc-500 text-xl font-medium mt-1">
              Managing Partner
            </p>
          </div>

          {/* Right: The Enterprise CTA */}
          <div className="text-right flex flex-col justify-end">
            <p className="text-zinc-500 text-sm font-medium mb-1 italic">
              Explore our full suite of enterprise capabilities at:
            </p>
            <p className="text-cyan-600 font-mono text-xl tracking-wider font-semibold">
              clientscale.io
            </p>
          </div>

        </div>
        
      </div>
    </main>
  );
}