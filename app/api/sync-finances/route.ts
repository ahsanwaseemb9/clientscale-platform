import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ success: false, error: 'STRIPE_SECRET_KEY is missing' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Supabase environment variables are missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { tenantId } = await request.json().catch(() => ({}));
    const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

    // 1. Fetch charges from Stripe
    let charges;
    try {
      charges = await stripe.charges.list({ limit: 100 });
    } catch (stripeErr: any) {
      console.error('[Stripe API Fetch Error]:', stripeErr);
      return NextResponse.json({ success: false, error: `Stripe Network Error: ${stripeErr.message}` }, { status: 500 });
    }

    const successfulCharges = charges.data.filter(charge => charge.paid && !charge.refunded);

    if (successfulCharges.length === 0) {
      return NextResponse.json({ success: true, message: 'No successful charges found to calculate baseline.' });
    }

    const totalRevenueCents = successfulCharges.reduce((acc, charge) => acc + charge.amount, 0);
    const totalOrders = successfulCharges.length;
    const aov = (totalRevenueCents / totalOrders) / 100;

    // 2. Persist to Supabase
    const { error: dbError } = await supabase
      .from('tenant_financials')
      .upsert({
        tenant_id: activeTenantId,
        average_order_value: aov,
        total_orders_analyzed: totalOrders,
        total_revenue_analyzed: totalRevenueCents / 100,
        currency: successfulCharges[0]?.currency?.toUpperCase() || 'USD',
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id' });

    if (dbError) {
      console.error('[Supabase Upsert Error]:', dbError);
      return NextResponse.json({ success: false, error: `Supabase DB Error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      metrics: {
        averageOrderValue: aov,
        totalOrdersAnalyzed: totalOrders,
        currency: successfulCharges[0]?.currency?.toUpperCase() || 'USD'
      }
    });

  } catch (error: any) {
    console.error('[API Catch Error Details]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}