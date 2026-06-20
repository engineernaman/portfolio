import { useState, useEffect } from 'react';
import { Menu, X, Shield, FlaskConical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sections, profile } from '../data/portfolio';
import NavUtilities from './NavUtilities';

const Navbar = () => {
  const { playTypingSound, openIntelLab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { href: '#home', label: 'Home' },
    ...sections.map((s) => ({ href: `#${s.id}`, label: s.label })),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const ids = ['home', ...sections.map((s) => s.id)];
      const scrollPosition = window.scrollY + 120;
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-void/90 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <a href="#home" className="flex items-center gap-2 group shrink-0">
            <Shield className="w-5 h-5 text-emerald-400 group-hover:text-cyan-400 transition-colors" />
            <span className="font-display text-sm font-bold text-white">{profile.brand}</span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const id = item.href.substring(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => playTypingSound()}
                  className={`font-mono text-[10px] tracking-wide px-2.5 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-slate/60 hover:text-white hover:bg-white/5'
                  }`}
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-[10px] tracking-wide hover:bg-cyan-500/20 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Intel Lab</span>
            </button>

            <a
              href="#contact"
              className="hidden md:inline text-[10px] font-mono px-3 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
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
          <div className="lg:hidden mt-4 bg-void/95 border border-white/10 rounded-lg p-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block font-mono text-sm text-slate/70 hover:text-white py-2"
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
              className="block w-full text-left font-mono text-sm text-cyan-400 py-2"
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
