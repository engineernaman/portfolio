import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MapPin, Wifi, ShieldAlert, ShieldCheck, Cpu } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  sendVisitorPulse,
  hasScannedThisSession,
  markScannedThisSession,
  isVpnRisk,
  type VisitorPulseResponse,
} from '../lib/visitorIntel';

const SCAN_STEPS = [
  'Intercepting connection handshake…',
  'Resolving IP & routing path…',
  'Geo-locating endpoint…',
  'Fingerprinting device surface…',
  'Analyzing VPN / proxy signals…',
  'Session profile compiled.',
];

type ScanField = { key: string; label: string; value: string; highlight?: boolean };

function buildFields(data: VisitorPulseResponse): ScanField[] {
  return [
    { key: 'ip', label: 'IP ADDRESS', value: data.ip, highlight: true },
    { key: 'location', label: 'EST. LOCATION', value: data.location, highlight: true },
    { key: 'vpn', label: 'ANONYMITY LAYER', value: data.vpnAssessment, highlight: true },
    { key: 'isp', label: 'ISP / NETWORK', value: data.isp },
    { key: 'battery', label: 'BATTERY', value: data.battery },
    { key: 'connection', label: 'LINK TYPE', value: data.connection },
    { key: 'browser', label: 'BROWSER', value: data.browser ?? 'Unknown' },
    { key: 'os', label: 'OPERATING SYSTEM', value: data.os ?? data.platform },
    { key: 'architecture', label: 'CPU ARCH', value: data.architecture ?? 'unknown' },
    { key: 'gpu', label: 'GPU RENDERER', value: data.gpu ?? 'unknown', highlight: true },
    { key: 'hardware', label: 'HARDWARE PROFILE', value: data.hardware },
    { key: 'timezone', label: 'TIMEZONE', value: data.timezone },
    { key: 'localTime', label: 'LOCAL TIME', value: data.localTime ?? '—' },
    { key: 'language', label: 'LANGUAGE', value: data.language },
    { key: 'screen', label: 'DISPLAY', value: data.screen },
    { key: 'viewport', label: 'VIEWPORT', value: data.viewport ?? '—' },
    { key: 'pixelRatio', label: 'PIXEL RATIO', value: data.pixelRatio ?? '—' },
    { key: 'referrer', label: 'REFERRER', value: data.referrer },
    { key: 'session', label: 'SESSION ID', value: data.sessionId },
  ];
}

