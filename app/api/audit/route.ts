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
  executiveSynthesis: z.string().describe("A 4-sentence consultative executive briefing. MUST reference specific metrics provided and accurately reflect the performance reality (friction or seamlessness).")
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
      // FIX 3: Graceful Firewall Degradation. If WAF completely blocks the connection, return clean status.
      return NextResponse.json({ 
        error: 'Diagnostic restricted by target domain perimeter security.', 
        status: 'blocked' 
      }, { status: 502 });
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
        null, // Yields null if blocked by regional API firewall
        "Google PageSpeed"
      )
    ]);

    // --- STAGE 2: PARSE THE METRICS & BUILD SMART FALLBACKS ---
    const htmlAudit = auditHtmlMetadata(htmlText);
    const lighthouse = pageSpeedRes?.lighthouseResult || null;
    const thirdPartyCount = htmlAudit.thirdPartyScriptCount || 0;

    const rawTbtValue = lighthouse?.audits?.['total-blocking-time']?.displayValue || 'N/A';
    const tbtValue = rawTbtValue !== 'N/A' ? rawTbtValue.replace(/\s+/g, '') : 'N/A';

    const inpValue = pageSpeedRes?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile 
      ? pageSpeedRes.loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile + "ms" 
      : 'N/A';
    
    // FIX 1: Smart Heuristic Fallback (Removes the 7.5% hallucination)
    let perfScore;
    if (lighthouse?.categories?.performance?.score) {
      perfScore = Math.round(lighthouse.categories.performance.score * 100);
    } else {
      // If Google is blocked, deduct 3 points for every 3rd party script found locally
      perfScore = Math.max(10, 85 - (thirdPartyCount * 3));
    }
    const revenueLeakagePercent = Math.max(0, (100 - perfScore) * 0.15).toFixed(1);

    const leakageData = calculateLeakageRisk(
      inpValue, tbtValue, htmlAudit.accessibility.altComplianceScore, dnsResult.riskLevel, thirdPartyCount
    );

    // FIX 2: AI Guardrail Setup (Flag missing numerical data)
    const parsedTbt = parseInt(tbtValue.replace(/[^0-9]/g, ''));
    const tbtNum = isNaN(parsedTbt) ? -1 : parsedTbt; 
    const isDataMissing = tbtNum === -1; 

    // --- STAGE 3: INDUSTRY-ADAPTIVE SEQUENTIAL AI AGENT ---
    const aiAnalysis = await fetchWithTimeout(
      (async () => {
        if (!process.env.OPENAI_API_KEY) return null;
        
        const $ = cheerio.load(htmlText);
        
        // Phase 1: Brand Soul Extraction
        const pageTitle = $('title').text().trim();
        const primaryH1 = $('h1').first().text().replace(/\s+/g, ' ').trim();
        const heroText = $('header, main, section').first().text().replace(/\s+/g, ' ').substring(0, 800);

        // AGENT 0: THE PROFILER (Dynamically Classify Industry)
        const profilerResponse = await generateObject({
          model: openai('gpt-4o-mini'),
          temperature: 0.1,
          schema: z.object({
            industryCategory: z.enum(['ecommerce', 'b2b_service', 'transport_logistics', 'general'])
          }),
          prompt: `Analyze this business based on its metadata. Brand: ${brandName}. Title: ${pageTitle}. H1: ${primaryH1}. Context: ${heroText}. Classify their core industry model into one of the provided enums.`
        });

        const category = profilerResponse.object.industryCategory;

        // DYNAMIC ROUTER: Build Clean, Brand-Agnostic Analogies Based on Profiler
        let analogyInstructions = "";
        if (category === 'ecommerce') {
          analogyInstructions = "Focus strictly on cart abandonment, lost impulsive buying momentum, and impatient shoppers bouncing to faster digital-native competitors in the retail and e-commerce space.";
        } else if (category === 'b2b_service') {
          analogyInstructions = "Focus on brand prestige, loss of high-net-worth client trust, and missed consultation bookings due to a platform that feels unprofessional and broken.";
        } else if (category === 'transport_logistics') {
          analogyInstructions = "Focus on operational reliability, commuter/shipper frustration in the field on mobile devices, and the inability to access time-sensitive data.";
        } else {
          analogyInstructions = "Focus on user frustration, broken digital trust, and abandoned engagement moments to faster alternatives.";
        }

        // DYNAMIC ROUTER: Strict Numerical Tone Mapping (Includes Missing Data & 0 Script Fallbacks)
        let severityInstructions = "";
        if (isDataMissing) {
          severityInstructions = `TONE: Clinical and structural. Perimeter security blocked exact lab latency metrics. You MUST NOT mention any specific 'ms' latency or thread lock times. Instead, focus entirely on the risk of having ${thirdPartyCount} external trackers (parasite load) inherently causing digital paralysis and the estimated ${revenueLeakagePercent}% revenue leakage.`;
        } else if (tbtNum <= 50 && parseFloat(revenueLeakagePercent) <= 0.5) {
          severityInstructions = `TONE: High praise. Commend their pristine ${tbtValue} architecture, noting that the processor remains undistracted and responds instantly to user taps, creating seamless trust.`;
        } else if (tbtNum > 50 && tbtNum <= 300) {
          severityInstructions = `TONE: Firm warning. They have a growing vulnerability. The ${tbtValue} micro-delay is beginning to paralyze the screen and quietly bleed revenue.`;
        } else {
          if (thirdPartyCount > 0) {
            severityInstructions = `TONE: Emergency intervention. Sound the alarm. This is a severe, unacceptable level of digital paralysis (${tbtValue} thread lock) caused by ${thirdPartyCount} external background scripts freezing user interaction and driving severe revenue loss.`;
          } else {
            severityInstructions = `TONE: Emergency intervention. Sound the alarm. This is a severe, unacceptable level of digital paralysis (${tbtValue} thread lock) caused by their own heavy internal code architecture and first-party structural bloat freezing user interaction.`;
          }
        }

        // DYNAMIC ROUTER: Agent A Sentence 2 Logic Fork
        let sentence2Logic = "";
        if (isDataMissing) {
          sentence2Logic = `Address the structural bloat. Explain that while exact processor lock times are shielded by perimeter security, their heavy payload of ${thirdPartyCount} background tracking scripts is a known catalyst for processor distraction and digital paralysis.`;
        } else if (tbtNum > 50 && thirdPartyCount > 0) {
          sentence2Logic = `Address the exact performance reality. You MUST explain how the ${tbtValue} thread lock is choked by ${thirdPartyCount} external background scripts.`;
        } else if (tbtNum > 50 && thirdPartyCount === 0) {
          sentence2Logic = `Address the exact performance reality. You MUST explain that the ${tbtValue} thread lock is caused entirely by their own internal code architecture and heavy first-party structural bloat (since they have zero external trackers).`;
        } else {
          sentence2Logic = `Address the exact performance reality. Because their TBT is pristine (${tbtValue}), praise their highly optimized speed and efficient architecture.`;
        }

        // DYNAMIC ROUTER: Agent B Absolute Rule
        let absoluteRule = "";
        if (isDataMissing) {
          absoluteRule = `ABSOLUTE RULE: You are strictly forbidden from referencing specific 'ms' metrics or exact thread lock times because the data is 'N/A'. Focus entirely on the risk of the ${thirdPartyCount} scripts and the ${revenueLeakagePercent}% leakage.`;
        } else {
          absoluteRule = `ABSOLUTE RULE: If TBT is greater than 50ms, you are strictly forbidden from praising the site. Furthermore, if they have 0 external trackers, do not say the "absence of scripts" causes the issue—blame their internal code architecture. The tone MUST reflect critical friction, frozen screens, and revenue leakage.`;
        }

        // AGENT A: The Writer (Generates Initial Draft strictly anchored to numerical reality)
        const draftResponse = await generateObject({
          model: openai('gpt-4o-mini'), 
          temperature: 0.2,
          schema: z.object({
            draftSynthesis: z.string()
          }),
          prompt: `You are an elite Enterprise Infrastructure Consultant advising the CEO of ${brandName} (${targetUrl}).
          
BRAND CONTEXT:
Title: ${pageTitle || 'N/A'}
H1: ${primaryH1 || 'N/A'}
About: ${heroText || 'N/A'}

PERFORMANCE METRICS WE JUST EXTRACTED:
- Estimated Revenue Leakage: ${revenueLeakagePercent}%
- Parasite Load: ${thirdPartyCount} external trackers
${!isDataMissing ? `- Mobile Render Latency (INP): ${inpValue}\n- Main Thread Lock (TBT): ${tbtValue}` : ''}

DYNAMIC INSTRUCTIONS FOR THIS SPECIFIC CLIENT:
1. ${analogyInstructions}
2. ${severityInstructions}

TASK: Write a 4-sentence executive synthesis using the following strict structure:
Sentence 1 (Identity): State exactly what their specific business does and who their specific users are.
Sentence 2 (Operational): ${sentence2Logic}
Sentence 3 (Psychological): Explain the user's physical reality based on the metrics (either instant frictionless response OR screen paralysis ignoring user taps).
Sentence 4 (Financial): State the financial reality using the exact estimated ${revenueLeakagePercent}% revenue leakage metric.`
        });

        // AGENT B: The Critic (Enforces Guardrails & Finalizes Object)
        const finalResponse = await generateObject({
          model: openai('gpt-4o-mini'), 
          temperature: 0.1, 
          schema: industryContextSchema,
          prompt: `You are a ruthless editor for an elite consulting firm. 
Review this draft executive synthesis: "${draftResponse.object.draftSynthesis}"

TASK:
1. Extract the required business terminology fields based on the brand context (${brandName}).
2. Finalize the 'executiveSynthesis' using the draft as a base. 

DYNAMIC CONTEXT REMINDER:
- ${analogyInstructions}
- ${severityInstructions}

CRITICAL CONSTRAINTS FOR REWRITE:
- You MUST reference their specific industry and specific user type in the first sentence.
- You MUST include the actual metrics provided (e.g., ${revenueLeakagePercent}%, ${thirdPartyCount} scripts).
- ${absoluteRule}
- Eradicate ANY developer jargon (e.g., remove "DOM", "JavaScript", "CPU", "Core Web Vitals", "main thread"). 
- Eradicate ANY cheesy SaaS slogans.`
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
      industryContext: aiAnalysis, // <-- Injected AI Output
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