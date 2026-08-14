import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("[ClientScale Telemetry Caught]:", body);

    // Insert into 'session_telemetry' including the required tenant_id
    const { error } = await supabase
      .from('session_telemetry')
      .insert([
        {
          tenant_id: '00000000-0000-0000-0000-000000000000', // Default system tenant UUID
          session_id: body.session_id,
          friction_type: body.event || 'rage_click',
          recovered: false,
          created_at: body.timestamp || new Date().toISOString()
        }
      ]);

    if (error) {
      console.error("[Supabase Error]:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Telemetry API Error]:", error);
    return NextResponse.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
  }
}