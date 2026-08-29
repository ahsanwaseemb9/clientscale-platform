// app/api/ai/executive-briefing/route.ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, projectedQuarterlyLeakage, dailyLeakage, primaryFriction } = body;

    const systemPrompt = `
      You are a ruthless, top-tier financial analyst reporting directly to a CEO. 
      Your job is to translate technical website friction into a financial reality.
      
      Write exactly 4 sentences. Be direct, professional, and objective. 
      Do NOT use filler words, AI jargon, or say things like "In today's digital landscape."
      
      Use this exact data:
      - Business: ${businessName}
      - Primary technical issue: ${primaryFriction}
      - Daily Defensible Bleed: £${dailyLeakage}
      - Projected 90-Day Quarterly Leakage: £${projectedQuarterlyLeakage}
      
      Structure:
      1. Identify the technical issue happening to users.
      2. State the immediate daily financial impact.
      3. Project the structural 90-day quarterly revenue bleed.
      4. End with a concluding sentence on why this requires immediate technical resolution.
    `;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: systemPrompt,
    });

    return NextResponse.json({ success: true, briefing: text });

  } catch (error: any) {
    console.error('[AI Briefing Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}