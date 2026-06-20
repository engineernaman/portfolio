import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Wifi, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { isVpnRisk } from '../lib/visitorIntel';

const VisitorSessionBadge = () => {
  const { visitorProfile } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  if (!visitorProfile) return null;

  const vpnRisk = isVpnRisk(visitorProfile.vpnAssessment);

  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed bottom-6 left-6 z-40 max-w-[220px] pointer-events-auto"
        >
          <div className="rounded-xl border border-cyan-500/30 bg-[rgba(10,14,22,0.96)] backdrop-blur-md shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/8 bg-cyan-500/10">
              <span className="font-mono text-[9px] tracking-widest text-cyan-300">YOU ARE VISIBLE</span>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="text-readable-dim hover:text-readable p-0.5"
                aria-label="Hide session badge"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-mono text-xs text-readable break-all">{visitorProfile.ip}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-readable-muted font-body leading-snug">
                  {visitorProfile.location}
                </span>
              </div>
              <p
                className={`text-[10px] font-mono leading-snug ${
                  vpnRisk ? 'text-amber-400' : 'text-emerald-400/80'
                }`}
              >
                {vpnRisk ? '⚠ VPN signal' : '✓ Direct route'}
              </p>
            </div>
            <a
              href="#visitor-scan"
              className="block text-center py-2 text-[10px] font-mono text-cyan-400/80 hover:bg-white/5 border-t border-white/8"
            >
              Full telemetry →
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorSessionBadge;
