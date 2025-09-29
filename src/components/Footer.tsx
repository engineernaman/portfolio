import React from 'react';
import { Shield, Terminal, Github, Linkedin, Twitter, Mail, ExternalLink, Heart, Code } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Publications', href: '#publications' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];

  const resources = [
    { name: 'Security Blog', href: 'https://soumysec.dev/blog' },
    { name: 'CTF Writeups', href: 'https://github.com/soumysec/ctf-writeups' },
    { name: 'Security Tools', href: 'https://github.com/soumysec/security-tools' },
    { name: 'Training Materials', href: 'https://soumysec.dev/training' }
  ];

  const socialLinks = [
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/in/soumysec', 
      label: 'LinkedIn',
      color: 'hover:text-blue-400'
    },
    { 
      icon: Github, 
      href: 'https://github.com/soumysec', 
      label: 'GitHub',
      color: 'hover:text-gray-300'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/soumysec', 
      label: 'Twitter',
      color: 'hover:text-cyan-400'
    },
    { 
      icon: Mail, 
      href: 'mailto:soumy.naman@protonmail.com', 
      label: 'Email',
      color: 'hover:text-green-400'
    }
  ];

  const certifications = [
    'CISSP', 'CEH', 'OSCP', 'AWS Security', 'GCIH', 'Security+'
  ];

  return (
    <footer className="bg-black border-t border-cyan-500/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-bg"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6 group">
                <Shield className="w-8 h-8 text-cyan-400 group-hover:text-green-400 transition-colors duration-300" />
                <span className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                  Soumy<span className="text-cyan-400">Sec</span>
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Cybersecurity professional dedicated to securing digital infrastructure and empowering the next generation of security experts.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-green-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-sm">9+ Years Experience</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-400">
                  <Code className="w-4 h-4" />
                  <span className="text-sm">DevSecOps Expert</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Resources</h3>
              <ul className="space-y-3">
                {resources.map((resource) => (
                  <li key={resource.name}>
                    <a
                      href={resource.href}
                      className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center space-x-2 group"
                    >
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{resource.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Certifications */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Connect</h3>
              
              {/* Social Links */}
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`p-2 rounded-full bg-black/40 border border-cyan-500/30 hover:border-cyan-400 text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded text-cyan-400"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal-style divider */}
        <div className="border-t border-cyan-500/30">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>© {currentYear} Soumy Naman Srivastava</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">All rights reserved</span>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                  Privacy Policy
                </a>
                <span className="text-gray-600">•</span>
                <a href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                  Terms of Service
                </a>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>and</span>
                <Terminal className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Glitch effect line */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
      </div>

      <style jsx>{`
        .matrix-bg {
          background: linear-gradient(90deg, transparent 24%, rgba(0, 255, 65, 0.02) 25%, rgba(0, 255, 65, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, 0.02) 75%, rgba(0, 255, 65, 0.02) 76%, transparent 77%, transparent);
          background-size: 20px 20px;
          width: 100%;
          height: 100%;
          animation: matrix-move 20s linear infinite;
        }

        @keyframes matrix-move {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(100px); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;