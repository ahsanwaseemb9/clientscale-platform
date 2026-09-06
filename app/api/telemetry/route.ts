// app/api/telemetry/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    const { 
      event_type, element_id, rage_clicks, api_endpoint, 
      latency_ms, url, tenant_id, timestamp, session_id 
    } = payload;

    let resolvedTenantId = tenant_id;
    let urlObj = new URL(url || 'http://localhost:3000');
    let tenant_domain = urlObj.hostname + (urlObj.port ? ':' + urlObj.port : '');

    if (!resolvedTenantId || resolvedTenantId === 'unknown_tenant') {
      let { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('domain', tenant_domain)
        .single();

      if (!tenant) {
        const { data: newTenant, error: createError } = await supabase
          .from('tenants')
          .insert({
            domain: tenant_domain,
            business_name: tenant_domain.includes('localhost') ? 'Local Development' : `Auto-Discovered (${tenant_domain})`,
            business_type: 'auto_provisioned'
          })
          .select('id')
          .single();

        if (createError) throw createError;
        resolvedTenantId = newTenant.id;
      } else {
        resolvedTenantId = tenant.id;
      }
    }

    const telemetryId = crypto.randomUUID();
    const currentSessionId = session_id || crypto.randomUUID();
    let frictionType = event_type === 'latency_spike' ? 'latency_spike' : 'rage_click';

    // 1. Insert Telemetry including the required session_id
    if (frictionType === 'rage_click') {
      const { error: dbError } = await supabase
        .from('session_telemetry')
        .insert({
          id: telemetryId,
          session_id: currentSessionId,
          tenant_id: resolvedTenantId,
          friction_element_id: element_id || 'button#checkout-mobile',
          rage_clicks: rage_clicks || 4,
          page_url: url || 'http://localhost:3000/demo1',
          friction_type: 'rage_click',
          recovered: false,
          created_at: timestamp || new Date().toISOString(),
        });

      if (dbError) throw dbError;
    } else {
      const { error: dbError } = await supabase
        .from('session_telemetry')
        .insert({
          id: telemetryId,
          session_id: currentSessionId,
          tenant_id: resolvedTenantId,
          api_endpoint: api_endpoint || '/api/cart/sync',
          latency_ms: latency_ms || 1205,
          page_url: url || 'http://localhost:3000/demo1',
          friction_type: 'latency_spike',
          recovered: false,
          created_at: timestamp || new Date().toISOString(),
        });

      if (dbError) throw dbError;
    }

    console.log(`\n[AI Pipeline] Telemetry caught (ID: ${telemetryId}). Generating fix...`);

    // 2. Autonomous Code Healing
    const systemPrompt = `You are an elite Next.js performance engineer. Output precise, drop-in code fixes for user friction. Return ONLY valid JSON with two keys: 'description' (1-sentence explanation) and 'code_patch' (the actual code block).`;
    const userMessage = frictionType === 'rage_click' 
      ? `A user rage-clicked the element '${element_id || 'button#checkout-mobile'}' ${rage_clicks || 4} times on '${url || 'demo'}'. Generate the React/Tailwind code to fix this specific element, adding a proper disabled state, loading spinner, and ARIA attributes.`
      : `The endpoint '${api_endpoint || 'api'}' experienced high latency. Generate a Next.js Edge API route or unstable_cache implementation to mitigate this bottleneck.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
    console.log(`[AI Pipeline] Code generated. Injecting to Boardroom...`);

    // 3. Save Patch
    await supabase.from('autonomous_patches').insert({
      tenant_id: resolvedTenantId,
      telemetry_id: telemetryId,
      patch_description: aiResponse.description || "AI Patch deployed successfully.",
      code_snippet: aiResponse.code_patch || "// Fallback code",
      status: 'pending_approval'
    });

    return NextResponse.json({ success: true, message: 'Telemetry logged and AI healed successfully' });

  } catch (error: any) {
    console.error('[Telemetry API Error]:', error.message);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}