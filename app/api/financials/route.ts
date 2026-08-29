// app/api/financials/route.ts
export const dynamic = 'force-dynamic'; // <-- This kills the Next.js cache

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('tenant_financials')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, message: 'No financial data found yet.' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('[Database Fetch Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}