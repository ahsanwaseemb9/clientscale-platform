import { NextResponse } from 'next/server';

// @ts-ignore
import { Wappalyzer, technologies, categories } from 'wapalyzer-core';

// Import the newly created forensic modules
import { auditDomainSecurity } from '../../lib/audit/dns';
import { auditHtmlMetadata } from '../../lib/audit/html';

// Initialize the local analysis engine
Wappalyzer.setTechnologies(technologies);
Wappalyzer.setCategories(categories);

// CUSTOM FORENSIC DETECTOR
function detectNextJs(html: string, headers: Record<string, string[]>) {
  const hasHeader = headers['x-powered-by']?.some(h => h.includes('Next.js'));
  const hasNextPath = html.includes('/_next/static/');
  const hasNextData = html.includes('__NEXT_DATA__');
  
  return (hasHeader || hasNextPath || hasNextData) 
    ? { name: "Next.js", description: "React framework for production", categories: ["Web Frameworks"] } 
    : null;
}

// LEAKAGE RISK ALGORITHM
function calculateLeakageRisk(
  inpString: string, 
  tbtString: string, 
  altCompliance: number, 
  securityRisk: string,
  scriptCount: number
) {
  let riskScore = 0;
  const leakageFactors = [];

  // 1. Speed Friction (Parses numbers from "150 ms")
  const inpMatch = inpString.match(/\d+/);
  const tbtMatch = tbtString.match(/\d+/);
  
  if (inpMatch) {
    const inp = parseInt(inpMatch[0], 10);
    if (inp > 500) { 
      riskScore += 40; 
      leakageFactors.push("Severe interaction delay (INP >500ms)"); 
    } else if (inp > 200) { 
      riskScore += 25; 
      leakageFactors.push("Noticeable input lag (INP >200ms)"); 
    }
  } else if (tbtMatch) {
    const tbt = parseInt(tbtMatch[0], 10);
    if (tbt > 600) { 
      riskScore += 30; 
      leakageFactors.push("High main-thread blocking"); 
    } else if (tbt > 200) { 
      riskScore += 15; 
      leakageFactors.push("Moderate thread blocking"); 
    }
  }

  // 2. Accessibility Friction
  if (altCompliance < 100) {
    const penalty = Math.min(20, Math.round((100 - altCompliance) * 0.4));
    riskScore += penalty;
    if (penalty >= 10) leakageFactors.push("Significant accessibility barriers");
  }

  // 3. Security / Marketing Funnel Friction
  if (securityRisk === 'HIGH') {
    riskScore += 25;
    leakageFactors.push("Email deliverability risk (Missing SPF/DMARC)");
  }

  // 4. Bloat / Distraction Friction
  if (scriptCount > 5) {
    const penalty = Math.min(15, Math.round(scriptCount * 1.5));
    riskScore += penalty;
    if (penalty >= 10) leakageFactors.push("Excessive third-party script bloat");
  }

  // Normalize to a 0-100 scale
  riskScore = Math.min(100, riskScore);
  
  let riskTier = "OPTIMIZED";
  if (riskScore >= 75) riskTier = "CRITICAL";
  else if (riskScore >= 50) riskTier = "HIGH";
  else if (riskScore >= 25) riskTier = "MODERATE";

  return { riskScore, riskTier, leakageFactors };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) return NextResponse.json({ error: 'URL required' }, { status: 400 });
  const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const hostname = new URL(targetUrl).hostname;

  try {
    // 1. Fetch Raw Page Data & DNS Security concurrently
    const [targetResponse, dnsResult] = await Promise.all([
      fetch(targetUrl, { headers: { 'User-Agent': 'ClientScale-Forensic-Engine/1.0' } }),
      auditDomainSecurity(hostname)
    ]);
    
    const htmlText = await targetResponse.text();
    const serverHeaders: Record<string, string[]> = {};
    targetResponse.headers.forEach((value, key) => { serverHeaders[key] = [value]; });

    // 2. Run Wappalyzer and PageSpeed Sweeps in parallel
    const googleApiKey = "AIzaSyCUJORk1Q4OyTQZu-MeIEZXescMJYuxa_k";
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&key=${googleApiKey}`;
    
    const [techDetections, pageSpeedRes] = await Promise.all([
      Wappalyzer.analyze({ url: targetUrl, headers: serverHeaders, html: htmlText, meta: {}, scriptSrc: [] }),
      fetch(pageSpeedUrl).then(res => res.json()).catch(() => null)
    ]);

    // 3. Process the Local HTML analysis
    const htmlAudit = auditHtmlMetadata(htmlText);
    const lighthouse = pageSpeedRes?.lighthouseResult;

    // Sanitize infrastructure data
    let cleanInfrastructure = Array.isArray(techDetections)
      ? techDetections.map((item: any) => ({
          name: (item.technology || item).name || 'Unknown',
          description: (item.technology || item).description || 'No description.',
          categories: (item.technology || item).categories || []
        }))
      : [];

    const nextJsMatch = detectNextJs(htmlText, serverHeaders);
    if (nextJsMatch && !cleanInfrastructure.find(t => t.name === "Next.js")) {
      cleanInfrastructure.push(nextJsMatch);
    }

    // 4. Construct Unified Payload & Calculate Leakage
    const tbtValue = lighthouse?.audits?.['total-blocking-time']?.displayValue || 'N/A';
    const inpValue = pageSpeedRes?.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile 
      ? `${pageSpeedRes.loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile} ms` 
      : 'N/A';

    const leakageData = calculateLeakageRisk(
      inpValue,
      tbtValue,
      htmlAudit.accessibility.altComplianceScore,
      dnsResult.riskLevel,
      htmlAudit.thirdPartyScriptCount
    );

    const unifiedPayload = {
      target: targetUrl,
      status: 'success',
      timestamp: new Date().toISOString(),
      security: dnsResult,
      metaAndSocial: htmlAudit.socialPreview,
      accessibility: htmlAudit.accessibility,
      diagnostics: {
        performanceScore: lighthouse?.categories?.performance?.score 
          ? Math.round(lighthouse.categories.performance.score * 100) 
          : null,
        latency: {
          tbt: tbtValue,
          inp: inpValue,
        },
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

  } catch (error) {
    console.error('Diagnostic Error:', error);
    return NextResponse.json({ error: 'Sweep failed' }, { status: 500 });
  }
}