export function auditHtmlMetadata(htmlText: string) {
  // 1. Social Preview (Open Graph) via Regex
  const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
  const ogTitleMatch = htmlText.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || 
                       htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
                       
  const ogImageMatch = htmlText.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                       htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
                       
  const ogDescMatch = htmlText.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                      htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);

  const ogTitle = ogTitleMatch?.[1] || titleMatch?.[1] || null;
  const ogImage = ogImageMatch?.[1] || null;

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
      description: ogDescMatch?.[1] || null,
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