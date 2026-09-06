'use client';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-8">
      {/* 1. Inject the Pixel */}
      <script src="/pixel.js" data-tenant-id="test-tenant-123" async></script>

      <h1 className="text-2xl font-bold">ClientScale Pixel Test Environment</h1>
      
      {/* 2. The Broken Button */}
      <button 
        id="checkout-mobile" 
        className="px-8 py-4 bg-orange-600 rounded-lg font-bold"
        onClick={() => console.log('Button clicked, doing nothing...')}
      >
        Complete Purchase
      </button>

      {/* 3. The Slow API Trigger */}
      <button 
        className="px-8 py-4 bg-purple-600 rounded-lg font-bold"
        onClick={() => {
          // Simulating a 1205ms latency bottleneck
          setTimeout(() => fetch('/api/dummy-endpoint'), 1205);
        }}
      >
        Trigger API Latency
      </button>
    </div>
  );
}