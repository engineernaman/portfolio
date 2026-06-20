import { Mic, Users, Monitor, Gavel, Radio } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import CyberPanel from './ui/CyberPanel';
import {
  speakingEvents,
  speakingAudiences,
  judgingHighlights,
  speakingTopics,
} from '../data/portfolio';

const Speaking = () => (
  <section id="speaking" className="py-20 md:py-28 relative">
    <div className="container mx-auto px-6 max-w-6xl">
      <SectionHeader
        number="04"
        title="Speaking & Stage"
        subtitle="ISS World Europe & MEA, live keynotes to thousands, competition judge."
      />

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
                  <span className="text-emerald-400/80">·</span> {j}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CyberPanel>

      <CyberPanel glow="cyan" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Radio className="w-5 h-5 text-cyan-400/80" />
          <h3 className="label-cyber">Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {speakingTopics.map((topic) => (
            <span
              key={topic}
              className="text-xs px-2.5 py-1.5 border border-white/12 text-readable-muted rounded-md bg-white/[0.04] font-body"
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
