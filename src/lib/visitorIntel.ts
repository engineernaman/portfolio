export interface ClientIntel {
  sessionId: string;
  timezone: string;
  language: string;
  screen: string;
  platform: string;
  cores: number | null;
  deviceMemory: number | null;
  connectionType: string;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  referrer: string;
  userAgent: string;
  localTime: string;
}

export interface VisitorPulseResponse {
  ip: string;
  location: string;
  isp: string;
  vpnAssessment: string;
  battery: string;
  connection: string;
  timezone: string;
  language: string;
  screen: string;
  platform: string;
  hardware: string;
  referrer: string;
  sessionId: string;
  localTime?: string;
  browser?: string;
}

const SESSION_KEY = 'soumysec-session-id';
const SCAN_KEY = 'soumysec-scan-done';

export function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function hasScannedThisSession(): boolean {
  return sessionStorage.getItem(SCAN_KEY) === '1';
}

export function markScannedThisSession(): void {
  sessionStorage.setItem(SCAN_KEY, '1');
}

function parseBrowser(ua: string): string {
  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('Chrome/')) return 'Google Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown browser';
}

function formatBattery(level: number | null, charging: boolean | null): string {
  if (level == null) return 'Not available';
  const pct = Math.round(level * 100);
  return charging ? `${pct}% (charging)` : `${pct}%`;
}

export async function collectClientIntel(): Promise<ClientIntel> {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number };
    getBattery?: () => Promise<{ level: number; charging: boolean }>;
  };

  let batteryLevel: number | null = null;
  let batteryCharging: boolean | null = null;

  try {
    if (nav.getBattery) {
      const battery = await nav.getBattery();
      batteryLevel = battery.level;
      batteryCharging = battery.charging;
    }
  } catch {
    /* Battery API unavailable */
  }

  let connectionType = 'unknown';
  if (nav.connection?.effectiveType) {
    connectionType = nav.connection.effectiveType;
    if (nav.connection.downlink) {
      connectionType += ` (${nav.connection.downlink}Mbps)`;
    }
  }

  return {
    sessionId: getSessionId(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    platform: navigator.platform,
    cores: navigator.hardwareConcurrency ?? null,
    deviceMemory: nav.deviceMemory ?? null,
    connectionType,
    batteryLevel,
    batteryCharging,
    referrer: document.referrer || 'direct',
    userAgent: navigator.userAgent,
    localTime: new Date().toLocaleString(),
  };
}

function buildClientFallback(client: ClientIntel): VisitorPulseResponse {
  const cores = client.cores ?? '?';
  const mem = client.deviceMemory ?? '?';
  return {
    ip: 'Resolving...',
    location: 'Pending geo lookup',
    isp: 'Pending',
    vpnAssessment: 'Scan in progress',
    battery: formatBattery(client.batteryLevel, client.batteryCharging),
    connection: client.connectionType,
    timezone: client.timezone,
    language: client.language,
    screen: client.screen,
    platform: client.platform,
    hardware: `${cores} cores / ${mem} GB RAM`,
    referrer: client.referrer,
    sessionId: client.sessionId,
    localTime: client.localTime,
    browser: parseBrowser(client.userAgent),
  };
}

export async function sendVisitorPulse(
  event: 'connection' | 'contact_form',
  extra?: { name?: string; email?: string }
): Promise<VisitorPulseResponse> {
  const client = await collectClientIntel();
  const fallback = buildClientFallback(client);

  try {
    const res = await fetch('/api/visitor-pulse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        client: { ...client, ...extra },
      }),
    });
    if (!res.ok) {
      return { ...fallback, vpnAssessment: 'Server offline - client signals only' };
    }
    const data = await res.json();
    return {
      ...data,
      localTime: client.localTime,
      browser: parseBrowser(client.userAgent),
    };
  } catch {
    return {
      ...fallback,
      ip: 'Client-side only',
      location: client.timezone + ' (timezone inferred)',
      isp: 'Unavailable offline',
      vpnAssessment: 'Cannot assess without server',
    };
  }
}

export function isVpnRisk(assessment: string): boolean {
  return /likely|possible|proxy|vpn|datacenter|anonymizer/i.test(assessment);
}
