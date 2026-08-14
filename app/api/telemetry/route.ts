import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the incoming event locally
    console.log("[ClientScale Telemetry Caught]:", body);

    // Insert the telemetry event into your Supabase table
    const { error } = await supabase
      .from('telemetry_events') // Replace with your actual Supabase table name if different
      .insert([
        {
          session_id: body.session_id,
          event_type: body.event,
          element_target: body.element || 'unknown',
          metadata: body,
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