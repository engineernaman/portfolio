import { professionalIdentity } from '../data/portfolio';

const DomainMarquee = () => (
  <div className="relative z-20 border-y border-white/[0.06] bg-black/50 overflow-hidden py-3 pointer-events-none">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...professionalIdentity, ...professionalIdentity].map((item, i) => (
        <span key={i} className="mx-6 font-mono text-[10px] tracking-[0.2em] text-slate/50 uppercase">
          {item}
          <span className="mx-6 text-emerald-500/30">·</span>
        </span>
      ))}
    </div>
  </div>
);

export default DomainMarquee;
