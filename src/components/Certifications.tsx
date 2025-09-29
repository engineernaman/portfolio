import React, { useState } from 'react';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';

const Certifications = () => {
  const [hoveredCert, setHoveredCert] = useState<number | null>(null);

  const certifications = [
    {
      name: 'CISSP',
      fullName: 'Certified Information Systems Security Professional',
      issuer: 'ISC²',
      year: '2023',
      status: 'Active',
      credentialId: 'CISSP-123456',
      description: 'Advanced cybersecurity certification covering 8 domains of security',
      logo: '🛡️',
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'CEH',
      fullName: 'Certified Ethical Hacker',
      issuer: 'EC-Council',
      year: '2022',
      status: 'Active',
      credentialId: 'CEH-789012',
      description: 'Ethical hacking and penetration testing certification',
      logo: '🎯',
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'OSCP',
      fullName: 'Offensive Security Certified Professional',
      issuer: 'Offensive Security',
      year: '2021',
      status: 'Active',
      credentialId: 'OSCP-345678',
      description: 'Hands-on penetration testing certification',
      logo: '💀',
      color: 'from-gray-500 to-red-500'
    },
    {
      name: 'AWS Security',
      fullName: 'AWS Certified Security - Specialty',
      issuer: 'Amazon Web Services',
      year: '2023',
      status: 'Active',
      credentialId: 'AWS-901234',
      description: 'Cloud security specialization for AWS platform',
      logo: '☁️',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      name: 'GCIH',
      fullName: 'GIAC Certified Incident Handler',
      issuer: 'SANS Institute',
      year: '2022',
      status: 'Active',
      credentialId: 'GCIH-567890',
      description: 'Incident handling and computer forensics',
      logo: '🚨',
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'CISSP',
      fullName: 'CompTIA Security+',
      issuer: 'CompTIA',
      year: '2020',
      status: 'Active',
      credentialId: 'SEC+-123456',
      description: 'Foundation-level security certification',
      logo: '🔐',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="certifications" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional <span className="text-cyan-400">Certifications</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Continuous learning and professional development through industry-recognized certifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredCert(index)}
              onMouseLeave={() => setHoveredCert(null)}
            >
              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-6 transition-all duration-300 hover:border-cyan-400 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{cert.logo}</div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">{cert.status}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{cert.fullName}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{cert.issuer}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{cert.year}</span>
                  </div>
                </div>

                <div className={`w-full h-1 bg-gradient-to-r ${cert.color} rounded-full mb-4`}></div>

                {hoveredCert === index && (
                  <div className="absolute inset-0 bg-black/95 border border-cyan-400 rounded-lg p-6 z-10 transition-all duration-300">
                    <div className="text-3xl mb-4">{cert.logo}</div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">{cert.name}</h3>
                    <p className="text-sm text-gray-300 mb-4">{cert.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="text-green-400">
                        <strong>Issuer:</strong> {cert.issuer}
                      </div>
                      <div className="text-purple-400">
                        <strong>Year:</strong> {cert.year}
                      </div>
                      <div className="text-yellow-400">
                        <strong>ID:</strong> {cert.credentialId}
                      </div>
                    </div>
                    <button className="mt-4 flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors duration-300">
                      <ExternalLink className="w-4 h-4" />
                      <span>Verify Certificate</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Complete Certification Profile</h3>
            <p className="text-gray-300 mb-6">
              View my complete certification portfolio and verification details on LinkedIn
            </p>
            <a
              href="https://linkedin.com/in/soumysec"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5" />
              <span>View on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;