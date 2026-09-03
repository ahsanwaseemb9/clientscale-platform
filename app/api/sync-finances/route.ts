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

    // 1. Parse the request payload
    const body = await request.json().catch(() => ({}));
    const { tenantId, domain, url, businessName, isSynthetic } = body;
    
    // --- PATH 2: SYNTHETIC BASELINE HOOK (PRE-SALES) ---
    // If a URL is passed directly, we generate a synthetic financial baseline to hook the prospect.
    if (url || isSynthetic) {
      const syntheticDailySessions = 200;
      const estimatedAOV = 50;
      
      // £1,500/day lost to 15% friction drop-off
      const syntheticDailyLeakage = syntheticDailySessions * 0.15 * estimatedAOV; 
      
      // £135,000 lost per quarter
      const syntheticQuarterlyLeakage = syntheticDailyLeakage * 90; 

      // FIX: Use a valid UUID format for the demo record to satisfy Postgres strict typing
      const targetId = '00000000-0000-0000-0000-000000000000';

      const { error: syntheticError } = await supabase
        .from('tenant_financials')
        .upsert({
          tenant_id: targetId,
          business_name: businessName || 'New Prospect Target',
          defensible_daily_leakage: syntheticDailyLeakage,
          projected_quarterly_leakage: syntheticQuarterlyLeakage,
          updated_at: new Date().toISOString(),
          // Adding fake friction data so the boardroom UI populates instantly
          friction_element_id: 'button#checkout-mobile',
          rage_clicks: 42,
          api_endpoint: '/api/cart/sync',
          latency_ms: 1205
        }, { onConflict: 'tenant_id' });

      if (syntheticError) {
        console.error('[Synthetic Upsert Error]:', syntheticError);
        throw syntheticError;
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Synthetic baseline synchronized.',
        isSynthetic: true 
      });
    }

    // --- ORIGINAL PATH: REAL TELEMETRY SYNC (STRIPE/SHOPIFY) ---
    if (!tenantId && !domain) {
       return NextResponse.json({ success: false, error: 'tenantId, domain, or url is required' }, { status: 400 });
    }

    // Fetch Tenant Configuration
    let query = supabase.from('tenants').select('id, active_provider, integration_config');

    if (tenantId && tenantId !== '00000000-0000-0000-0000-000000000000') {
      query = query.eq('id', tenantId);
    } else if (domain) {
      query = query.eq('domain', domain);
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data: tenant, error: tenantError } = await query.single();

    if (tenantError || !tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found or missing configuration' }, { status: 404 });
    }

    const resolvedTenantId = tenant.id;
    let financialMetrics;

    // Route to the correct platform adapter dynamically
    switch (tenant.active_provider) {
      case 'stripe':
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

    // Upsert normalized real data to the unified database schema
    const { error: dbError } = await supabase
      .from('tenant_financials')
      .upsert({
        tenant_id: resolvedTenantId,
        provider: financialMetrics.provider,
        average_order_value: financialMetrics.average_order_value,
        total_revenue: financialMetrics.total_revenue,
        total_orders_analyzed: financialMetrics.total_orders_analyzed,
        currency: financialMetrics.currency,
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id' });

    if (dbError) throw dbError;

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