// app/api/webhooks/financial-ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    // 1. Receive the payload pushed by the custom client
    const { tenant_id, webhook_secret, total_revenue, average_order_value } = await req.json();

    // 2. Security Check: Verify the client's webhook secret matches the database
    const { data: tenant } = await supabase
      .from('tenants')
      .select('integration_config, active_provider')
      .eq('id', tenant_id)
      .single();

    if (!tenant || tenant.active_provider !== 'custom') {
      return NextResponse.json({ error: 'Invalid tenant or provider' }, { status: 400 });
    }

    if (tenant.integration_config.webhookSecret !== webhook_secret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid webhook secret' }, { status: 401 });
    }

    // 3. Write to the Unified Schema (Same as Stripe/Shopify)
    const { error: dbError } = await supabase
      .from('tenant_financials')
      .upsert({
        tenant_id,
        provider: 'custom',
        average_order_value,
        total_revenue,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'tenant_id' });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, message: 'Custom financial baseline updated' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}