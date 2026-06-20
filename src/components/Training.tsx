import { Globe, GraduationCap, Building2 } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import CyberPanel from './ui/CyberPanel';
import { globalTraining } from '../data/portfolio';

const Training = () => (
  <section id="training" className="py-20 md:py-28 relative">
    <div className="container mx-auto px-6 max-w-6xl">
      <SectionHeader
        number="06"
        title="Global Training & Government"
        subtitle="Cybersecurity capacity building across six countries — national governments, academies, and enterprise programs."
      />

      <CyberPanel glow="cyan" className="p-6 mb-10">
        <div className="flex items-start gap-4">
          <Building2 className="w-6 h-6 text-cyan-400 shrink-0" />
          <div>
            <h3 className="font-cyber text-xs tracking-[0.3em] text-neon uppercase mb-3">
              Government & Public Sector Clients
            </h3>
            <p className="text-base text-readable-muted font-body leading-relaxed">
              {globalTraining.governmentSummary}
            </p>
          </div>
        </div>
      </CyberPanel>

      <div className="flex flex-wrap gap-2 mb-10">
        {globalTraining.countries.map((country) => (
          <span
            key={country}
            className="font-cyber text-[10px] tracking-wider px-4 py-2 border border-neon/40 text-neon bg-neon/5 rounded hover:bg-neon/15 transition-colors"
          >
            {country}
          </span>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {globalTraining.engagements.map((eng) => (
          <CyberPanel key={eng.title} glow="green" className="p-6">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-neon shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-lg font-bold text-white">{eng.title}</h3>
                <p className="font-cyber text-[10px] text-matrix tracking-wider mt-1">{eng.org}</p>
                <p className="prose-cyber text-sm mt-3">{eng.description}</p>
              </div>
            </div>
          </CyberPanel>
        ))}
      </div>

      <CyberPanel glow="cyan" className="p-6 mt-8 flex items-center gap-4">
        <Globe className="w-8 h-8 text-matrix shrink-0" />
        <p className="prose-cyber text-sm">
          Programs delivered: Penetration Testing · Security Operations · SIEM Engineering · SDR ·
          Automotive Security · Digital Forensics · Threat Hunting · Bug Bounty — for government,
          enterprise, and university audiences worldwide.
        </p>
      </CyberPanel>
    </div>
  </section>
);

export default Training;
