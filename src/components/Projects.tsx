import React, { useState } from 'react';
import { Github, ExternalLink, Code, Database, Shield, Cloud, Terminal, Eye } from 'lucide-react';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: 'SecureVault Pro',
      category: 'DevSecOps',
      description: 'Enterprise-grade security orchestration platform with automated vulnerability management and real-time threat detection.',
      longDescription: 'A comprehensive security platform that integrates with CI/CD pipelines to provide continuous security monitoring, automated vulnerability scanning, and intelligent threat response. Built with microservices architecture and containerized deployment.',
      technologies: ['Python', 'Docker', 'Kubernetes', 'Redis', 'PostgreSQL', 'React'],
      features: [
        'Real-time vulnerability scanning',
        'Automated threat response',
        'CI/CD pipeline integration',
        'Custom rule engine',
        'Advanced reporting dashboard'
      ],
      github: 'https://github.com/soumysec/securevault-pro',
      demo: 'https://securevault-demo.com',
      status: 'Production',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      stats: { stars: 234, forks: 67, users: '1.2k+' }
    },
    {
      id: 2,
      title: 'PentestOS',
      category: 'Penetration Testing',
      description: 'Custom Linux distribution optimized for penetration testing with automated reconnaissance and exploitation frameworks.',
      longDescription: 'A specialized penetration testing operating system built on Debian with custom tools, automated reconnaissance scripts, and an integrated exploitation framework. Includes custom vulnerability databases and reporting tools.',
      technologies: ['Linux', 'Bash', 'Python', 'C++', 'Assembly', 'Ruby'],
      features: [
        'Automated reconnaissance suite',
        'Custom exploitation frameworks',
        'Integrated reporting system',
        'Steganography tools',
        'Network analysis utilities'
      ],
      github: 'https://github.com/soumysec/pentestos',
      demo: 'https://pentestos-live.com',
      status: 'Beta',
      icon: Terminal,
      color: 'from-red-500 to-orange-500',
      stats: { stars: 567, forks: 123, users: '3.4k+' }
    },
    {
      id: 3,
      title: 'CloudShield',
      category: 'Cloud Security',
      description: 'Multi-cloud security monitoring and compliance automation platform with ML-powered threat detection.',
      longDescription: 'Advanced cloud security platform that provides unified security monitoring across AWS, Azure, and GCP. Features machine learning-based anomaly detection, automated compliance checking, and real-time threat intelligence.',
      technologies: ['Go', 'Terraform', 'AWS', 'Azure', 'GCP', 'TensorFlow'],
      features: [
        'Multi-cloud monitoring',
        'ML-powered threat detection',
        'Compliance automation',
        'Cost optimization analysis',
        'Infrastructure as Code security'
      ],
      github: 'https://github.com/soumysec/cloudshield',
      demo: 'https://cloudshield-demo.com',
      status: 'Production',
      icon: Cloud,
      color: 'from-purple-500 to-pink-500',
      stats: { stars: 890, forks: 234, users: '5.7k+' }
    },
    {
      id: 4,
      title: 'ForensicTrace',
      category: 'Digital Forensics',
      description: 'Advanced digital forensics toolkit with blockchain evidence integrity and AI-powered analysis capabilities.',
      longDescription: 'Comprehensive digital forensics platform that combines traditional forensic analysis with modern blockchain technology for evidence integrity and AI-powered pattern recognition for faster case resolution.',
      technologies: ['Python', 'Blockchain', 'TensorFlow', 'OpenCV', 'SQLite', 'FastAPI'],
      features: [
        'Blockchain evidence integrity',
        'AI-powered pattern analysis',
        'Timeline reconstruction',
        'Memory dump analysis',
        'Mobile device forensics'
      ],
      github: 'https://github.com/soumysec/forensictrace',
      demo: 'https://forensictrace-demo.com',
      status: 'Production',
      icon: Database,
      color: 'from-green-500 to-teal-500',
      stats: { stars: 445, forks: 89, users: '2.1k+' }
    },
    {
      id: 5,
      title: 'VulnScanner Elite',
      category: 'Vulnerability Assessment',
      description: 'Next-generation vulnerability scanner with zero-day detection and automated exploitation validation.',
      longDescription: 'State-of-the-art vulnerability scanning platform that goes beyond traditional signature-based detection to identify zero-day vulnerabilities using behavioral analysis and automated exploitation validation.',
      technologies: ['Rust', 'Python', 'PostgreSQL', 'Redis', 'Vue.js', 'WebAssembly'],
      features: [
        'Zero-day vulnerability detection',
        'Automated exploitation validation',
        'Custom payload generation',
        'Distributed scanning architecture',
        'Real-time collaboration tools'
      ],
      github: 'https://github.com/soumysec/vulnscanner-elite',
      demo: 'https://vulnscanner-demo.com',
      status: 'Beta',
      icon: Eye,
      color: 'from-yellow-500 to-orange-500',
      stats: { stars: 723, forks: 156, users: '4.2k+' }
    },
    {
      id: 6,
      title: 'SecureAPI Gateway',
      category: 'API Security',
      description: 'High-performance API security gateway with ML-based threat detection and automated policy enforcement.',
      longDescription: 'Enterprise API security solution that provides comprehensive protection for REST and GraphQL APIs with machine learning-based threat detection, rate limiting, and automated security policy enforcement.',
      technologies: ['Node.js', 'Redis', 'MongoDB', 'Docker', 'GraphQL', 'ML'],
      features: [
        'ML-based threat detection',
        'GraphQL security analysis',
        'Dynamic rate limiting',
        'API behavior analytics',
        'Automated policy generation'
      ],
      github: 'https://github.com/soumysec/secure-api-gateway',
      demo: 'https://secureapi-demo.com',
      status: 'Production',
      icon: Code,
      color: 'from-indigo-500 to-blue-500',
      stats: { stars: 612, forks: 134, users: '3.8k+' }
    }
  ];

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="text-cyan-400">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Cutting-edge security tools and platforms developed to address modern cybersecurity challenges
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-black/40 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-500 group hover:scale-105 cursor-pointer"
              onClick={() => setSelectedProject(selectedProject === index ? null : index)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${project.color} bg-opacity-20`}>
                    <project.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'Production' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-green-400 mb-3">{project.category}</p>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded text-purple-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 text-xs text-cyan-400">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>⭐ {project.stats.stars}</span>
                    <span>🍴 {project.stats.forks}</span>
                    <span>👥 {project.stats.users}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <a
                    href={project.github}
                    className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </a>
                  <a
                    href={project.demo}
                    className="flex items-center space-x-2 text-green-400 hover:text-white transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Demo</span>
                  </a>
                </div>

                {selectedProject === index && (
                  <div className="mt-6 pt-6 border-t border-cyan-500/30">
                    <p className="text-gray-300 mb-4">{project.longDescription}</p>
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {project.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                            <span className="text-green-400">▶</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded text-cyan-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/soumysec"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300"
          >
            <Github className="w-5 h-5" />
            <span>View All Projects on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;