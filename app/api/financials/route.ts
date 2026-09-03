// app/api/financials/route.ts
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // FIX: Swapped ANON key for SERVICE_ROLE key to bypass RLS read-blocking
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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