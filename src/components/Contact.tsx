import React, { useState, useEffect } from 'react';
import { Send, Lock, Download, MessageSquare, Mail, Phone, MapPin, Linkedin, Github, Twitter } from 'lucide-react';

const Contact = () => {
  const [terminalMode, setTerminalMode] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'SoumySec Terminal v2.0.1',
    'Type "help" for available commands',
    '> '
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [encryptMode, setEncryptMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    encrypted: false
  });

  const terminalCommands = {
    help: () => [
      'Available commands:',
      '  contact    - Show contact information',
      '  encrypt    - Enable encrypted messaging',
      '  skills     - Display technical skills',
      '  projects   - List recent projects',
      '  social     - Show social media links',
      '  clear      - Clear terminal',
      '  exit       - Exit terminal mode'
    ],
    contact: () => [
      '📧 Email: soumy.naman@protonmail.com',
      '📱 Phone: +1 (555) 123-4567',
      '🌍 Location: Remote / San Francisco, CA',
      '💼 LinkedIn: linkedin.com/in/soumysec',
      '🐙 GitHub: github.com/soumysec'
    ],
    encrypt: () => {
      setEncryptMode(true);
      return ['🔒 Encrypted messaging mode enabled', 'Your messages will be PGP encrypted'];
    },
    skills: () => [
      '🛡️  Penetration Testing     ████████████ 95%',
      '☁️  Cloud Security         ████████████ 88%',
      '🔧 DevSecOps              ████████████ 90%',
      '🔍 Digital Forensics      ████████████ 85%',
      '🏗️  Security Architecture  ████████████ 92%',
      '⚡ Incident Response      ████████████ 89%'
    ],
    projects: () => [
      '1. SecureVault Pro - Enterprise Security Platform',
      '2. PentestOS - Custom Penetration Testing Distribution',
      '3. CloudShield - Multi-cloud Security Monitoring',
      '4. ForensicTrace - Advanced Digital Forensics Toolkit',
      '5. VulnScanner Elite - Next-gen Vulnerability Scanner'
    ],
    social: () => [
      '🔗 LinkedIn: https://linkedin.com/in/soumysec',
      '🐙 GitHub: https://github.com/soumysec',
      '🐦 Twitter: https://twitter.com/soumysec',
      '📝 Blog: https://soumysec.dev/blog',
      '🎥 YouTube: https://youtube.com/c/soumysec'
    ],
    clear: () => {
      setTerminalHistory(['SoumySec Terminal v2.0.1', 'Type "help" for available commands', '> ']);
      return [];
    },
    exit: () => {
      setTerminalMode(false);
      return ['Exiting terminal mode...'];
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = terminalInput.toLowerCase().trim();
    const newHistory = [...terminalHistory];
    newHistory[newHistory.length - 1] = `> ${terminalInput}`;
    
    if (terminalCommands[command as keyof typeof terminalCommands]) {
      const output = terminalCommands[command as keyof typeof terminalCommands]();
      newHistory.push(...output, '> ');
    } else if (command) {
      newHistory.push(`Command not found: ${command}. Type "help" for available commands.`, '> ');
    } else {
      newHistory.push('> ');
    }
    
    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { ...formData, encrypted: encryptMode });
    // Reset form or show success message
    alert('Message sent successfully! I\'ll get back to you soon.');
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'soumy.naman@protonmail.com',
      link: 'mailto:soumy.naman@protonmail.com',
      color: 'text-cyan-400'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'text-green-400'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA / Remote',
      link: null,
      color: 'text-purple-400'
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/soumysec',
      color: 'text-blue-400'
    },
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/soumysec',
      color: 'text-gray-400'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      url: 'https://twitter.com/soumysec',
      color: 'text-cyan-400'
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get In <span className="text-cyan-400">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Ready to secure your digital infrastructure? Let's discuss how we can work together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Let's Connect</h3>
            
            {/* Contact Methods */}
            <div className="space-y-6 mb-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex items-center space-x-4 group">
                  <div className={`p-3 rounded-full bg-black/40 border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300`}>
                    <method.icon className={`w-6 h-6 ${method.color}`} />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">{method.label}</div>
                    {method.link ? (
                      <a
                        href={method.link}
                        className={`${method.color} hover:text-white transition-colors duration-300 font-medium`}
                      >
                        {method.value}
                      </a>
                    ) : (
                      <div className={`${method.color} font-medium`}>{method.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-white mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`p-3 rounded-full bg-black/40 border border-cyan-500/30 hover:border-cyan-400 ${social.color} hover:text-white transition-all duration-300 hover:scale-110`}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Terminal Mode Toggle */}
            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white mb-3">🚀 Terminal Interface</h4>
              <p className="text-gray-300 mb-4">
                Prefer a command-line interface? Switch to terminal mode for a hacker-style interaction.
              </p>
              <button
                onClick={() => setTerminalMode(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black px-4 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch Terminal</span>
              </button>
            </div>

            {/* Download vCard */}
            <div className="mt-6">
              <button className="flex items-center space-x-2 text-purple-400 hover:text-white transition-colors duration-300">
                <Download className="w-4 h-4" />
                <span>Download vCard</span>
              </button>
            </div>
          </div>

          {/* Contact Form or Terminal */}
          <div>
            {terminalMode ? (
              <div className="bg-black border border-green-500 rounded-lg overflow-hidden font-mono">
                <div className="bg-green-500 text-black px-4 py-2 flex items-center justify-between">
                  <span>SoumySec Terminal</span>
                  <button
                    onClick={() => setTerminalMode(false)}
                    className="text-black hover:text-red-600 transition-colors duration-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 h-96 overflow-y-auto text-green-400 text-sm">
                  {terminalHistory.map((line, index) => (
                    <div key={index} className={line.startsWith('>') ? 'text-cyan-400' : ''}>
                      {line}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleTerminalSubmit} className="border-t border-green-500/30">
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="w-full bg-transparent text-green-400 px-4 py-2 outline-none font-mono"
                    placeholder="Enter command..."
                    autoFocus
                  />
                </form>
              </div>
            ) : (
              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Send Message</h3>
                  <button
                    onClick={() => setEncryptMode(!encryptMode)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-300 ${
                      encryptMode
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:border-green-500/30'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>{encryptMode ? 'Encrypted' : 'Standard'}</span>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message {encryptMode && <span className="text-green-400">(Will be PGP encrypted)</span>}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors duration-300 resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>{encryptMode ? 'Send Encrypted Message' : 'Send Message'}</span>
                  </button>
                </form>

                {encryptMode && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Your message will be encrypted using my PGP public key before transmission.</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;