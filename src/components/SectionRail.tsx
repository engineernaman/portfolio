import { sections } from '../data/portfolio';

const RAIL_ITEMS = [
  { id: 'home', label: 'Home' },
  ...sections.map((s) => ({ id: s.id, label: s.label })),
];

type SectionRailProps = {
  activeSection: string;
};

const SectionRail = ({ activeSection }: SectionRailProps) => (
  <nav
    className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2 pointer-events-auto"
    aria-label="Section progress"
  >
    {RAIL_ITEMS.map((item) => {
      const isActive = activeSection === item.id;
      return (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="group relative flex items-center justify-end"
          aria-label={item.label}
          aria-current={isActive ? 'true' : undefined}
        >
          <span
            className={`absolute right-6 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none border border-white/10 bg-[rgba(8,12,18,0.95)] text-emerald-300/90 ${
              isActive ? 'opacity-100 translate-x-0' : ''
            }`}
          >
            {item.label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              isActive
                ? 'w-2.5 h-2.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                : 'w-1.5 h-1.5 bg-white/20 group-hover:bg-white/45 group-hover:scale-125'
            }`}
          />
        </a>
      );
    })}
  </nav>
);

export default SectionRail;
