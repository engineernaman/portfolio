import { experiences } from '../data/portfolio';

const InteractiveTimeline = () => (
  <div>
    <h3 className="font-display text-xl font-bold text-slate mb-8 text-center">Career Timeline</h3>
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyber/40 via-neural/30 to-chain/40 md:-translate-x-1/2" />
      <div className="space-y-8">
        {experiences.map((exp, i) => (
          <div
            key={`${exp.company}-${exp.period}`}
            className={`relative flex items-center gap-6 md:gap-0 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
              <p className="font-mono text-[10px] text-cyber tracking-wider">{exp.period}</p>
              <h4 className="font-display text-lg font-bold text-slate mt-1">{exp.title}</h4>
              <p className="text-sm text-mist mt-1">{exp.company}</p>
              <p className="text-xs text-mist/60 mt-1">{exp.location}</p>
            </div>
            <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-cyber border-2 border-void md:-translate-x-1/2 z-10" />
            <div className="flex-1 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default InteractiveTimeline;
