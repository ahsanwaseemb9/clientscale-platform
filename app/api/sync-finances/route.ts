import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ success: false, error: 'STRIPE_SECRET_KEY is missing in environment variables.' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { tenantId } = await request.json().catch(() => ({}));
    const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

    const charges = await stripe.charges.list({ limit: 100 });
    const successfulCharges = charges.data.filter(charge => charge.paid && !charge.refunded);

    if (successfulCharges.length === 0) {
      return NextResponse.json({ success: true, message: 'No successful charges found to calculate baseline.' });
    }

    const totalRevenueCents = successfulCharges.reduce((acc, charge) => acc + charge.amount, 0);
    const totalOrders = successfulCharges.length;
    const aov = (totalRevenueCents / totalOrders) / 100;

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
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}