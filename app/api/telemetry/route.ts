import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, session_id, element, timestamp } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from('session_telemetry')
      .insert({
        tenant_id: '00000000-0000-0000-0000-000000000000', // Default active tenant
        session_id: session_id || 'unknown_session',
        friction_type: event || 'rage_click',
        recovered: false,
        created_at: timestamp || new Date().toISOString()
      });

    if (dbError) {
      console.error('[Telemetry Insert Error]:', dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, logged: { event, session_id, element } });

  } catch (error: any) {
    console.error('[Telemetry API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}