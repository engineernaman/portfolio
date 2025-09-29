import React, { useState } from 'react';
import { Building, Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const Experience = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const experiences = [
    {
      title: 'Cyber Security Lead',
      company: 'Global Tech Solutions',
      period: '2023 - Present',
      location: 'Remote',
      logo: '🛡️',
      description: 'Leading cybersecurity initiatives for a Fortune 500 technology company, managing a team of security professionals and implementing enterprise-wide security strategies.',
      achievements: [
        'Reduced security incidents by 85% through proactive threat hunting',
        'Implemented zero-trust architecture across 500+ endpoints',
        'Led incident response for critical security breaches',
        'Established DevSecOps practices reducing deployment vulnerabilities by 70%'
      ],
      technologies: ['AWS Security', 'Kubernetes', 'Splunk', 'Terraform', 'Docker', 'Python'],
      website: 'https://globaltech.com'
    },
    {
      title: 'DevSecOps Engineer',
      company: 'CloudSec Innovations',
      period: '2021 - 2023',
      location: 'San Francisco, CA',
      logo: '☁️',
      description: 'Integrated security into CI/CD pipelines and managed cloud security infrastructure for multiple client engagements.',
      achievements: [
        'Automated security testing in CI/CD reducing manual effort by 90%',
        'Designed secure container orchestration architecture',
        'Implemented infrastructure as code security best practices',
        'Conducted security training for 200+ developers'
      ],
      technologies: ['Jenkins', 'GitLab CI', 'AWS', 'Azure', 'Ansible', 'HashiCorp Vault'],
      website: 'https://cloudsec.com'
    },
    {
      title: 'Senior Security Consultant',
      company: 'CyberGuard Corp',
      period: '2019 - 2021',
      location: 'New York, NY',
      logo: '🔒',
      description: 'Conducted comprehensive security assessments for Fortune 500 companies, specializing in web application and network penetration testing.',
      achievements: [
        'Performed 150+ penetration tests across various industries',
        'Identified critical vulnerabilities saving clients $2M+ in potential losses',
        'Developed custom exploitation tools for complex scenarios',
        'Mentored junior security consultants'
      ],
      technologies: ['Burp Suite', 'Metasploit', 'Nessus', 'Wireshark', 'Python', 'Bash'],
      website: 'https://cyberguard.com'
    },
    {
      title: 'Penetration Tester',
      company: 'SecureNet Technologies',
      period: '2017 - 2019',
      location: 'Austin, TX',
      logo: '🎯',
      description: 'Specialized in web application security testing and vulnerability assessment for mid-size enterprises.',
      achievements: [
        'Conducted 80+ web application security assessments',
        'Developed automated testing scripts reducing testing time by 60%',
        'Created comprehensive security reports for C-level executives',
        'Achieved 100% client satisfaction rating'
      ],
      technologies: ['OWASP Top 10', 'SQL Injection', 'XSS', 'CSRF', 'SAST', 'DAST'],
      website: 'https://securenet.com'
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional <span className="text-cyan-400">Experience</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto"></div>
        </div>

        <div className="grid gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-black/40 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="text-4xl">{exp.logo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                        {exp.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-green-400">
                        <Building className="w-4 h-4" />
                        <span>{exp.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end space-y-2">
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-400">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{exp.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-full text-green-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={exp.website}
                    className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="flex items-center space-x-2 text-green-400 hover:text-cyan-400 transition-colors duration-300"
                  >
                    <span>{expandedCard === index ? 'Less Details' : 'More Details'}</span>
                    {expandedCard === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {expandedCard === index && (
                  <div className="mt-6 pt-6 border-t border-cyan-500/30">
                    <h4 className="text-lg font-bold text-white mb-4">Key Achievements</h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start space-x-2 text-gray-300">
                          <span className="text-green-400 mt-1">▶</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;