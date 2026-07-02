export interface ClientIntel {
  sessionId: string;
  timezone: string;
  language: string;
  languages: string;
  screen: string;
  viewport: string;
  pixelRatio: string;
  colorDepth: string;
  platform: string;
  os: string;
  architecture: string;
  bitness: string;
  model: string;
  cores: number | null;
  deviceMemory: number | null;
  gpu: string;
  connectionType: string;
  connectionDownlink: string;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  touchPoints: number;
  referrer: string;
  userAgent: string;
  localTime: string;
  hardwareSummary: string;
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
  viewport: string;
  pixelRatio: string;
  platform: string;
  os: string;
  architecture: string;
  gpu: string;
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
  if (ua.includes('Chrome/') && !ua.includes('Edg')) return 'Google Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown browser';
}

function parseOsFromUa(ua: string): string {
  if (ua.includes('Windows NT 10')) return 'Windows 10/11';
  if (ua.includes('Windows NT')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown OS';
}

function detectGpu(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'WebGL unavailable';
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return String(renderer || 'Unknown GPU');
    }
    return 'GPU (renderer masked)';
  } catch {
    return 'GPU detection failed';
  }
}

function formatBattery(level: number | null, charging: boolean | null): string {
  if (level == null) return 'Not available (privacy / desktop)';
  const pct = Math.round(level * 100);
  return charging ? `${pct}% (charging)` : `${pct}%`;
}

function buildHardwareSummary(parts: {
  cores: number | null;
  deviceMemory: number | null;
  architecture: string;
  bitness: string;
  gpu: string;
}): string {
  const coreLabel = parts.cores != null ? `${parts.cores} logical cores` : 'cores unknown';
  const memLabel = parts.deviceMemory != null ? `${parts.deviceMemory} GB RAM (reported)` : 'RAM not reported';
  const arch = parts.architecture !== 'unknown' ? parts.architecture : '';
  const bits = parts.bitness !== 'unknown' ? `${parts.bitness}-bit` : '';
  const archBits = [arch, bits].filter(Boolean).join(' ');
  return [coreLabel, memLabel, archBits, `GPU: ${parts.gpu}`].filter(Boolean).join(' · ');
}

export async function collectClientIntel(): Promise<ClientIntel> {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number; rtt?: number };
    getBattery?: () => Promise<{ level: number; charging: boolean }>;
    userAgentData?: {
      platform?: string;
      brands?: { brand: string; version: string }[];
      getHighEntropyValues?: (hints: string[]) => Promise<Record<string, string>>;
    };
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

  let architecture = 'unknown';
  let bitness = 'unknown';
  let model = 'unknown';
  let os = parseOsFromUa(navigator.userAgent);
  let platform = navigator.platform || 'unknown';

  try {
    if (nav.userAgentData?.getHighEntropyValues) {
      const hints = await nav.userAgentData.getHighEntropyValues([
        'architecture',
        'bitness',
        'model',
        'platform',
        'platformVersion',
        'fullVersionList',
      ]);
      architecture = hints.architecture || architecture;
      bitness = hints.bitness || bitness;
      model = hints.model || model;
      if (hints.platform) {
        platform = hints.platform;
        os = hints.platformVersion ? `${hints.platform} ${hints.platformVersion}` : hints.platform;
      }
    } else if (nav.userAgentData?.platform) {
      platform = nav.userAgentData.platform;
      os = nav.userAgentData.platform;
    }
  } catch {
    /* userAgentData blocked */
  }

  const gpu = detectGpu();
  const cores = navigator.hardwareConcurrency ?? null;
  const deviceMemory = nav.deviceMemory ?? null;

  let connectionType = 'unknown';
  let connectionDownlink = 'unknown';
  if (nav.connection?.effectiveType) {
    connectionType = nav.connection.effectiveType;
    if (nav.connection.downlink) connectionDownlink = `${nav.connection.downlink} Mbps`;
    if (nav.connection.rtt) connectionType += ` · ${nav.connection.rtt}ms RTT`;
  }

  const hardwareSummary = buildHardwareSummary({ cores, deviceMemory, architecture, bitness, gpu });

  return {
    sessionId: getSessionId(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    languages: navigator.languages?.join(', ') || navigator.language,
    screen: `${window.screen.width}×${window.screen.height}`,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    pixelRatio: `${window.devicePixelRatio}x`,
    colorDepth: `${window.screen.colorDepth}-bit`,
    platform,
    os,
    architecture,
    bitness,
    model,
    cores,
    deviceMemory,
    gpu,
    connectionType,
    connectionDownlink,
    batteryLevel,
    batteryCharging,
    touchPoints: navigator.maxTouchPoints ?? 0,
    referrer: document.referrer || 'direct',
    userAgent: navigator.userAgent,
    localTime: new Date().toLocaleString(),
    hardwareSummary,
  };
}

function buildClientFallback(client: ClientIntel): VisitorPulseResponse {
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
    viewport: client.viewport,
    pixelRatio: client.pixelRatio,
    platform: client.platform,
    os: client.os,
    architecture: client.architecture,
    gpu: client.gpu,
    hardware: client.hardwareSummary,
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
      return { ...fallback, vpnAssessment: 'Server offline — client signals only' };
    }
    const data = await res.json();
    return {
      ...fallback,
      ...data,
      localTime: client.localTime,
      browser: parseBrowser(client.userAgent),
    };
  } catch {
    return {
      ...fallback,
      ip: 'Client-side only',
      location: `${client.timezone} (timezone inferred)`,
      isp: 'Unavailable offline',
      vpnAssessment: 'Cannot assess without server',
    };
  }
}

export function isVpnRisk(assessment: string): boolean {
  return /likely|possible|proxy|vpn|datacenter|anonymizer/i.test(assessment);
}
