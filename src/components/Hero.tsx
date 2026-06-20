import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Code, Shield, Zap } from 'lucide-react';

const Hero = () => {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pointer-events-none">
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-lines opacity-30" />
      </div>

      <motion.div
        className="container mx-auto px-6 text-center relative z-10"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="mb-8">
          <p className="text-coral/80 font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Scroll to walk the security lifecycle
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white glitch-text neon-text" data-text="SOUMY NAMAN SRIVASTAVA">
            SOUMY NAMAN
            <br />
            <span className="text-coral hologram-text">SRIVASTAVA</span>
          </h1>
          <motion.div
            className="text-xl md:text-2xl text-violet mb-6 font-mono"
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            Securing Systems, Empowering Minds
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              |
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12"
        >
          {[
            { icon: Shield, label: 'Cyber Security Lead', border: 'border-cyan-500/30', color: 'text-coral' },
            { icon: Code, label: '9+ Years Experience', border: 'border-green-500/30', color: 'text-violet' },
            { icon: Zap, label: 'DevSecOps Expert', border: 'border-purple-500/30', color: 'text-purple-400' },
          ].map(({ icon: Icon, label, border, color }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`flex items-center space-x-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border ${border}`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-white">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p variants={item} className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Penetration Testing • Cloud Security • Digital Forensics • DevSecOps
          <br />
          Drag the 3D nodes behind you — push, pull, explore the security journey
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pointer-events-auto"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cyber-button bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full font-semibold glow-effect inline-block circuit-border"
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cyber-button border border-coral/40 text-violet px-8 py-3 rounded-full font-semibold hover:bg-violet hover:text-black transition-all duration-300 inline-block"
          >
            Contact Me
          </motion.a>
        </motion.div>

        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-coral hover:text-violet transition-colors pointer-events-auto"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
