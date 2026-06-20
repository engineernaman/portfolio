import { useState } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import CyberPanel from './ui/CyberPanel';
import { experiences } from '../data/portfolio';

const Experience = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(0);

  return (
    <section id="experience" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeader
          number="02"
          title="Technology Leadership"
          subtitle="Enterprise security, telecom engineering, fintech cloud security, and global training."
        />

        <div className="space-y-4">
          {experiences.map((exp, index) => {
            const isExpanded = expandedCard === index;
            return (
              <CyberPanel
                key={`${exp.company}-${exp.period}`}
                glow={index % 2 === 0 ? 'green' : 'cyan'}
                className="overflow-hidden"
              >
                <button
                  className="w-full p-6 flex items-start justify-between gap-4 text-left"
                  onClick={() => setExpandedCard(isExpanded ? null : index)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex gap-4">
                    <span className="text-2xl">{exp.logo}</span>
                    <div>
                      <h3 className="font-display text-lg md:text-xl font-bold text-white">{exp.title}</h3>
                      <p className="text-emerald-400/90 font-mono text-xs tracking-wider mt-1">{exp.company}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-readable-dim text-xs font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-matrix" /> {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-matrix" /> {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neon shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-matrix shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-neon/10">
                    <p className="prose-cyber text-sm mt-4 mb-4">{exp.description}</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-cyber text-[10px] tracking-widest text-matrix uppercase mb-3">
                          Key Focus
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((a) => (
                            <li key={a} className="text-sm text-readable-muted flex gap-2 font-body leading-relaxed">
                              <span className="text-neon">▸</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        {exp.researchAreas && (
                          <>
                            <h4 className="font-cyber text-[10px] tracking-widest text-matrix uppercase mb-3">
                              Research
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {exp.researchAreas.map((r) => (
                                <span
                                  key={r}
                                  className="text-[10px] font-cyber px-2 py-1 border border-matrix/30 text-matrix rounded"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                        {exp.frameworks && (
                          <>
                            <h4 className="font-cyber text-[10px] tracking-widest text-matrix uppercase mb-3">
                              Frameworks
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {exp.frameworks.map((f) => (
                                <span
                                  key={f}
                                  className="text-[10px] font-cyber px-2 py-1 border border-neon/30 text-neon rounded"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                        <h4 className="font-cyber text-[10px] tracking-widest text-matrix uppercase mb-3">
                          Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-cyber px-2 py-1 bg-neon/5 text-gray-300 rounded border border-white/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CyberPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
