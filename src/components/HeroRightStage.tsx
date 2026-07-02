import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe2, Lock, Radar, Shield, Zap } from 'lucide-react';
import HeroSceneCanvas from './three/HeroSceneCanvas';
import { sections } from '../data/portfolio';
import { useApp } from '../context/AppContext';
import { isVpnRisk, sendVisitorPulse, hasScannedThisSession, markScannedThisSession } from '../lib/visitorIntel';

const LIVE_SIGNALS = [
  { label: 'Perimeter', value: 'ARMED', icon: Shield, tone: 'text-emerald-400' },
  { label: 'Mesh nodes', value: '6 active', icon: Globe2, tone: 'text-cyan-400' },
  { label: 'Threat layer', value: 'Monitoring', icon: Radar, tone: 'text-emerald-300' },
  { label: 'Encryption', value: 'TLS 1.3', icon: Lock, tone: 'text-cyan-300' },
];

interface HeroRightStageProps {
  reducedMotion?: boolean;
}

const HeroRightStage = ({ reducedMotion = false }: HeroRightStageProps) => {
  const { visitorProfile, setVisitorProfile } = useApp();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (visitorProfile?.ip && !/resolving|unavailable|client-side/i.test(visitorProfile.ip)) return;
    if (hasScannedThisSession()) return;
    sendVisitorPulse('connection').then((result) => {
      setVisitorProfile(result);
      markScannedThisSession();
    });
  }, [visitorProfile?.ip, setVisitorProfile]);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2400);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const signal = LIVE_SIGNALS[tick % LIVE_SIGNALS.length];
  const SignalIcon = signal.icon;
  const hasScan = visitorProfile && visitorProfile.ip !== 'Resolving...' && visitorProfile.ip !== 'Client-side only';
  const vpnRisk = hasScan ? isVpnRisk(visitorProfile.vpnAssessment) : false;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4 w-full min-h-[360px] lg:min-h-0 lg:flex-1 pointer-events-auto"
    >
      {/* 3D viewport */}
      <div className="relative flex-1 min-h-[300px] lg:min-h-[420px]">
        <HeroSceneCanvas reducedMotion={reducedMotion} />
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/5" />
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 rounded-br-2xl pointer-events-none" />
      </div>

      {/* Live signal strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {LIVE_SIGNALS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-[rgba(6,10,16,0.75)] backdrop-blur-md px-3 py-2.5"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3 h-3 ${item.tone}`} />
                <span className="text-[9px] font-mono tracking-widest text-readable-dim uppercase">{item.label}</span>
              </div>
              <p className={`text-xs font-mono font-semibold ${item.tone}`}>{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Session + sectors row */}
      <div className="grid lg:grid-cols-5 gap-3">
        <div className="lg:col-span-2 rounded-xl border border-cyan-500/25 bg-[rgba(6,10,16,0.82)] backdrop-blur-md p-4">
          <p className="font-mono text-[9px] tracking-widest text-cyan-400/80 uppercase mb-2 flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            Live session layer
          </p>
          {hasScan ? (
            <div className="space-y-1.5">
              <p className="font-mono text-sm text-readable truncate">{visitorProfile.ip}</p>
              <p className="text-xs text-readable-muted font-body leading-snug line-clamp-2">{visitorProfile.location}</p>
              <p className={`text-[10px] font-mono ${vpnRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
                {vpnRisk ? '⚠ Anonymity signal' : '✓ Direct route'} · {visitorProfile.isp}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-readable-muted font-body">Your connection can be mapped in real time.</p>
              <a
                href="#visitor-scan"
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Zap className="w-3 h-3" />
                Run perimeter scan →
              </a>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 rounded-xl border border-emerald-500/20 bg-[rgba(6,10,16,0.75)] backdrop-blur-md p-4">
          <p className="font-mono text-[9px] tracking-widest text-emerald-400/70 uppercase mb-2">Explore sectors</p>
          <div className="flex flex-wrap gap-1.5">
            {sections.slice(0, 6).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-2.5 py-1 rounded-md border border-white/10 bg-black/30 text-[10px] font-mono text-readable-muted hover:text-emerald-300 hover:border-emerald-500/30 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Rotating status */}
      <motion.div
        key={tick}
        initial={reducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/15 bg-emerald-500/5"
      >
        <SignalIcon className={`w-3.5 h-3.5 shrink-0 ${signal.tone}`} />
        <p className="text-[10px] font-mono text-readable-muted">
          <span className={signal.tone}>{signal.label}</span> · {signal.value} · drag the core to orbit
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HeroRightStage;
