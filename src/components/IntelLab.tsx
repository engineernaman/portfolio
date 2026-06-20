import { useState } from 'react';
import { X, Shield, Search, Link2, Fingerprint, Copy, Check, Share2 } from 'lucide-react';
import {
  decodeBase64,
  decodeHex,
  decodeUrl,
  decodeJwtHeader,
  extractIocs,
  identifyHash,
  analyzePhishUrl,
} from '../lib/intelTools';

type Tab = 'decode' | 'phish' | 'ioc' | 'hash';

interface IntelLabProps {
  open: boolean;
  onClose: () => void;
}

const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
  { id: 'decode', label: 'Decoder', icon: Shield },
  { id: 'phish', label: 'Phish Radar', icon: Link2 },
  { id: 'ioc', label: 'IOC Harvest', icon: Search },
  { id: 'hash', label: 'Hash ID', icon: Fingerprint },
];

const levelColors = {
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  critical: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
};

const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1.5 rounded border border-white/10 text-slate/50 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

const IntelLab = ({ open, onClose }: IntelLabProps) => {
  const [tab, setTab] = useState<Tab>('decode');
  const [decodeInput, setDecodeInput] = useState('');
  const [phishInput, setPhishInput] = useState('');
  const [iocInput, setIocInput] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [shared, setShared] = useState(false);

  if (!open) return null;

  const phish = phishInput ? analyzePhishUrl(phishInput) : null;
  const iocs = iocInput ? extractIocs(iocInput) : null;
  const hashType = hashInput.trim() ? identifyHash(hashInput) : null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#0a0e14]/95 shadow-[0_0_80px_rgba(52,211,153,0.08)]"
        role="dialog"
        aria-labelledby="intel-lab-title"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-400/70 uppercase">
              SoumySec · Interactive Tool
            </p>
            <h2 id="intel-lab-title" className="font-display text-lg font-bold text-white">
              Threat Intel Lab
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-white/10 text-slate/60 hover:text-white hover:border-white/20 transition-colors"
            aria-label="Close Intel Lab"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] tracking-wide whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          {tab === 'decode' && (
            <>
              <p className="text-xs text-slate/50 font-mono">
                Paste encoded strings — Base64, Hex, URL encoding, or JWT headers. All processing runs locally in your browser.
              </p>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Paste encoded data here..."
                rows={4}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-sm text-slate font-mono outline-none focus:border-emerald-500/40 resize-none"
              />
              {decodeInput && (
                <div className="space-y-3">
                  {[
                    { label: 'Base64', value: decodeBase64(decodeInput) },
                    { label: 'Hex', value: decodeHex(decodeInput) },
                    { label: 'URL Decode', value: decodeUrl(decodeInput) },
                    { label: 'JWT Header', value: decodeJwtHeader(decodeInput) },
                  ].map((row) => (
                    <div key={row.label} className="rounded-lg border border-white/[0.06] bg-black/30 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-emerald-400/80 uppercase tracking-wider">
                          {row.label}
                        </span>
                        <CopyBtn text={row.value} />
                      </div>
                      <pre className="text-xs text-slate/80 font-mono whitespace-pre-wrap break-all">{row.value}</pre>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'phish' && (
            <>
              <p className="text-xs text-slate/50 font-mono">
                Analyze suspicious URLs for phishing patterns — homographs, credential lures, risky TLDs, and brand impersonation.
              </p>
              <input
                value={phishInput}
                onChange={(e) => setPhishInput(e.target.value)}
                placeholder="https://suspicious-link.example/login-verify..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-sm text-slate font-mono outline-none focus:border-emerald-500/40"
              />
              {phish && (
                <div className="space-y-3">
                  <div className={`flex items-center gap-4 p-4 rounded-lg border ${levelColors[phish.level]}`}>
                    <div className="font-mono text-3xl font-bold tabular-nums">{phish.score}</div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider">Risk Score</p>
                      <p className="font-display text-lg font-bold capitalize">{phish.level} risk</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {phish.flags.map((flag) => (
                      <li key={flag} className="text-xs font-mono text-slate/70 flex gap-2">
                        <span className="text-emerald-400/60">▸</span> {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {tab === 'ioc' && (
            <>
              <p className="text-xs text-slate/50 font-mono">
                Paste logs, reports, or paste dumps — extract IPs, emails, URLs, domains, and hashes instantly.
              </p>
              <textarea
                value={iocInput}
                onChange={(e) => setIocInput(e.target.value)}
                placeholder="Paste threat intel text, log excerpts, or report content..."
                rows={5}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-sm text-slate font-mono outline-none focus:border-emerald-500/40 resize-none"
              />
              {iocs && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {(
                    [
                      ['IPv4', iocs.ipv4],
                      ['Emails', iocs.emails],
                      ['URLs', iocs.urls],
                      ['Domains', iocs.domains],
                      ['MD5', iocs.md5],
                      ['SHA-256', iocs.sha256],
                    ] as const
                  ).map(([label, items]) => (
                    <div key={label} className="rounded-lg border border-white/[0.06] bg-black/30 p-3">
                      <p className="font-mono text-[10px] text-cyan-400/80 uppercase tracking-wider mb-2">
                        {label} ({items.length})
                      </p>
                      {items.length === 0 ? (
                        <p className="text-xs text-slate/40 font-mono">None found</p>
                      ) : (
                        <ul className="space-y-1 max-h-24 overflow-y-auto">
                          {items.map((item) => (
                            <li key={item} className="text-xs font-mono text-slate/70 break-all">{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'hash' && (
            <>
              <p className="text-xs text-slate/50 font-mono">
                Identify hash type by length and charset — MD5, SHA-1, SHA-256, SHA-512 fingerprinting.
              </p>
              <input
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Paste hash value..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-sm text-slate font-mono outline-none focus:border-emerald-500/40"
              />
              {hashType && (
                <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                  <p className="font-mono text-[10px] text-emerald-400/70 uppercase tracking-wider mb-1">
                    Identified Type
                  </p>
                  <p className="font-display text-2xl font-bold text-white">{hashType}</p>
                  <p className="text-xs text-slate/50 font-mono mt-2">
                    Length: {hashInput.trim().length} chars · Charset: hexadecimal
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-slate/40">
            100% client-side · No data sent to servers
          </p>
          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}#intel-lab`;
              navigator.clipboard.writeText(url);
              setShared(true);
              setTimeout(() => setShared(false), 2000);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-emerald-500/25 text-emerald-400/80 font-mono text-[10px] hover:bg-emerald-500/10 transition-colors"
          >
            {shared ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
            {shared ? 'Link copied' : 'Share tool'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntelLab;
