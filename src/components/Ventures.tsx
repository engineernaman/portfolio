import SectionHeader from './ui/SectionHeader';
import CyberPanel from './ui/CyberPanel';
import { ventures } from '../data/portfolio';

const Ventures = () => (
  <section id="ventures" className="py-20 md:py-28 relative">
    <div className="container mx-auto px-6 max-w-6xl">
      <SectionHeader
        number="03"
        title="Entrepreneurship & Advisory"
        subtitle="Founding cybersecurity initiatives and strategic technology leadership."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {ventures.map((v, i) => (
          <CyberPanel key={v.company} glow={i === 0 ? 'green' : 'cyan'} className="p-8 group">
            <p className="font-cyber text-[10px] tracking-widest text-matrix uppercase mb-2">
              {v.category}
            </p>
            <h3 className="font-display text-2xl font-bold text-white group-hover:text-neon transition-colors">
              {v.company}
            </h3>
            <p className="text-sm text-gray-500 font-cyber mt-1">{v.title} · {v.period}</p>
            <p className="prose-cyber text-sm mt-4">{v.description}</p>
            <ul className="space-y-2 mt-6">
              {v.highlights.map((h) => (
                <li key={h} className="text-sm text-readable-muted flex gap-2 font-body leading-relaxed">
                  <span className="text-neon">▸</span> {h}
                </li>
              ))}
            </ul>
            {v.impact && (
              <p className="text-xs font-cyber text-matrix/60 border-t border-neon/10 pt-4 mt-4">
                {v.impact}
              </p>
            )}
          </CyberPanel>
        ))}
      </div>
    </div>
  </section>
);

export default Ventures;
