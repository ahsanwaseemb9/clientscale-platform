export function auditHtmlMetadata(htmlText: string) {
  // 1. Social Preview & Meta Description via Regex
  const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
  
  const ogTitleMatch = htmlText.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || 
                       htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
                       
  const ogImageMatch = htmlText.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                       htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
                       
  const ogDescMatch = htmlText.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                      htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);

  // Fallback to standard SEO description if og:description is missing
  const standardDescMatch = htmlText.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                            htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

  const rawTitle = ogTitleMatch?.[1] || titleMatch?.[1] || null;
  
  // Basic cleanup for standard HTML entity apostrophes/quotes
  const ogTitle = rawTitle 
    ? rawTitle.replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    : null;

  const ogImage = ogImageMatch?.[1] || null;
  const description = ogDescMatch?.[1] || standardDescMatch?.[1] || null;

  // 2. Accessibility Quick Vitals
  const totalImages = (htmlText.match(/<img[^>]+>/gi) || []).length;
  // Matches <img> tags that do NOT contain an alt attribute
  const missingAlt = (htmlText.match(/<img(?![^>]*\balt=)[^>]+>/gi) || []).length;

  // 3. Schema Structured Data Check
  const hasSchema = /application\/ld\+json/i.test(htmlText);

  // 4. Third-Party Script Bloat Tracker
  const allScripts = htmlText.match(/<script[^>]+src=["']([^"']+)["']/gi) || [];
  const thirdPartyScripts = allScripts.filter(script => script.includes('http'));

  return {
    socialPreview: {
      title: ogTitle,
      image: ogImage,
      description: description,
      isValid: Boolean(ogTitle && ogImage)
    },
    accessibility: {
      totalImages,
      missingAlt,
      altComplianceScore: totalImages > 0 ? Math.round(((totalImages - missingAlt) / totalImages) * 100) : 100
    },
    schemaPresent: hasSchema,
    thirdPartyScriptCount: thirdPartyScripts.length
  };
}