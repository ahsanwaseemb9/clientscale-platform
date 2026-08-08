import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import * as cheerio from 'cheerio';

// 1. OVERRIDE SERVERLESS TIMEOUT LIMITS (Set to 60 seconds)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// @ts-ignore
import { Wappalyzer, technologies, categories } from 'wapalyzer-core';
import { auditDomainSecurity } from '../../lib/audit/dns';
import { auditHtmlMetadata } from '../../lib/audit/html';

Wappalyzer.setTechnologies(technologies);
Wappalyzer.setCategories(categories);

// --- AI SCHEMA DEFINITION ---
const industryContextSchema = z.object({
  action: z.string().describe("The core business action. E.g., 'users can complete their checkout' or 'prospects can book a consultation'. STRICT RULE: Do NOT include 'draining conversions before' or 'before'. Provide only the standalone action."),
  shortAction: z.string().describe("e.g., 'request a quote' or 'complete a booking'"),
  scale: z.string().describe("e.g., 'freight and logistics portal' or 'e-commerce infrastructure'"),
  penalty: z.string().describe("e.g., 'commercial transport search rankings'"),
  userType: z.string().describe("e.g., 'commercial shippers' or 'retail customers'"),
  buttons: z.string().describe("e.g., 'quote request forms' or 'checkout buttons'"),
  brandVibe: z.string().describe("e.g., 'Boutique Law Firm', 'Public Transit Network', 'High-End E-Commerce', 'B2B Logistics Portal'"),
  executiveSynthesis: z.string().describe("A 4-sentence consultative executive briefing. MUST reference specific metrics provided and explain the physical user experience (friction or seamlessness).")
});

function detectNextJs(html: string, headers: Record<string, string[]>) {
  const hasHeader = headers['x-powered-by']?.some(h => h.includes('Next.js'));
  const hasNextPath = html.includes('/_next/static/');
  const hasNextData = html.includes('__NEXT_DATA__');
  
  return (hasHeader || hasNextPath || hasNextData) 
    ? { name: "Next.js", description: "React framework for production", categories: ["Web Frameworks"] } 
    : null;
}

function calculateLeakageRisk(inpString: string, tbtString: string, altCompliance: number, securityRisk: string, scriptCount: number) {
  let riskScore = 0;
  const leakageFactors = [];

  const inpMatch = String(inpString).match(/\d+/);
  const tbtMatch = String(tbtString).match(/\d+/);
  
  if (inpMatch && inpString !== 'N/A') {
    const inp = parseInt(inpMatch[0], 10);
    if (inp > 500) { riskScore += 40; leakageFactors.push("Severe interaction delay (INP >500ms)"); } 
    else if (inp > 200) { riskScore += 25; leakageFactors.push("Noticeable input lag (INP >200ms)"); }
  } else if (tbtMatch && tbtString !== 'N/A') {
    const tbt = parseInt(tbtMatch[0], 10);
    if (tbt > 600) { riskScore += 30; leakageFactors.push("High main-thread blocking"); } 
    else if (tbt > 200) { riskScore += 15; leakageFactors.push("Moderate thread blocking"); }
  }

  if (altCompliance < 100) {
    const penalty = Math.min(20, Math.round((100 - altCompliance) * 0.4));
    riskScore += penalty;
    if (penalty >= 10) leakageFactors.push("Significant accessibility barriers");
  }

  if (securityRisk === 'HIGH') {
    riskScore += 25;
    leakageFactors.push("Email deliverability risk (Missing SPF/DMARC)");
  }

  if (scriptCount > 5) {
    const penalty = Math.min(15, Math.round(scriptCount * 1.5));
    riskScore += penalty;
    if (penalty >= 10) leakageFactors.push("Excessive third-party script bloat");
  }

  riskScore = Math.min(100, riskScore);
  
  let riskTier = "OPTIMIZED";
  if (riskScore >= 75) riskTier = "CRITICAL";
  else if (riskScore >= 50) riskTier = "HIGH";
  else if (riskScore >= 25) riskTier = "MODERATE";

  return { riskScore, riskTier, leakageFactors };
}

