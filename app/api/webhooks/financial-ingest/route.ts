// app/api/webhooks/financial-ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Read the payload once
    const payload = await req.json();

    // ==============================================================
    // 1. STRIPE WEBHOOK HANDLER (Catching the Live Revenue Bleed)
    // ==============================================================
    if (payload.object === 'event' && payload.type) {
      const event = payload;

      // We specifically want to catch failed payments to prove the financial threat
      if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        
        // When deploying to a client, ensure 'tenant_id' is passed in their Stripe metadata
        const tenant_id = paymentIntent.metadata?.tenant_id; 
        
        if (tenant_id) {
          const lostRevenue = paymentIntent.amount / 100;
          
          // Log the exact financial bleed event into a telemetry table
          const { error: bleedError } = await supabase
            .from('financial_bleed_events')
            .insert({
              tenant_id,
              source: 'stripe',
              event_type: 'payment_failed',
              amount_lost: lostRevenue,
              reason: paymentIntent.last_payment_error?.message || 'Card declined',
              created_at: new Date().toISOString()
            });

          if (bleedError) console.error('[Stripe Ingest Error]:', bleedError);
        }
      }
      
      // Always return 200 to Stripe quickly so they don't retry the webhook
      return NextResponse.json({ success: true, message: 'Stripe event acknowledged' });
    }

    // ==============================================================
    // 2. CUSTOM PROVIDER HANDLER (Your Existing Baseline Logic)
    // ==============================================================
    const { tenant_id, webhook_secret, total_revenue, average_order_value } = payload;

    if (!tenant_id || !webhook_secret) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Security Check: Verify the client's webhook secret matches the database
    const { data: tenant } = await supabase
      .from('tenants')
      .select('integration_config, active_provider')
      .eq('id', tenant_id)
      .single();

    if (!tenant || tenant.active_provider !== 'custom') {
      return NextResponse.json({ error: 'Invalid tenant or provider configuration' }, { status: 400 });
    }

    if (tenant.integration_config?.webhookSecret !== webhook_secret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid webhook secret' }, { status: 401 });
    }

    // Write to the Unified Schema
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
    console.error('[Financial Ingest Exception]:', error.message);
    return NextResponse.json({ error: 'Internal server error processing payload' }, { status: 500 });
  }
}