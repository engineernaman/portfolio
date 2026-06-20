import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { appendFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_DIR = join(__dirname, '..', 'logs');
const LOG_FILE = join(LOG_DIR, 'visitor.log');

if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: '48kb' }));

const rateMap = new Map();

function rateLimit(ip, max = 12, windowMs = 60000) {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count <= max;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
}

async function enrichIp(ip) {
  if (ip === 'unknown' || ip.startsWith('127.') || ip === '::1' || ip.startsWith('::ffff:127.')) {
    return {
      city: 'Local',
      regionName: '',
      country: 'Development',
      isp: 'Localhost',
      org: 'Local',
      proxy: false,
      hosting: false,
    };
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp,org,proxy,hosting,mobile`
    );
    const data = await res.json();
    if (data.status === 'success') return data;
  } catch {
    /* geo lookup failed */
  }
  return null;
}

function assessVpn(geo) {
  if (!geo) return 'Unknown — geo lookup unavailable';
  if (geo.proxy) return 'Likely VPN/Proxy (proxy flag)';
  if (geo.hosting) return 'Likely VPN/Datacenter (hosting IP)';
  const isp = `${geo.isp || ''} ${geo.org || ''}`.toLowerCase();
  if (/vpn|proxy|tor|datacenter|hosting|cloud|digitalocean|amazon|google|azure|mullvad|nordvpn/i.test(isp)) {
    return 'Possible VPN/Anonymizer (ISP heuristic)';
  }
  return 'No obvious VPN signals';
}

function formatLocation(geo) {
  if (!geo) return 'Unknown';
  const parts = [geo.city, geo.regionName, geo.country].filter(Boolean);
  return parts.join(', ') || 'Unknown';
}

function formatLogEntry(entry) {
  return [
    '================================================================================',
    `[${entry.timestamp}] VISITOR PULSE · ${entry.event}`,
    '--------------------------------------------------------------------------------',
    `IP:           ${entry.ip}`,
    `Location:     ${entry.location}`,
    `ISP:          ${entry.isp}`,
    `VPN/Proxy:    ${entry.vpnAssessment}`,
    `Battery:      ${entry.battery}`,
    `Connection:   ${entry.connection}`,
    `Timezone:     ${entry.timezone}`,
    `Language:     ${entry.language}`,
    `Screen:       ${entry.screen}`,
    `Platform:     ${entry.platform}`,
    `Hardware:     ${entry.hardware}`,
    `Browser:      ${entry.browser}`,
    `Local time:   ${entry.localTime}`,
    `Referrer:     ${entry.referrer}`,
    `Session:      ${entry.sessionId}`,
    ...(entry.name ? [`Name:         ${entry.name}`] : []),
    ...(entry.email ? [`Email:        ${entry.email}`] : []),
    '================================================================================',
    '',
  ].join('\n');
}

app.post('/api/visitor-pulse', async (req, res) => {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const client = req.body?.client || {};
  const geo = await enrichIp(ip);
  const location = formatLocation(geo);
  const isp = geo?.isp || geo?.org || 'Unknown';
  const vpnAssessment = assessVpn(geo);

  const battery =
    client.batteryLevel != null
      ? `${Math.round(client.batteryLevel * 100)}%${client.batteryCharging ? ' (charging)' : ''}`
      : 'Not available';

  const entry = {
    timestamp: new Date().toISOString(),
    event: req.body?.event || 'connection',
    ip,
    location,
    isp,
    vpnAssessment,
    battery,
    connection: client.connectionType || 'unknown',
    timezone: client.timezone || 'unknown',
    language: client.language || 'unknown',
    screen: client.screen || 'unknown',
    platform: client.platform || 'unknown',
    hardware: `${client.cores ?? '?'} cores · ${client.deviceMemory ?? '?'} GB RAM`,
    referrer: client.referrer || 'direct',
    sessionId: client.sessionId || 'unknown',
    browser: client.userAgent ? (client.userAgent.includes('Edg') ? 'Microsoft Edge' : client.userAgent.includes('Chrome') ? 'Chrome' : client.userAgent.includes('Firefox') ? 'Firefox' : 'Other') : 'unknown',
    localTime: client.localTime || 'unknown',
    name: client.name,
    email: client.email,
  };

  try {
    await appendFile(LOG_FILE, formatLogEntry(entry), 'utf8');
  } catch (err) {
    console.error('[visitor-log] write failed:', err.message);
  }

  const displayIp =
    ip.startsWith('127.') || ip === '::1' || ip.startsWith('::ffff:127.') ? 'Local (dev)' : ip;

  res.json({
    ip: displayIp,
    location,
    isp,
    vpnAssessment,
    battery,
    connection: entry.connection,
    timezone: entry.timezone,
    language: entry.language,
    screen: entry.screen,
    platform: entry.platform,
    hardware: entry.hardware,
    referrer: entry.referrer,
    sessionId: entry.sessionId,
    localTime: entry.localTime,
    browser: entry.browser,
  });
});

const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 8787;
app.listen(PORT, () => {
  console.log(`SoumySec server listening on :${PORT}`);
  console.log(`Visitor log: ${LOG_FILE}`);
});
