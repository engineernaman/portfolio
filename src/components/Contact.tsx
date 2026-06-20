import { useState } from 'react';
import { Send, Mail, MapPin, Linkedin, Github } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import VisitorPulse from './VisitorPulse';
import { sendVisitorPulse } from '../lib/visitorIntel';
import { useApp } from '../context/AppContext';
import { profile, social, ventures, professionalIdentity } from '../data/portfolio';

const Contact = () => {
  const { setVisitorProfile } = useApp();
  const [terminalMode, setTerminalMode] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    `${profile.brand} Terminal`,
    'Type "help" for available commands',
    '> ',
  ]);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const terminalCommands: Record<string, () => string[] | void> = {
    help: () => [
      'Available commands:',
      '  contact  - Show contact information',
      '  domains  - Professional identity domains',
      '  ventures - Entrepreneurship & advisory',
      '  clear    - Clear terminal',
      '  exit     - Exit terminal mode',
    ],
    contact: () => [
      `Email: ${profile.email}`,
      'Location: India · Global engagements',
      `LinkedIn: ${social.linkedin} (${social.linkedinFollowers} followers)`,
      `GitHub: ${social.github}`,
    ],
    domains: () => professionalIdentity.map((d) => `· ${d}`),
    ventures: () => ventures.map((v) => `${v.company} — ${v.title}`),
    clear: () => {
      setTerminalHistory([`${profile.brand} Terminal`, 'Type "help" for available commands', '> ']);
    },
    exit: () => {
      setTerminalMode(false);
      return ['Exiting terminal mode...'];
    },
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = terminalInput.toLowerCase().trim();
    const newHistory = [...terminalHistory];
    newHistory[newHistory.length - 1] = `> ${terminalInput}`;

    const handler = terminalCommands[command];
    if (handler) {
      const result = handler();
      if (result) newHistory.push(...result);
    } else if (command) {
      newHistory.push(`Unknown command: ${command}`);
    }
    newHistory.push('> ');
    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pulse = await sendVisitorPulse('contact_form', { name: formData.name, email: formData.email });
    setVisitorProfile(pulse);
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-10">
          <VisitorPulse />
        </div>

        <SectionHeader
          number="08"
          title="Get In Touch"
          subtitle="Now that you've seen what a perimeter sees — let's talk security, research, training, or speaking."
        />

        <div className="grid lg:grid-cols-2 gap-10 mt-10">
          <div className="space-y-6">
            <div className="cyber-panel p-6 rounded-xl">
              <h3 className="font-display text-lg font-bold text-readable mb-4">Contact</h3>
              <div className="space-y-4 text-base text-readable-muted font-body">
                <a href={social.email} className="flex items-center gap-3 hover:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" /> {profile.email}
                </a>
                <p className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" /> India · Global engagements
                </p>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-cyan-400 shrink-0" />
                  LinkedIn · {social.linkedinFollowers} followers
                </a>
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-cyan-400 transition-colors"
                >
                  <Github className="w-4 h-4 text-cyan-400 shrink-0" /> GitHub
                </a>
              </div>
            </div>

            <button
              onClick={() => setTerminalMode(!terminalMode)}
              className="font-mono text-xs tracking-widest text-readable-dim hover:text-emerald-400 transition-colors"
            >
              {terminalMode ? '← Standard mode' : '→ Terminal mode'}
            </button>

            {terminalMode && (
              <div className="p-4 border border-emerald-500/20 rounded-xl bg-black/60 font-mono text-xs text-readable-muted h-64 overflow-y-auto">
                {terminalHistory.map((line, i) => (
                  <div key={i} className="mb-1">{line}</div>
                ))}
                <form onSubmit={handleTerminalSubmit} className="flex gap-2 mt-2">
                  <input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-readable"
                    autoFocus
                  />
                </form>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="cyber-panel p-6 rounded-xl space-y-4">
            <h3 className="font-display text-lg font-bold text-readable mb-2">Send Message</h3>
            {['name', 'email', 'subject'].map((field) => (
              <input
                key={field}
                type={field === 'email' ? 'email' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/12 rounded-lg text-readable text-base font-body placeholder:text-readable-dim focus:border-emerald-500/50 outline-none transition-colors"
              />
            ))}
            <textarea
              placeholder="Message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-white/12 rounded-lg text-readable text-base font-body placeholder:text-readable-dim focus:border-emerald-500/50 outline-none transition-colors resize-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-void font-body text-sm font-semibold rounded-md hover:bg-emerald-400 transition-colors"
            >
              <Send className="w-4 h-4" /> Send via Email
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
