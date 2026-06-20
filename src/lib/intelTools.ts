export type HashType = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512' | 'Unknown';

export function decodeBase64(input: string): string {
  try {
    const cleaned = input.replace(/\s/g, '');
    return atob(cleaned);
  } catch {
    return 'Invalid Base64';
  }
}

export function decodeHex(input: string): string {
  const cleaned = input.replace(/\s/g, '').replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]*$/.test(cleaned) || cleaned.length % 2 !== 0) return 'Invalid Hex';
  try {
    const bytes = cleaned.match(/.{2}/g) ?? [];
    return bytes.map((b) => String.fromCharCode(parseInt(b, 16))).join('');
  } catch {
    return 'Invalid Hex';
  }
}

export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return 'Invalid URL encoding';
  }
}

export function decodeJwtHeader(token: string): string {
  const part = token.trim().split('.')[0];
  if (!part) return 'Invalid JWT — missing header segment';
  try {
    const json = decodeBase64(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return 'Invalid JWT header';
  }
}

export function identifyHash(input: string): HashType {
  const cleaned = input.trim().toLowerCase();
  if (/^[a-f0-9]{32}$/.test(cleaned)) return 'MD5';
  if (/^[a-f0-9]{40}$/.test(cleaned)) return 'SHA-1';
  if (/^[a-f0-9]{64}$/.test(cleaned)) return 'SHA-256';
  if (/^[a-f0-9]{128}$/.test(cleaned)) return 'SHA-512';
  return 'Unknown';
}

const IOC_PATTERNS = {
  ipv4: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  url: /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi,
  md5: /\b[a-fA-F0-9]{32}\b/g,
  sha256: /\b[a-fA-F0-9]{64}\b/g,
  domain: /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/g,
};

export function extractIocs(text: string) {
  const unique = (matches: RegExpMatchArray | null) => [...new Set(matches ?? [])];
  const domains = unique(text.match(IOC_PATTERNS.domain)).filter(
    (d) => !d.match(/^\d+\.\d+\.\d+\.\d+$/) && d.includes('.')
  );
  return {
    ipv4: unique(text.match(IOC_PATTERNS.ipv4)),
    emails: unique(text.match(IOC_PATTERNS.email)),
    urls: unique(text.match(IOC_PATTERNS.url)),
    md5: unique(text.match(IOC_PATTERNS.md5)),
    sha256: unique(text.match(IOC_PATTERNS.sha256)),
    domains: domains.slice(0, 20),
  };
}

export interface PhishAnalysis {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
}

export function analyzePhishUrl(raw: string): PhishAnalysis {
  const flags: string[] = [];
  let score = 0;

  let url = raw.trim();
  if (!url) return { score: 0, level: 'low', flags: ['Empty URL'] };

  try {
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const full = url.toLowerCase();

    if (parsed.protocol === 'http:') {
      flags.push('Uses HTTP (no TLS)');
      score += 15;
    }

    if (host.split('.').length > 4) {
      flags.push('Deep subdomain nesting');
      score += 20;
    }

    if (/@/.test(parsed.pathname + parsed.search)) {
      flags.push('@ symbol in URL path — credential phishing pattern');
      score += 35;
    }

    const punycode = /xn--/;
    if (punycode.test(host)) {
      flags.push('Punycode domain — possible homograph attack');
      score += 30;
    }

    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.zip', '.mov'];
    if (suspiciousTlds.some((tld) => host.endsWith(tld))) {
      flags.push('High-risk TLD');
      score += 25;
    }

    const brandImpersonation = ['paypal', 'microsoft', 'google', 'apple', 'amazon', 'bank'];
    for (const brand of brandImpersonation) {
      if (host.includes(brand) && !host.endsWith(`${brand}.com`) && !host.endsWith(`${brand}.co`)) {
        flags.push(`Possible ${brand} impersonation in hostname`);
        score += 25;
        break;
      }
    }

    if (full.includes('login') && full.includes('verify')) {
      flags.push('Login + verify keywords combined');
      score += 15;
    }

    if (parsed.hostname.length > 50) {
      flags.push('Very long hostname');
      score += 15;
    }

    const ipHost = /^\d+\.\d+\.\d+\.\d+$/.test(host);
    if (ipHost) {
      flags.push('Raw IP address instead of domain');
      score += 20;
    }

    if (flags.length === 0) flags.push('No obvious phishing indicators detected');
  } catch {
    flags.push('Malformed URL');
    score = 50;
  }

  score = Math.min(100, score);
  const level =
    score >= 70 ? 'critical' : score >= 45 ? 'high' : score >= 25 ? 'medium' : 'low';

  return { score, level, flags };
}
