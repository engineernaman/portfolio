import { Shield, Linkedin, Github, Mail } from 'lucide-react';
import { profile, social, sections } from '../data/portfolio';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-emerald-500/15 relative bg-[rgba(10,14,22,0.95)]">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="font-display font-bold text-emerald-400">{profile.brand}</span>
            </div>
            <p className="text-sm text-readable-muted font-body leading-relaxed">{profile.tagline}</p>
          </div>

          <div>
            <h4 className="label-cyber mb-4">Navigate</h4>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-readable-muted hover:text-emerald-400 transition-colors font-body"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-cyber mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-readable-dim hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-readable-dim hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a href={social.email} className="text-readable-dim hover:text-emerald-400 transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono text-readable-dim">
          <span>© {currentYear} {profile.name}</span>
          <span className="text-emerald-400/70">Secured · SoumySec</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
