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
                <p className="font-mono text-[10px] tracking-widest text-emerald-400/80 uppercase mb-2">
                  {evt.role}
                </p>
                <h3 className="font-display text-xl font-bold text-white">{evt.event}</h3>
                <p className="text-sm text-slate/60 mt-2 font-body">{evt.highlight}</p>
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
            <div className="font-display text-3xl font-bold text-white">{aud.size}</div>
            <p className="font-mono text-[10px] tracking-widest text-slate/50 mt-2 uppercase">{aud.label}</p>
          </CyberPanel>
        ))}
      </div>

      <CyberPanel glow="magenta" className="p-6 mb-8">
        <div className="flex items-start gap-4">
          <Gavel className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <h3 className="font-mono text-xs tracking-widest text-slate/50 uppercase mb-3">
              Competition Judge
            </h3>
            <ul className="space-y-2">
              {judgingHighlights.map((j) => (
                <li key={j} className="text-sm text-slate/70 font-body flex gap-2">
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
          <h3 className="font-mono text-xs tracking-widest text-slate/50 uppercase">Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {speakingTopics.map((topic) => (
            <span
              key={topic}
              className="font-mono text-[10px] px-2.5 py-1 border border-white/10 text-slate/70 rounded-md bg-white/[0.02]"
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