const VisitorPulse = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { setVisitorProfile, visitorProfile } = useApp();
  const [data, setData] = useState<VisitorPulseResponse | null>(visitorProfile);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>(
    visitorProfile && visitorProfile.ip && !/resolving|unavailable/i.test(visitorProfile.ip) ? 'done' : 'idle'
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [visibleFields, setVisibleFields] = useState(0);
  const scannedRef = useRef(hasScannedThisSession() || Boolean(visitorProfile));

  useEffect(() => {
    if (visitorProfile && !data) {
      setData(visitorProfile);
      setPhase('done');
      setVisibleFields(buildFields(visitorProfile).length);
    }
  }, [visitorProfile, data]);

  const runScan = useCallback(async () => {
    setPhase('scanning');
    setStepIndex(0);
    setVisibleFields(0);

    const stepTimer = window.setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, SCAN_STEPS.length - 1));
    }, 420);

    const result = await sendVisitorPulse('connection');
    window.clearInterval(stepTimer);

    setData(result);
    setVisitorProfile(result);
    markScannedThisSession();
    setPhase('done');

    const fields = buildFields(result);
    fields.forEach((_, i) => {
      window.setTimeout(() => setVisibleFields(i + 1), 180 + i * 120);
    });
  }, [setVisitorProfile]);

  useEffect(() => {
    if (inView && !scannedRef.current && phase === 'idle') {
      scannedRef.current = true;
      runScan();
    }
  }, [inView, phase, runScan]);

  const fields = data ? buildFields(data) : [];
  const vpnRisk = data ? isVpnRisk(data.vpnAssessment) : false;

  return (
    <div id="visitor-scan" ref={ref} className="relative">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/20 via-transparent to-emerald-500/20 pointer-events-none" />

      <div className="relative rounded-2xl border border-cyan-500/25 bg-[rgba(6,10,16,0.97)] overflow-hidden">
        {/* scan line */}
        {phase === 'scanning' && (
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <div className="px-5 sm:px-6 py-4 border-b border-white/8 flex items-center justify-between gap-3 bg-black/40">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs text-cyan-300 tracking-widest">CONNECTION INTERCEPTED</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400/80 tabular-nums">
            {phase === 'done' ? 'PROFILE LIVE' : phase === 'scanning' ? 'SCANNING…' : 'STANDBY'}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {phase === 'scanning' && (
              <motion.div
                key="scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <p className="font-mono text-sm text-cyan-300/90 animate-pulse">
                  {SCAN_STEPS[stepIndex]}
                </p>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((stepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-readable-muted font-body">
                  Mapping your session — this is what a secured perimeter sees when you connect.
                </p>
              </motion.div>
            )}

            {phase === 'done' && data && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Hero reveal — IP + Location */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 sm:p-5">
                    <p className="label-cyber text-cyan-400 mb-2 flex items-center gap-1.5">
                      <Wifi className="w-3 h-3" /> YOUR IP
                    </p>
                    <p className="font-mono text-xl sm:text-2xl font-bold text-readable tracking-tight break-all">
                      {data.ip}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5">
                    <p className="label-cyber text-emerald-400 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> EST. LOCATION
                    </p>
                    <p className="font-display text-lg sm:text-xl font-bold text-readable leading-snug">
                      {data.location}
                    </p>
                  </div>
                </div>

                {/* VPN badge */}
                <div
                  className={`flex items-start gap-3 rounded-xl border p-4 mb-6 ${
                    vpnRisk
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : 'border-emerald-500/30 bg-emerald-500/8'
                  }`}
                >
                  {vpnRisk ? (
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="label-cyber mb-1">ANONYMITY ASSESSMENT</p>
                    <p className={`text-sm font-body font-medium ${vpnRisk ? 'text-amber-300' : 'text-emerald-300'}`}>
                      {data.vpnAssessment}
                    </p>
                  </div>
                </div>

                {/* Terminal stream */}
                <div className="rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs sm:text-sm">
                  <p className="text-emerald-400/70 mb-3 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5" />
                    SESSION TELEMETRY STREAM
                  </p>
                  <div className="space-y-2">
                    {fields.map((field, i) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={i < visibleFields ? { opacity: 1, x: 0 } : { opacity: 0 }}
                        className="flex flex-col sm:flex-row sm:gap-4 sm:items-baseline border-b border-white/5 pb-2 last:border-0"
                      >
                        <span className="text-cyan-500/70 shrink-0 sm:w-36">{field.label}</span>
                        <span
                          className={`break-all ${
                            field.highlight ? 'text-readable font-semibold' : 'text-readable-muted'
                          }`}
                        >
                          {field.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-sm text-readable-muted font-body leading-relaxed">
                  You connected to a cybersecurity portfolio — and it already mapped your surface.
                  That awareness is the first layer of defense.
                </p>

                <button
                  type="button"
                  onClick={runScan}
                  className="mt-4 text-xs font-mono text-cyan-400/70 hover:text-cyan-300 transition-colors"
                >
                  ↻ Re-scan connection
                </button>
              </motion.div>
            )}

            {phase === 'idle' && (
              <motion.div key="idle" className="text-center py-8">
                <p className="text-readable-muted font-body mb-4">Scroll here to trigger live session mapping…</p>
                <button
                  type="button"
                  onClick={runScan}
                  className="px-6 py-3 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs tracking-wide hover:bg-cyan-500/20 transition-colors"
                >
                  SCAN MY CONNECTION NOW
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VisitorPulse;
