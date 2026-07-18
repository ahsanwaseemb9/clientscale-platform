'use client';

import { handleAuditSubmit } from '../actions';

export default function AuditForm() {
  return (
    // We use a form here, but it is explicitly told NOT to validate
    <form action={handleAuditSubmit} noValidate className="w-full flex flex-col items-center space-y-5">
      <div className="relative flex items-center w-full bg-[#07070f]/90 border border-zinc-800 rounded-xl p-2">
        <input 
          type="text" 
          name="url" 
          required 
          placeholder="Enter your gym website (e.g. google.com)" 
          className="w-full bg-transparent py-3 px-2 text-zinc-100 focus:outline-none" 
        />
      </div>
      <button 
        type="submit" 
        className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-zinc-300 font-semibold px-8 py-4 rounded-xl"
      >
        Audit Conversion Leakage
      </button>
    </form>
  );
}