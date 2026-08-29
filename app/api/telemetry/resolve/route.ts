// app/api/telemetry/resolve/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ success: false, error: 'Missing session_id' }, { status: 400 });
    }

    // Update all telemetry logs for this session to mark them as recovered!
    const { error: updateError } = await supabase
      .from('session_telemetry')
      .update({ recovered: true })
      .eq('session_id', session_id)
      .eq('recovered', false); // Only update unrecovered friction

    if (updateError) {
      console.error('[Recovery Error]:', updateError);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Session friction successfully recovered.' });

  } catch (error: any) {
    console.error('[Recovery API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}