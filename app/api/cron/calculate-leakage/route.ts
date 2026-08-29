// app/api/cron/calculate-leakage/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { data: tenants, error: tenantError } = await supabase
      .from('tenants')
      .select('id, business_name');

    if (tenantError || !tenants) throw new Error(tenantError?.message);

    const aggregationResults = [];

    for (const tenant of tenants) {
      // 1. Get 24-hour unrecovered sessions
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: telemetryEvents, error: telemetryError } = await supabase
        .from('session_telemetry')
        .select('session_id')
        .eq('tenant_id', tenant.id)
        .eq('recovered', false)
        .gte('created_at', twentyFourHoursAgo);

      if (telemetryError) continue;

      const uniqueUnrecoveredSessions = new Set(telemetryEvents?.map(e => e.session_id)).size;

      // 2. Fetch live financial baselines
      const { data: financials } = await supabase
        .from('tenant_financials')
        .select('average_order_value, conversion_rate')
        .eq('tenant_id', tenant.id)
        .single();

      const aov = financials?.average_order_value || 100;
      const conversionRate = financials?.conversion_rate || 0.02;

      // 3.2 The Bulletproof Math
      const defensibleDailyLeakage = uniqueUnrecoveredSessions * conversionRate * aov;

      // 3.3 Extrapolation (90-Day Rolling Quarter)
      const projectedQuarterlyLeakage = defensibleDailyLeakage * 90;

      // 4. Save these calculations back to the database for the dashboard
      await supabase
        .from('tenant_financials')
        .upsert({
          tenant_id: tenant.id,
          defensible_daily_leakage: defensibleDailyLeakage,
          projected_quarterly_leakage: projectedQuarterlyLeakage,
          updated_at: new Date().toISOString()
        }, { onConflict: 'tenant_id' });

      aggregationResults.push({
        tenant_id: tenant.id,
        business_name: tenant.business_name,
        defensible_daily_leakage: defensibleDailyLeakage,
        projected_quarterly_leakage: projectedQuarterlyLeakage
      });
    }

    return NextResponse.json({
      success: true,
      step: '3.3 - Extrapolation & Database Save Complete',
      data: aggregationResults
    });

  } catch (error: any) {
    console.error('[Predictive Engine Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}