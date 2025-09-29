import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Terminal } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'experience', 'certifications', 'projects', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#certifications', label: 'Certs' },
    { href: '#projects', label: 'Projects' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/90 backdrop-blur-md border-b border-cyan-500/30' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <Shield className="w-8 h-8 text-cyan-400 group-hover:text-green-400 transition-colors duration-300" />
            <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
              Soumy<span className="text-cyan-400">Sec</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`transition-all duration-300 relative group px-3 py-2 rounded-md ${
                    isActive 
                      ? 'text-cyan-400 bg-cyan-400/20 border border-cyan-400/30' 
                      : 'text-green-400 hover:text-cyan-400'
                  }`}
                  onClick={() => {
                    if ((window as any).playTypingSound) {
                      (window as any).playTypingSound();
                    }
                  }}
                >
                  <span className="relative z-10">{item.label}</span>
                  {!isActive && (
                    <span className="absolute inset-0 bg-cyan-400/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-md"></span>
                  )}
                </a>
              );
            })}
            <button className="bg-transparent border border-cyan-400 text-cyan-400 px-4 py-2 rounded-md hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>Connect</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cyan-400 hover:text-green-400 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-black/95 border border-cyan-500/30 rounded-lg backdrop-blur-md">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-green-400 hover:text-cyan-400 transition-colors duration-300 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button className="w-full bg-transparent border border-cyan-400 text-cyan-400 px-4 py-2 rounded-md hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center justify-center space-x-2 mt-4">
                <Terminal className="w-4 h-4" />
                <span>Connect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;