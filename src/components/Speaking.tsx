import { Mic, Users, Monitor, Gavel, Radio, ExternalLink } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import CyberPanel from './ui/CyberPanel';
import SpeakingGalleryCanvas from './three/SpeakingGalleryCanvas';
import {
  speakingEvents,
  speakingAudiences,
  judgingHighlights,
  speakingTopics,
} from '../data/portfolio';
import { SPEAKING_VIDEOS } from '../data/speakingMedia';

const Speaking = () => (
  <section id="speaking" className="py-20 md:py-28 relative section-readable">
    <div className="container mx-auto px-6 max-w-6xl">
      <SectionHeader
        number="04"
        title="Speaking & Stage"
        subtitle="ISS World Europe & MEA, live keynotes to thousands, competition judge."
      />

      <CyberPanel glow="cyan" className="p-4 sm:p-6 mb-10">
        <p className="label-cyber mb-4">Stage Gallery</p>
        <SpeakingGalleryCanvas />
      </CyberPanel>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {SPEAKING_VIDEOS.map((vid) => (
          <a
            key={vid.url}
            href={vid.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-cyan-500/25 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors group"
          >
            <Radio className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{vid.title}</p>
              <p className="text-[10px] text-slate/50 font-mono">{vid.date} · LinkedIn</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate/40 group-hover:text-cyan-400" />
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {speakingEvents.map((evt) => (
          <CyberPanel key={evt.event} glow="cyan" className="p-6">
            <div className="flex items-start gap-4">
              <Mic className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <p className="label-cyber mb-2">{evt.role}</p>
                <h3 className="font-display text-xl font-bold text-readable">{evt.event}</h3>
                <p className="text-base text-readable-muted mt-2 font-body leading-relaxed">{evt.highlight}</p>
              </div>
            </div>
          </CyberPanel>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {speakingAudiences.map((aud) => (
          <CyberPanel key={aud.label} glow="green" className="p-6 text-center">
            {aud.icon === 'live' ? (
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            ) : (
              <Monitor className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            )}
            <div className="font-display text-3xl font-bold text-readable">{aud.size}</div>
            <p className="label-cyber mt-2">{aud.label}</p>
          </CyberPanel>
        ))}
      </div>

      <p className="text-xs text-readable-dim font-body mt-4 max-w-2xl">
        Stage attendance at ISS World and international keynotes — distinct from 2M+ global content and training reach.
      </p>

      <CyberPanel glow="magenta" className="p-6 mb-8">
        <div className="flex items-start gap-4">
          <Gavel className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <h3 className="label-cyber mb-3">Competition Judge</h3>
            <ul className="space-y-2">
              {judgingHighlights.map((j) => (
                <li key={j} className="text-base text-readable-muted font-body flex gap-2 leading-relaxed">
                  <span className="text-rose-400 shrink-0">▸</span>
                  {j}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CyberPanel>

      <CyberPanel glow="cyan" className="p-6">
        <h3 className="label-cyber mb-4">Topics</h3>
        <div className="flex flex-wrap gap-2">
          {speakingTopics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1.5 text-xs font-mono rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-300/90"
            >
              {topic}
            </span>
          ))}
        </div>
      </CyberPanel>
    </div>
  </section>
);

export default Speaking;
