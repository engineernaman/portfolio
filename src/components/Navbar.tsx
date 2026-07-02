import { useState, useEffect } from 'react';
import { Menu, X, Shield, FlaskConical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sections, profile } from '../data/portfolio';
import { TOOL_PAGES, pageToHash, type SitePage } from '../data/siteNav';
import NavUtilities from './NavUtilities';

type NavbarProps = {
  activePage: SitePage;
};

const Navbar = ({ activePage }: NavbarProps) => {
  const { playTypingSound, openIntelLab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const homeNavItems = [
    { href: '#home', label: 'Home', page: 'home' as const },
    ...sections.map((s) => ({ href: `#${s.id}`, label: s.label, page: 'home' as const })),
  ];

  const toolNavItems = TOOL_PAGES.map((p) => ({
    href: p.hash,
    label: p.label,
    page: p.id,
  }));

  useEffect(() => {
    if (activePage !== 'home') return;

    const handleScroll = () => {
      const ids = ['home', ...sections.map((s) => s.id)];
      const scrollPosition = window.scrollY + 140;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const linkClass = (isActive: boolean) =>
    `font-body text-sm font-medium px-3 py-2 rounded-md transition-colors ${
      isActive
        ? 'text-readable bg-emerald-500/15 border border-emerald-500/25'
        : 'text-readable-muted hover:text-readable hover:bg-white/8'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,14,22,0.97)] backdrop-blur-lg border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="container mx-auto px-4 sm:px-6 py-2.5 max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <a href={pageToHash('home')} className="flex items-center gap-2 group shrink-0">
            <Shield className="w-5 h-5 text-emerald-400 group-hover:text-cyan-400 transition-colors" />
            <span className="font-display text-sm font-bold text-readable">{profile.brand}</span>
          </a>

          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto max-w-[52vw] scrollbar-none">
            {homeNavItems.map((item) => {
              const id = item.href.substring(1);
              const isActive = activePage === 'home' && activeSection === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => playTypingSound()}
                  className={linkClass(isActive)}
                >
                  {item.label}
                </a>
              );
            })}
            <span className="w-px h-5 bg-white/10 mx-1 shrink-0" aria-hidden />
            {toolNavItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => playTypingSound()}
                  className={`${linkClass(isActive)} shrink-0`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                openIntelLab();
                playTypingSound();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyan-500/35 bg-cyan-500/15 text-cyan-300 font-body text-xs font-medium hover:bg-cyan-500/25 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Intel Lab</span>
            </button>

            <a
              href="#visitor-scan"
              className="hidden md:inline text-xs font-body font-medium px-3 py-2 rounded-lg border border-emerald-500/25 text-emerald-300/90 hover:bg-emerald-500/15 transition-colors"
            >
              Scan me
            </a>

            <a
              href="#contact"
              className="hidden md:inline text-xs font-body font-medium px-3 py-2 rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              Contact
            </a>

            <NavUtilities />

            <button
              className="lg:hidden text-emerald-400 p-1"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-3 bg-[rgba(8,12,18,0.98)] border border-white/12 rounded-lg p-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {homeNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block font-body text-base text-readable-muted hover:text-readable py-2.5"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/60 pt-3 pb-1">Tools</p>
            {toolNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block font-body text-base text-cyan-300/90 hover:text-cyan-200 py-2.5"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                openIntelLab();
              }}
              className="block w-full text-left font-body text-base text-cyan-300 py-2.5"
            >
              Threat Intel Lab
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
