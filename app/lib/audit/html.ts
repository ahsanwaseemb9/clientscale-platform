export function auditHtmlMetadata(htmlText: string) {
  // --- DEFENSIVE BOUNCER ---
  // Ensure we always have a string to prevent fatal regex crashes on dirty payloads
  const safeHtml = typeof htmlText === 'string' ? htmlText : '';

  // 1. Social Preview & Meta Description via Regex
  const titleMatch = safeHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  
  const ogTitleMatch = safeHtml.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || 
                       safeHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
                       
  const ogImageMatch = safeHtml.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                       safeHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
                       
  const ogDescMatch = safeHtml.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                      safeHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);

  // Fallback to standard SEO description if og:description is missing
  const standardDescMatch = safeHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                            safeHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

  const rawTitle = ogTitleMatch?.[1] || titleMatch?.[1] || null;
  
  // Basic cleanup for standard HTML entity apostrophes/quotes
  const ogTitle = rawTitle 
    ? rawTitle.replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    : null;

  const ogImage = ogImageMatch?.[1] || null;
  const description = ogDescMatch?.[1] || standardDescMatch?.[1] || null;

  // 2. Accessibility & Missing Alt Extraction
  const imgTags = safeHtml.match(/<img[^>]+>/gi) || [];
  const totalImages = imgTags.length;

  const missingAltImages: string[] = [];
  imgTags.forEach(img => {
    // Check if the img tag does not contain an alt attribute
    if (!/\balt\s*=/i.test(img)) {
      const srcMatch = img.match(/src=["']([^"']+)["']/i);
      missingAltImages.push(srcMatch?.[1] || 'Unnamed Asset / Inline SVG Element');
    }
  });

  const missingAlt = missingAltImages.length;

  // 3. Schema Structured Data Check
  const hasSchema = /application\/ld\+json/i.test(safeHtml);

  // 4. Third-Party Script Bloat Tracker
  const allScripts = safeHtml.match(/<script[^>]+src=["']([^"']+)["']/gi) || [];
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
      missingAltImages,
      altComplianceScore: totalImages > 0 ? Math.round(((totalImages - missingAlt) / totalImages) * 100) : 100
    },
    schemaPresent: hasSchema,
    thirdPartyScriptCount: thirdPartyScripts.length
  };
}