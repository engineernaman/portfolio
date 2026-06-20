import { motion } from 'framer-motion';
import { ChevronDown, Shield, Code, Zap, ArrowRight } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import GlassPanel from '../ui/GlassPanel';
import TextReveal from '../ui/TextReveal';

const pageStyle = { height: '100vh', width: '100%' };

const JourneyOverlay = () => (
  <div className="w-full text-white">
    {/* PAGE 1 — HERO */}
    <section style={pageStyle} className="flex flex-col items-center justify-center px-6 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-5xl"
      >
        <motion.p
          className="font-mono text-coral/80 text-xs md:text-sm tracking-[0.5em] uppercase mb-6"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Immersive Security Experience
        </motion.p>

        <h1 className="text-6xl md:text-[8rem] font-black leading-[0.9] tracking-tighter mb-6">
          <span className="block bg-gradient-to-r from-white via-cyan-200 to-green-300 bg-clip-text text-transparent">
            SOUMY
          </span>
          <span className="block bg-gradient-to-r from-coral via-green-400 to-purple-400 bg-clip-text text-transparent">
            NAMAN
          </span>
        </h1>

        <TextReveal
          text="Cybersecurity architect walking the line between offense and defense"
          className="text-lg md:text-2xl text-gray-300/90 font-light max-w-2xl mx-auto mb-10"
          delay={0.4}
        />

        <div className="flex flex-wrap justify-center gap-4 mb-12 pointer-events-auto">
          <MagneticButton href="#journey-projects">Enter the Grid</MagneticButton>
          <MagneticButton href="#journey-contact" variant="ghost">
            Connect
          </MagneticButton>
        </div>

        <motion.div
          className="flex justify-center gap-6 text-sm font-mono text-violet/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { icon: Shield, text: 'Security Lead' },
            { icon: Code, text: '9+ Years' },
            { icon: Zap, text: 'DevSecOps' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4" /> {text}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 flex flex-col items-center gap-2 text-coral/60"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-mono text-xs tracking-widest">SCROLL TO FLY</span>
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>

    {/* PAGE 2 — ABOUT */}
    <section id="journey-about" style={pageStyle} className="flex items-center justify-center px-6">
      <GlassPanel className="max-w-3xl w-full">
        <p className="font-mono text-coral text-xs tracking-[0.4em] uppercase mb-4">01 / About</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <TextReveal text="I secure systems before attackers find them" />
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          9+ years across penetration testing, cloud security, digital forensics, and DevSecOps.
          Watch the skill orbit spin around you as you scroll — each node is a domain I live in.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { val: '150+', label: 'Pentests' },
            { val: '95%', label: 'Incident Reduction' },
            { val: '500+', label: 'Endpoints Secured' },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ scale: 1.05, borderColor: 'rgba(0,255,255,0.5)' }}
              className="text-center p-4 rounded-xl border border-white/10 bg-black/40"
            >
              <div className="text-2xl md:text-3xl font-bold text-coral">{s.val}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </section>

    {/* PAGE 3 — LIFECYCLE */}
    <section style={pageStyle} className="flex items-center justify-center px-6">
      <GlassPanel className="max-w-3xl w-full">
        <p className="font-mono text-violet text-xs tracking-[0.4em] uppercase mb-4">02 / Lifecycle</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <TextReveal text="Walk the attack lifecycle in 3D" />
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Recon → Assess → Exploit → Remediate → Secure. Each floating node is draggable —
          push them, pull them, break the simulation. This is how I think about defense.
        </p>
        <div className="flex flex-wrap gap-3">
          {['Recon', 'Assess', 'Exploit', 'Remediate', 'Secure'].map((stage, i) => (
            <motion.span
              key={stage}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="px-4 py-2 rounded-full border border-coral/40/30 text-violet font-mono text-sm bg-violet/5"
            >
              {stage}
            </motion.span>
          ))}
        </div>
      </GlassPanel>
    </section>

    {/* PAGE 4 — PROJECTS */}
    <section id="journey-projects" style={pageStyle} className="flex items-center justify-center px-6">
      <GlassPanel className="max-w-4xl w-full">
        <p className="font-mono text-purple-400 text-xs tracking-[0.4em] uppercase mb-4">03 / Projects</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          <TextReveal text="Tools that hunt threats in the wild" />
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'SecureVault Pro', tag: 'Enterprise Security' },
            { name: 'PentestOS', tag: 'Custom Distro' },
            { name: 'CloudShield', tag: 'Multi-Cloud' },
            { name: 'ForensicTrace', tag: 'DFIR Toolkit' },
          ].map((p, i) => (
            <motion.a
              key={p.name}
              href="#projects"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, x: 8 }}
              transition={{ delay: i * 0.08 }}
              className="group flex items-center justify-between p-5 rounded-xl border border-white/10 bg-black/50 hover:border-violet/40/40 transition-colors pointer-events-auto"
            >
              <div>
                <div className="font-bold text-white group-hover:text-coral transition-colors">{p.name}</div>
                <div className="text-sm text-gray-500">{p.tag}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-coral opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </GlassPanel>
    </section>

    {/* PAGE 5 — EXPERIENCE */}
    <section style={pageStyle} className="flex items-center justify-center px-6">
      <GlassPanel className="max-w-3xl w-full">
        <p className="font-mono text-coral text-xs tracking-[0.4em] uppercase mb-4">04 / Experience</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <TextReveal text="From pentester to security lead" />
        </h2>
        <div className="space-y-4">
          {[
            { role: 'Cyber Security Lead', co: 'Global Tech Solutions', year: '2023–Now' },
            { role: 'DevSecOps Engineer', co: 'CloudSec Innovations', year: '2021–2023' },
            { role: 'Senior Security Consultant', co: 'CyberGuard Corp', year: '2019–2021' },
          ].map((job, i) => (
            <motion.div
              key={job.role}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex justify-between items-center p-4 rounded-lg border-l-2 border-violet/40/50 bg-white/[0.02]"
            >
              <div>
                <div className="font-semibold text-white">{job.role}</div>
                <div className="text-sm text-gray-400">{job.co}</div>
              </div>
              <span className="font-mono text-xs text-violet">{job.year}</span>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </section>

    {/* PAGE 6 — CONTACT CTA */}
    <section id="journey-contact" style={pageStyle} className="flex items-center justify-center px-6">
      <GlassPanel className="max-w-2xl w-full text-center">
        <p className="font-mono text-violet text-xs tracking-[0.4em] uppercase mb-4">05 / Connect</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <TextReveal text="Let's build something unbreakable" />
        </h2>
        <p className="text-gray-400 mb-8">
          You've flown through the grid. Ready to talk security architecture, red team ops, or DevSecOps?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
          <MagneticButton href="#contact">Get In Touch</MagneticButton>
          <MagneticButton href="#projects" variant="ghost">
            See Full Portfolio
          </MagneticButton>
        </div>
      </GlassPanel>
    </section>

    {/* TRANSITION — scroll into full content */}
    <section style={{ height: '50vh', width: '100%' }} className="flex items-end justify-center pb-12">
      <motion.p
        className="font-mono text-coral/50 text-sm tracking-[0.3em]"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ▼ FULL PORTFOLIO BELOW ▼
      </motion.p>
    </section>
  </div>
);

export default JourneyOverlay;
