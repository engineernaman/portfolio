import { ExternalLink, BookOpen } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import CyberPanel from './ui/CyberPanel';
import { publications, researchAreas } from '../data/portfolio';

const Research = () => (
  <section id="research" className="py-20 md:py-28 relative">
    <div className="container mx-auto px-6 max-w-6xl">
      <SectionHeader
        number="05"
        title="Research & Publications"
        subtitle="Published research and active exploration across AI security, telecom, cloud, and threat detection."
      />

      {publications.map((pub) => (
        <CyberPanel key={pub.doi} glow="green" className="p-8 mb-10">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-snug">
                {pub.title}
              </h3>
              <p className="text-sm text-cyan-400 mt-2 font-mono">{pub.journal}</p>
              <p className="label-cyber mt-1">{pub.year}</p>
            </div>
          </div>
          <p className="prose-cyber mb-4">{pub.abstract}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {pub.keywords.map((k) => (
              <span
                key={k}
                className="text-[10px] font-cyber px-2 py-1 border border-neon/30 text-neon rounded"
              >
                {k}
              </span>
            ))}
          </div>
          <a
            href={pub.doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-cyber text-xs text-matrix hover:text-neon transition-colors"
          >
            DOI: {pub.doi} <ExternalLink className="w-3 h-3" />
          </a>
        </CyberPanel>
      ))}

      <div className="grid md:grid-cols-2 gap-6">
        {researchAreas.map((area, i) => (
          <CyberPanel key={area.title} glow={i % 2 === 0 ? 'cyan' : 'green'} className="p-6">
            <h4 className="font-display text-lg font-bold text-white mb-4 text-neon">{area.title}</h4>
            <ul className="space-y-2">
              {area.topics.map((t) => (
                <li key={t} className="text-sm text-readable-muted flex gap-2 font-body leading-relaxed">
                  <span className="text-matrix">▸</span> {t}
                </li>
              ))}
            </ul>
          </CyberPanel>
        ))}
      </div>
    </div>
  </section>
);

export default Research;
