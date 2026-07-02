import { Trophy, Star, Award } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import CyberPanel from './ui/CyberPanel';
import { recognition } from '../data/portfolio';

const Recognition = () => (
  <section id="recognition" className="py-20 md:py-28 relative section-readable">
    <div className="container mx-auto px-6 max-w-6xl">
      <SectionHeader
        number="07"
        title="Recognition & Rankings"
        subtitle="Conference stages, global rankings, competition judging, and community impact."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recognition.map((item, i) => (
          <CyberPanel
            key={item.title}
            glow={i % 3 === 0 ? 'green' : i % 3 === 1 ? 'cyan' : 'magenta'}
            className="p-5 group"
          >
            <div className="mb-3">
              {i % 3 === 0 ? (
                <Trophy className="w-5 h-5 text-emerald-400" />
              ) : i % 3 === 1 ? (
                <Star className="w-5 h-5 text-matrix" />
              ) : (
                <Award className="w-5 h-5 text-accent" />
              )}
            </div>
            <h3 className="font-display text-sm font-bold text-readable group-hover:text-emerald-400 transition-colors leading-snug">
              {item.title}
            </h3>
            <p className="label-cyber mt-2">{item.source}</p>
          </CyberPanel>
        ))}
      </div>
    </div>
  </section>
);

export default Recognition;
