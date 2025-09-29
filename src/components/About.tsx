import React from 'react';
import { Shield, Code, Database, Cloud, Search, Lock } from 'lucide-react';
import SkillsRadar from './SkillsRadar';
import InteractiveTimeline from './InteractiveTimeline';

const About = () => {
  const skills = [
    { name: 'Penetration Testing', level: 95, icon: Shield, color: 'text-red-400' },
    { name: 'DevSecOps', level: 90, icon: Code, color: 'text-blue-400' },
    { name: 'Cloud Security', level: 88, icon: Cloud, color: 'text-cyan-400' },
    { name: 'Digital Forensics', level: 85, icon: Search, color: 'text-green-400' },
    { name: 'Security Architecture', level: 92, icon: Lock, color: 'text-purple-400' },
    { name: 'Vulnerability Assessment', level: 94, icon: Database, color: 'text-yellow-400' }
  ];

  const radarSkills = [
    { name: 'Penetration Testing', level: 95, color: '#ef4444' },
    { name: 'DevSecOps', level: 90, color: '#3b82f6' },
    { name: 'Cloud Security', level: 88, color: '#06b6d4' },
    { name: 'Digital Forensics', level: 85, color: '#10b981' },
    { name: 'Security Architecture', level: 92, color: '#8b5cf6' },
    { name: 'Vulnerability Assessment', level: 94, color: '#f59e0b' }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-cyan-400">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Security Professional</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              With over 9 years of experience in cybersecurity, I specialize in protecting digital infrastructure 
              through comprehensive security assessments, penetration testing, and DevSecOps implementations. 
              My expertise spans across cloud security, digital forensics, and security architecture design.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              I'm passionate about bridging the gap between security and development teams, ensuring that security 
              is integrated from the ground up rather than being an afterthought. My approach combines technical 
              expertise with strategic thinking to deliver robust security solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              {['CISSP', 'CEH', 'OSCP', 'AWS Security', 'GCIH', 'SANS'].map((cert) => (
                <span key={cert} className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Skills Radar</h3>
            <SkillsRadar skills={radarSkills} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Core Competencies</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <skill.icon className={`w-5 h-5 ${skill.color}`} />
                      <span className="text-white font-medium">{skill.name}</span>
                    </div>
                    <span className="text-cyan-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full transition-all duration-1000 ease-out group-hover:from-green-400 group-hover:to-cyan-400"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Interactive Career Timeline</h3>
          <InteractiveTimeline />
        </div>
      </div>
    </section>
  );
};

export default About;