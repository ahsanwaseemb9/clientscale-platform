// app/api/sync-finances/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchStripeFinancials } from '../../lib/audit/adapters/stripe';
// import { fetchShopifyFinancials } from '@/lib/adapters/shopify';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: 'Supabase environment variables are missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get the actual tenant context from the request
    const { tenantId } = await request.json().catch(() => ({}));
    
    if (!tenantId) {
       return NextResponse.json({ success: false, error: 'tenantId is required to sync finances' }, { status: 400 });
    }

    // 2. Fetch Tenant Configuration (The Switchboard)
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('active_provider, integration_config')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found or missing configuration' }, { status: 404 });
    }

    let financialMetrics;

    // 3. Route to the correct platform adapter dynamically
    switch (tenant.active_provider) {
      case 'stripe':
        // Passes the tenant's specific JSON configuration to the adapter
        financialMetrics = await fetchStripeFinancials(tenant.integration_config);
        break;
      case 'shopify':
        // financialMetrics = await fetchShopifyFinancials(tenant.integration_config);
        break;
      default:
        return NextResponse.json({ success: false, error: `Unsupported active provider: ${tenant.active_provider}` }, { status: 400 });
    }

    if (!financialMetrics) {
      return NextResponse.json({ success: false, error: 'Failed to compute financial metrics' }, { status: 500 });
    }

    // 4. Upsert the normalized data to the unified database schema
    const { error: dbError } = await supabase
      .from('tenant_financials')
      .upsert({
        tenant_id: tenantId,
        provider: financialMetrics.provider,
        average_order_value: financialMetrics.average_order_value,
        total_revenue: financialMetrics.total_revenue,
        // Optional tracking columns you included in your original file:
        total_orders_analyzed: financialMetrics.total_orders_analyzed,
        currency: financialMetrics.currency,
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id' });

    if (dbError) {
      console.error('[Supabase Upsert Error]:', dbError);
      return NextResponse.json({ success: false, error: `Supabase DB Error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      metrics: {
        provider: financialMetrics.provider,
        averageOrderValue: financialMetrics.average_order_value,
        totalOrdersAnalyzed: financialMetrics.total_orders_analyzed,
        currency: financialMetrics.currency
      }
    });

  } catch (error: any) {
    console.error('[API Catch Error Details]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}