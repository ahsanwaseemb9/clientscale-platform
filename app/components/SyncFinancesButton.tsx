'use client';

import { useState } from 'react';

export default function SyncFinancesButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setMessage('Syncing with Stripe...');

    try {
      const response = await fetch('/api/sync-finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: '00000000-0000-0000-0000-000000000000' })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Success! AOV is $${data.metrics?.averageOrderValue}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to connect to sync endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <button 
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Syncing...' : 'Sync Financial Baseline'}
      </button>
      
      {message && <p className="text-sm text-gray-300">{message}</p>}
    </div>
  );
}