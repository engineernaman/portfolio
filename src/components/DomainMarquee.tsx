import { professionalIdentity } from '../data/portfolio';

const DomainMarquee = () => (
  <div className="relative z-20 border-y border-white/10 bg-[rgba(10,14,22,0.88)] overflow-hidden py-3.5 pointer-events-none">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...professionalIdentity, ...professionalIdentity].map((item, i) => (
        <span key={i} className="mx-6 text-xs tracking-wide text-readable-dim uppercase font-mono">
          {item}
          <span className="mx-6 text-emerald-500/30">·</span>
        </span>
      ))}
    </div>
  </div>
);

export default DomainMarquee;
