import SectionHeader from './ui/SectionHeader';
import SkillsRadar from './SkillsRadar';
import InteractiveTimeline from './InteractiveTimeline';
import CyberPanel from './ui/CyberPanel';
import {
  executiveSummary,
  professionalIdentity,
  skillDomains,
  certificationCategories,
  profile,
} from '../data/portfolio';

const levelColor: Record<string, string> = {
  EXPERT: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  ADVANCED: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  INTERMEDIATE: 'text-slate/70 border-white/10 bg-white/5',
};

const About = () => {
  const radarSkills = skillDomains.slice(0, 6).map((s, i) => ({
    name: s.name.split(' ')[0],
    level: s.level === 'EXPERT' ? 95 : s.level === 'ADVANCED' ? 82 : 70,
    color: i % 2 === 0 ? '#00ff41' : '#00ffff',
  }));

  return (
    <section id="about" className="py-20 md:py-28 relative section-readable">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeader number="01" title="Executive Profile" subtitle={profile.mission} />

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <CyberPanel glow="green" className="p-6">
            <div className="prose-cyber space-y-4">
              {executiveSummary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="text-emerald-400 font-medium border-l-2 border-emerald-500/40 pl-4">{profile.brandStatement}</p>
            </div>
          </CyberPanel>

          <CyberPanel glow="cyan" className="p-6">
            <h3 className="font-cyber text-xs tracking-[0.3em] text-matrix uppercase mb-4">
              Domain Matrix
            </h3>
            <div className="flex flex-wrap gap-2">
              {professionalIdentity.map((item) => (
                <span
                  key={item}
                  className="font-cyber text-[10px] tracking-wider px-2 py-1 border border-neon/30 text-neon rounded hover:bg-neon/10 transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </CyberPanel>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="font-mono text-[10px] tracking-widest text-slate/50 uppercase mb-4">
              Skill Levels
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {skillDomains.map((skill) => (
                <CyberPanel key={skill.name} glow="green" className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-300 font-mono">{skill.name}</span>
                    <span
                      className={`font-cyber text-[9px] tracking-widest px-2 py-1 border rounded ${levelColor[skill.level]}`}
                    >
                      {skill.level}
                    </span>
                  </div>
                </CyberPanel>
              ))}
            </div>
          </div>

          <CyberPanel glow="cyan" className="p-4">
            <h3 className="font-cyber text-xs tracking-widest text-matrix uppercase mb-4 text-center">
              Radar
            </h3>
            <SkillsRadar skills={radarSkills} />
          </CyberPanel>
        </div>

        <CyberPanel glow="magenta" className="p-6 mb-12">
          <h3 className="font-cyber text-xs tracking-[0.3em] text-accent uppercase mb-4">
            75+ Certifications — Highlights
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certificationCategories.map((cat) => (
              <div key={cat.name} className="border border-white/5 p-3 rounded bg-black/30">
                <p className="font-cyber text-[10px] text-neon mb-2">{cat.name}</p>
                <div className="flex flex-wrap gap-1">
                  {cat.items.slice(0, 4).map((c) => (
                    <span key={c} className="text-[9px] text-gray-500 font-mono">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CyberPanel>

        <InteractiveTimeline />
      </div>
    </section>
  );
};

export default About;
