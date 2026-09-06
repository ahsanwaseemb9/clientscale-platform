// app/api/ai/heal/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai'; // or use the Anthropic SDK if you prefer Claude

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { telemetry_id } = await req.json();

    // 1. Fetch the exact friction event from your database
    const { data: telemetry, error: fetchError } = await supabase
      .from('session_telemetry')
      .select('*')
      .eq('id', telemetry_id)
      .single();

    if (fetchError || !telemetry) {
      return NextResponse.json({ error: 'Telemetry event not found' }, { status: 404 });
    }

    // 2. Dynamically construct the prompt based on the type of failure
    const systemPrompt = `You are an elite Next.js performance engineer. Your job is to output precise, drop-in code fixes for recorded user friction. Return ONLY valid JSON with two keys: 'description' (a 1-sentence explanation) and 'code_patch' (the actual TypeScript/React code block).`;
    
    let userMessage = "";
    if (telemetry.friction_type === 'rage_click') {
      userMessage = `A user rage-clicked the element '${telemetry.friction_element_id}' ${telemetry.rage_clicks} times on the page '${telemetry.page_url}'. This usually indicates a broken onClick handler, a missing loading state, or an unclickable z-index overlap. Generate the React/Tailwind code to fix this specific element, adding a proper disabled state, loading spinner, and ARIA attributes.`;
    } else {
      userMessage = `The API endpoint '${telemetry.api_endpoint}' experienced a severe latency spike of ${telemetry.latency_ms}ms. Generate a Next.js Edge API route or a caching implementation (e.g., unstable_cache or Redis) to mitigate this bottleneck and guarantee sub-200ms response times.`;
    }

    // 3. Generate the code patch
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // gpt-4o is also excellent here
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');

    // 4. (Optional but recommended) Save the generated patch to a new Supabase table
    const { error: insertError } = await supabase
      .from('autonomous_patches')
      .insert({
        tenant_id: telemetry.tenant_id,
        telemetry_id: telemetry.id,
        patch_description: aiResponse.description,
        code_snippet: aiResponse.code_patch,
        status: 'pending_approval'
      });

    if (insertError) console.error('[Patch DB Insert Error]:', insertError.message);

    // 5. Update the original telemetry event so we know it has been addressed
    await supabase
      .from('session_telemetry')
      .update({ recovered: true })
      .eq('id', telemetry_id);

    return NextResponse.json({ success: true, patch: aiResponse });

  } catch (error: any) {
    console.error('[Auto-Heal Orchestration Error]:', error.message);
    return NextResponse.json({ error: 'Failed to generate code patch' }, { status: 500 });
  }
}