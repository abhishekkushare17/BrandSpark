import dns from "dns";
import { DomainCheckResult, SocialCheckResult } from "@/types";

const dnsPromises = dns.promises;

export const SUPPORTED_EXTENSIONS = [".com", ".io", ".ai", ".co", ".app", ".store", ".tech", ".org"];

// Verify a single domain
export async function verifyDomain(name: string, extension: string): Promise<DomainCheckResult> {
  const cleanBase = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const fullDomain = `${cleanBase}${extension}`;

  const result: DomainCheckResult = {
    domain: fullDomain,
    extension,
    status: "unknown",
    verifiedAt: new Date().toISOString(),
  };

  try {
    // 1. Check via DNS over HTTPS (Cloudflare DoH)
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(fullDomain)}&type=A`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const dohRes = await fetch(dohUrl, {
      headers: { accept: "application/dns-json" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (dohRes.ok) {
      const data = await dohRes.json();
      // Status 0 = NOERROR (domain exists / taken)
      // Status 3 = NXDOMAIN (domain does not exist / likely available)
      if (data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0) {
        result.status = "taken";
        result.rawDetails = "DNS A/CNAME record active";
        return result;
      } else if (data.Status === 3) {
        // Try RDAP to confirm not parked without DNS records
        try {
          const rdapCtrl = new AbortController();
          const rdapTimeout = setTimeout(() => rdapCtrl.abort(), 2000);
          const rdapRes = await fetch(`https://rdap.org/domain/${encodeURIComponent(fullDomain)}`, {
            signal: rdapCtrl.signal,
          });
          clearTimeout(rdapTimeout);

          if (rdapRes.status === 404) {
            result.status = "available";
            result.priceEstimate = getExtensionPrice(extension);
            result.rawDetails = "Verified via RDAP & NXDOMAIN";
            return result;
          } else if (rdapRes.status === 200) {
            result.status = "taken";
            result.rawDetails = "RDAP registry entry found";
            return result;
          }
        } catch {
          // If RDAP times out, fallback to NXDOMAIN indicator
          result.status = "available";
          result.priceEstimate = getExtensionPrice(extension);
          result.rawDetails = "No DNS records found (Likely available)";
          return result;
        }
      }
    }
  } catch {
    // If DoH fails, try local DNS resolution
    try {
      await dnsPromises.resolve(fullDomain);
      result.status = "taken";
      result.rawDetails = "Resolved via local DNS";
      return result;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "ENOTFOUND" || code === "ENODATA") {
        result.status = "available";
        result.priceEstimate = getExtensionPrice(extension);
        result.rawDetails = "DNS lookup negative";
        return result;
      }
    }
  }

  result.status = "unknown";
  result.rawDetails = "Verification service rate limited. Check registrar directly.";
  return result;
}

function getExtensionPrice(ext: string): string {
  switch (ext) {
    case ".com":
      return "$10.99 / yr";
    case ".ai":
      return "$69.99 / yr";
    case ".io":
      return "$38.99 / yr";
    case ".co":
      return "$24.99 / yr";
    case ".app":
      return "$14.99 / yr";
    case ".store":
      return "$4.99 / yr";
    case ".tech":
      return "$6.99 / yr";
    case ".org":
      return "$12.99 / yr";
    default:
      return "$14.99 / yr";
  }
}

// Check social platform handles
export async function verifySocialHandle(
  name: string,
  platform: SocialCheckResult["platform"]
): Promise<SocialCheckResult> {
  const handle = name.toLowerCase().replace(/[^a-z0-9_]/g, "");
  let url = "";
  let status: SocialCheckResult["status"] = "unknown";

  switch (platform) {
    case "GitHub":
      url = `https://github.com/${handle}`;
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 2000);
        const res = await fetch(`https://api.github.com/users/${handle}`, {
          headers: { "User-Agent": "BrandSpark-Checker" },
          signal: ctrl.signal,
        });
        clearTimeout(tid);
        if (res.status === 404) status = "available";
        else if (res.status === 200) status = "taken";
      } catch {
        status = "unknown";
      }
      break;

    case "YouTube":
      url = `https://www.youtube.com/@${handle}`;
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 2500);
        const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
        clearTimeout(tid);
        if (res.status === 404) status = "available";
        else if (res.status === 200) status = "taken";
      } catch {
        status = "unknown";
      }
      break;

    case "Twitter / X":
      url = `https://x.com/${handle}`;
      status = "unknown"; // X restricts unauthenticated scraping
      break;

    case "Instagram":
      url = `https://instagram.com/${handle}`;
      status = "unknown"; // Meta blocks unauthenticated scrapers
      break;

    case "LinkedIn":
      url = `https://linkedin.com/company/${handle}`;
      status = "unknown";
      break;

    case "Facebook":
      url = `https://facebook.com/${handle}`;
      status = "unknown";
      break;
  }

  return {
    platform,
    handle: `@${handle}`,
    url,
    status,
    verifiedAt: new Date().toISOString(),
  };
}