const fetchWithTimeout = async (promise: Promise<any>, ms: number, fallbackValue: any, serviceName: string) => {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => { reject(new Error("Timeout after " + ms + "ms")); }, ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId!);
    console.warn("[Timeout/Error Caught in " + serviceName + "]:", error.message);
    return fallbackValue;
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  const targetUrl = rawUrl.startsWith('http') ? rawUrl : "https://" + rawUrl;
  const hostname = new URL(targetUrl).hostname;
  const brandName = hostname.replace(/^www\./, '').split('.')[0];

  try {
    let targetResponse;
    try {
      targetResponse = await fetch(targetUrl, { headers: { 'User-Agent': 'ClientScale-Forensic-Engine/1.0' } });
    } catch (e) {
      return NextResponse.json({ error: 'Target domain firewalls blocked diagnostic sweep.' }, { status: 502 });
    }

    const dnsResult = await auditDomainSecurity(hostname);
    const htmlText = await targetResponse.text() || '';
    const serverHeaders: Record<string, string[]> = {};
    targetResponse.headers.forEach((value, key) => { serverHeaders[key] = [value]; });

    const googleApiKey = process.env.GOOGLE_PAGESPEED_API_KEY || "AIzaSyCUJORk1Q4OyTQZu-MeIEZXescMJYuxa_k";
    const pageSpeedUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" + encodeURIComponent(targetUrl) + "&strategy=mobile&key=" + googleApiKey;
    
    // --- STAGE 1: PARALLEL DATA EXTRACTION ---
    const [techDetections, pageSpeedRes] = await Promise.all([
      fetchWithTimeout(
        Wappalyzer.analyze({ url: targetUrl, headers: serverHeaders, html: htmlText, meta: {}, scriptSrc: [] }),
        20000, 
        [],
        "Wappalyzer"
      ),
      fetchWithTimeout(
        fetch(pageSpeedUrl).then(async (res) => {
          if (!res.ok) {
            console.error("PageSpeed HTTP Error: " + res.status + " " + res.statusText);
            return null;
          }
          const data = await res.json();
          if (data.error) {
            console.error("PageSpeed API Internal Error:", data.error);
            return null;
          }
          return data;
        }),
        25000,
        null,
        "Google PageSpeed"
      )
    ]);

    // --- STAGE 2: PARSE THE METRICS (So we can feed them to the AI) ---
    const htmlAudit = auditHtmlMetadata(htmlText);
    const lighthouse = pageSpeedRes?.lighthouseResult || null;

    // Strip all empty spaces out of Google's pre-formatted string (e.g., "250 ms" -> "250ms")
    const rawTbtValue = lighthouse?.audits?.['total-blocking-time']?.displayValue || 'N/A';
    const tbtValue = rawTbtValue.replace(/\s+/g, '');

    // Remove the hardcoded space in the manual concatenation
    const inpValue = pageSpeedRes?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile 
      ? pageSpeedRes.loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile + "ms" 
      : 'N/A';
    
    const perfScore = lighthouse?.categories?.performance?.score ? Math.round(lighthouse.categories.performance.score * 100) : 50;
    const revenueLeakagePercent = Math.max(0, (100 - perfScore) * 0.15).toFixed(1);
    const thirdPartyCount = htmlAudit.thirdPartyScriptCount || 0;

    const leakageData = calculateLeakageRisk(
      inpValue, tbtValue, htmlAudit.accessibility.altComplianceScore, dnsResult.riskLevel, htmlAudit.thirdPartyScriptCount
    );

    // --- LOGIC GATE: IS THIS A PERFECT WEBSITE? ---
    const isOptimized = parseFloat(revenueLeakagePercent) <= 0;

    // --- STAGE 3: SEQUENTIAL AI AGENT (Now armed with actual data & conditional tone) ---
    const aiAnalysis = await fetchWithTimeout(
      (async () => {
        if (!process.env.OPENAI_API_KEY) return null;
        
        const $ = cheerio.load(htmlText);
        
        // Phase 1: Brand Soul Extraction
        const pageTitle = $('title').text().trim();
        const primaryH1 = $('h1').first().text().replace(/\s+/g, ' ').trim();
        const heroText = $('header, main, section').first().text().replace(/\s+/g, ' ').substring(0, 800);

        // CONDITIONAL AGENT A: The Writer (Generates Initial Draft based on score)
        const draftPrompt = isOptimized 
          ? `You are an elite Enterprise Infrastructure Consultant validating the pristine architecture of ${brandName} (${targetUrl}).
          
BRAND CONTEXT:
Title: ${pageTitle || 'N/A'}
H1: ${primaryH1 || 'N/A'}
About: ${heroText || 'N/A'}

PERFORMANCE METRICS WE JUST EXTRACTED:
- Mobile Render Latency (INP): ${inpValue}
- Main Thread Lock (TBT): ${tbtValue}
- Estimated Revenue Leakage: ${revenueLeakagePercent}%
- Parasite Load: ${thirdPartyCount} external trackers

TASK: Write a 4-sentence executive synthesis using the following structure:
Sentence 1 (Identity): State exactly what their specific business does and who their specific users are.
Sentence 2 (Operational): Praise the exceptionally clean ${tbtValue} 'thread lock', noting that their website's processor remains undistracted by background scripts exactly when the user tries to take action.
Sentence 3 (Psychological): Explain the user's physical reality—the screen reacts instantly to taps, creating a seamless, frictionless digital experience that builds immediate trust.
Sentence 4 (Financial): State the financial reality—this highly optimized infrastructure results in an estimated ${revenueLeakagePercent}% revenue leakage from latency, ensuring maximum conversion retention and a distinct edge over slower competitors.`

          : `You are an elite Enterprise Infrastructure Consultant advising the CEO of ${brandName} (${targetUrl}).
          
BRAND CONTEXT:
Title: ${pageTitle || 'N/A'}
H1: ${primaryH1 || 'N/A'}
About: ${heroText || 'N/A'}

PERFORMANCE METRICS WE JUST EXTRACTED:
- Mobile Render Latency (INP): ${inpValue}
- Main Thread Lock (TBT): ${tbtValue}
- Estimated Revenue Leakage: ${revenueLeakagePercent}%
- Parasite Load: ${thirdPartyCount} external trackers

TASK: Write a 4-sentence executive synthesis using the following structure:
Sentence 1 (Identity): State exactly what their specific business does and who their specific users are.
Sentence 2 (Operational): Explain the ${tbtValue} 'thread lock' as a hijacked system—the website's processor is too distracted by ${thirdPartyCount} background tracking scripts exactly when the user tries to take action.
Sentence 3 (Psychological): Explain the user's physical reality—the screen appears loaded but suffers from digital paralysis, completely ignoring the user's taps and making the experience feel broken.
Sentence 4 (Financial): State the financial reality—this invisible micro-delay breaks the customer's buying momentum, quietly driving an estimated ${revenueLeakagePercent}% revenue leakage to faster competitors.`;

        const draftResponse = await generateObject({
          model: openai('gpt-4o-mini'), 
          temperature: 0.2,
          schema: z.object({
            draftSynthesis: z.string()
          }),
          prompt: draftPrompt
        });

        // CONDITIONAL AGENT B: The Critic (Enforces Guardrails & Finalizes Object)
        const criticPrompt = isOptimized
          ? `You are a ruthless editor for an elite consulting firm. 
Review this draft executive synthesis: "${draftResponse.object.draftSynthesis}"

TASK:
1. Extract the required business terminology fields based on the brand context (${brandName}).
2. Finalize the 'executiveSynthesis' using the draft as a base. 

CRITICAL CONSTRAINTS FOR REWRITE:
- You MUST reference their specific industry and specific user type in the first sentence.
- You MUST include the actual performance numbers (e.g., ${tbtValue}, ${revenueLeakagePercent}%).
- You MUST explicitly explain how the lack of latency benefits the physical user experience using terms like "instant response", "frictionless", or "seamless trust".
- Eradicate ANY developer jargon (e.g., remove "DOM", "JavaScript", "CPU", "Core Web Vitals", "main thread"). 
- Eradicate ANY cheesy SaaS slogans. 
- Ensure the tone is clinical, authoritative, and highly complimentary of their pristine digital architecture.`

          : `You are a ruthless editor for an elite consulting firm. 
Review this draft executive synthesis: "${draftResponse.object.draftSynthesis}"

TASK:
1. Extract the required business terminology fields based on the brand context (${brandName}).
2. Finalize the 'executiveSynthesis' using the draft as a base. 

CRITICAL CONSTRAINTS FOR REWRITE:
- You MUST reference their specific industry and specific user type in the first sentence.
- You MUST include the actual performance numbers (e.g., ${tbtValue}, ${revenueLeakagePercent}%).
- You MUST explicitly explain what the latency physically does to the user using business terms like "digital paralysis", "ignored taps", or "distracted background scripts".
- Eradicate ANY developer jargon (e.g., remove "DOM", "JavaScript", "CPU", "Core Web Vitals", "main thread"). 
- Eradicate ANY cheesy SaaS slogans. 
- Ensure the tone is clinical, authoritative, and accurately terrifying regarding the lost revenue.`;

        const finalResponse = await generateObject({
          model: openai('gpt-4o-mini'), 
          temperature: 0.1, 
          schema: industryContextSchema,
          prompt: criticPrompt
        });

        return finalResponse.object;
      })(),
      18000, // 18s timeout for deep agent generation
      null,
      "OpenAI Agentic Synthesis"
    );

    let cleanInfrastructure = Array.isArray(techDetections)
      ? techDetections.map((item: any) => ({
          name: (item.technology || item).name || 'Unknown',
          description: (item.technology || item).description || 'No description.',
          categories: (item.technology || item).categories || []
        }))
      : [];

    const nextJsMatch = detectNextJs(htmlText, serverHeaders);
    if (nextJsMatch && !cleanInfrastructure.find((t: any) => t.name === "Next.js")) cleanInfrastructure.push(nextJsMatch);

    const unifiedPayload = {
      target: targetUrl,
      status: 'success',
      timestamp: new Date().toISOString(),
      industryContext: aiAnalysis, // <-- Injected AI Output (Now scrubbed by the Critic Agent)
      security: dnsResult,
      metaAndSocial: htmlAudit.socialPreview,
      accessibility: htmlAudit.accessibility,
      diagnostics: {
        performanceScore: perfScore, 
        latency: { tbt: tbtValue, inp: inpValue },
        thirdPartyScriptCount: thirdPartyCount,
      },
      infrastructure: cleanInfrastructure,
      conversionFunnel: {
        leakageRiskScore: leakageData.riskScore,
        severityTier: leakageData.riskTier,
        primaryLeakagePoints: leakageData.leakageFactors
      }
    };

    return NextResponse.json(unifiedPayload, { status: 200 });

  } catch (error: any) {
    console.error('Diagnostic Error:', error.message);
    return NextResponse.json({ error: 'Sweep failed' }, { status: 500 });
  }
}