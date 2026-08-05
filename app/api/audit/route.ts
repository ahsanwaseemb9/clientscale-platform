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
  action: z.string().describe("e.g., 'commercial clients can request quotes or book shipments on [Brand]'"),
  shortAction: z.string().describe("e.g., 'request a quote or track a shipment'"),
  scale: z.string().describe("e.g., 'freight and logistics portal'"),
  penalty: z.string().describe("e.g., 'commercial transport search rankings'"),
  userType: z.string().describe("e.g., 'commercial shippers' or 'hungry customers'"),
  buttons: z.string().describe("e.g., 'quote request forms and tracking links'")
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
    
    // --- ASYNC CONCURRENT EXECUTION BLOCK ---
    const [techDetections, pageSpeedRes, aiAnalysis] = await Promise.all([
      fetchWithTimeout(
        Wappalyzer.analyze({ url: targetUrl, headers: serverHeaders, html: htmlText, meta: {}, scriptSrc: [] }),
        25000, 
        [],
        "Wappalyzer"
      ),
      // 2. EXPLICIT ERROR LOGGING FOR GOOGLE API
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
      ),
      // 3. OpenAI Context Generator
      fetchWithTimeout(
        (async () => {
          if (!process.env.OPENAI_API_KEY) return null;
          
          const $ = cheerio.load(htmlText);
          const pageTitle = $('title').text();
          const metaDesc = $('meta[name="description"]').attr('content') || '';
          const bodyText = $('body').text().replace(/\s+/g, ' ').substring(0, 1500); 
          
          const { object } = await generateObject({
            model: openai('gpt-4o-mini'), 
            schema: industryContextSchema,
            prompt: "You are an expert technical sales analyst for a web performance agency.\n" +
                    "Analyze the following website text and generate specific, highly converting sales terminology tailored to their exact industry.\n" +
                    "The brand name is loosely: " + brandName + "\n\n" +
                    "Website Data:\n" +
                    "Title: " + pageTitle + "\n" +
                    "Description: " + metaDesc + "\n" +
                    "Content: " + bodyText
          });
          return object;
        })(),
        15000, // 15s timeout to ensure AI never hangs the main audit
        null,
        "OpenAI Industry Context"
      )
    ]);

    const htmlAudit = auditHtmlMetadata(htmlText);
    const lighthouse = pageSpeedRes?.lighthouseResult || null;

    let cleanInfrastructure = Array.isArray(techDetections)
      ? techDetections.map((item: any) => ({
          name: (item.technology || item).name || 'Unknown',
          description: (item.technology || item).description || 'No description.',
          categories: (item.technology || item).categories || []
        }))
      : [];

    const nextJsMatch = detectNextJs(htmlText, serverHeaders);
    if (nextJsMatch && !cleanInfrastructure.find((t: any) => t.name === "Next.js")) cleanInfrastructure.push(nextJsMatch);

    const tbtValue = lighthouse?.audits?.['total-blocking-time']?.displayValue || 'N/A';
    const inpValue = pageSpeedRes?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile 
      ? pageSpeedRes.loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile + " ms" 
      : 'N/A';

    const leakageData = calculateLeakageRisk(
      inpValue, tbtValue, htmlAudit.accessibility.altComplianceScore, dnsResult.riskLevel, htmlAudit.thirdPartyScriptCount
    );

    const unifiedPayload = {
      target: targetUrl,
      status: 'success',
      timestamp: new Date().toISOString(),
      industryContext: aiAnalysis, // <-- Injected AI Output
      security: dnsResult,
      metaAndSocial: htmlAudit.socialPreview,
      accessibility: htmlAudit.accessibility,
      diagnostics: {
        performanceScore: lighthouse?.categories?.performance?.score ? Math.round(lighthouse.categories.performance.score * 100) : null, 
        latency: { tbt: tbtValue, inp: inpValue },
        thirdPartyScriptCount: htmlAudit.thirdPartyScriptCount,
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