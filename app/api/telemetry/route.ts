// app/api/telemetry/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, session_id, element, timestamp, tenant_domain } = body;

    if (!tenant_domain) {
      return NextResponse.json({ success: false, error: 'Missing tenant domain' }, { status: 400 });
    }

    // 1. Try to find the tenant in the database
    let { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id')
      .eq('domain', tenant_domain)
      .single();

    // 2. DYNAMIC FALLBACK / JIT PROVISIONING: 
    // If the domain doesn't exist yet, automatically create it on the fly!
    if (tenantError || !tenant) {
      const { data: newTenant, error: createError } = await supabase
        .from('tenants')
        .insert({
          domain: tenant_domain,
          business_name: tenant_domain === 'localhost:3000' ? 'Local Development' : `Auto-Discovered (${tenant_domain})`,
          business_type: 'agency_portfolio'
        })
        .select('id')
        .single();

      if (createError) {
        console.error('[Telemetry Error] Failed to auto-provision domain:', createError.message);
        return NextResponse.json({ success: false, error: 'Failed to register domain' }, { status: 500 });
      }
      
      tenant = newTenant;
    }

    // 3. Insert the friction event tied to the dynamically resolved tenant
    const { error: dbError } = await supabase
      .from('session_telemetry')
      .insert({
        tenant_id: tenant.id,
        session_id: session_id || 'unknown_session',
        friction_type: event || 'rage_click',
        recovered: false,
        created_at: timestamp || new Date().toISOString()
      });

    if (dbError) {
      console.error('[Telemetry Insert Error]:', dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, logged: { event, session_id, tenant_id: tenant.id } });

  } catch (error: any) {
    console.error('[Telemetry API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}