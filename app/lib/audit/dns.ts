import { resolveTxt } from 'node:dns/promises';

export async function auditDomainSecurity(domain: string) {
  try {
    // 1. Fetch SPF (Explicitly cast as string[][] for the catch block)
    const txtRecords = await resolveTxt(domain).catch(() => [] as string[][]);
    
    // Explicitly cast the flattened array as string[]
    const flatRecords = txtRecords.flat() as string[];
    const hasSpf = flatRecords.some((r) => r.startsWith('v=spf1'));

    // 2. Fetch DMARC (Using backticks for string interpolation)
    const dmarcRecords = await resolveTxt(`_dmarc.${domain}`).catch(() => [] as string[][]);
    
    // Explicitly cast the flattened array as string[]
    const flatDmarc = dmarcRecords.flat() as string[];
    const hasDmarc = flatDmarc.some((r) => r.startsWith('v=DMARC1'));

    return {
      spfConfigured: hasSpf,
      dmarcConfigured: hasDmarc,
      riskLevel: (!hasSpf || !hasDmarc) ? 'HIGH' : 'LOW'
    };
  } catch (error) {
    return { spfConfigured: false, dmarcConfigured: false, riskLevel: 'UNKNOWN' };
  }
}