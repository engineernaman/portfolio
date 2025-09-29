import React, { useState } from 'react';
import { Calendar, MapPin, Building, Award, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  type: 'work' | 'education' | 'achievement';
  color: string;
}

const InteractiveTimeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  const timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      year: '2023',
      title: 'Cyber Security Lead',
      company: 'Global Tech Solutions',
      location: 'Remote',
      description: 'Leading cybersecurity initiatives for a Fortune 500 technology company, managing a team of security professionals.',
      achievements: [
        'Reduced security incidents by 85%',
        'Implemented zero-trust architecture',
        'Led incident response for critical breaches'
      ],
      technologies: ['AWS Security', 'Kubernetes', 'Splunk', 'Terraform'],
      type: 'work',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 2,
      year: '2021',
      title: 'DevSecOps Engineer',
      company: 'CloudSec Innovations',
      location: 'San Francisco, CA',
      description: 'Integrated security into CI/CD pipelines and managed cloud security infrastructure.',
      achievements: [
        'Automated security testing reducing manual effort by 90%',
        'Designed secure container orchestration',
        'Conducted security training for 200+ developers'
      ],
      technologies: ['Jenkins', 'GitLab CI', 'AWS', 'Azure', 'Ansible'],
      type: 'work',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 3,
      year: '2019',
      title: 'Senior Security Consultant',
      company: 'CyberGuard Corp',
      location: 'New York, NY',
      description: 'Conducted comprehensive security assessments for Fortune 500 companies.',
      achievements: [
        'Performed 150+ penetration tests',
        'Identified critical vulnerabilities saving $2M+',
        'Developed custom exploitation tools'
      ],
      technologies: ['Burp Suite', 'Metasploit', 'Nessus', 'Python'],
      type: 'work',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      year: '2017',
      title: 'Penetration Tester',
      company: 'SecureNet Technologies',
      location: 'Austin, TX',
      description: 'Specialized in web application security testing and vulnerability assessment.',
      achievements: [
        'Conducted 80+ web application assessments',
        'Developed automated testing scripts',
        'Achieved 100% client satisfaction rating'
      ],
      technologies: ['OWASP', 'SQL Injection', 'XSS', 'SAST', 'DAST'],
      type: 'work',
      color: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-green-400 to-purple-400"></div>

      <div className="space-y-8">
        {timelineEvents.map((event, index) => (
          <div
            key={event.id}
            className="relative flex items-start space-x-8 group"
            onMouseEnter={() => setHoveredEvent(event.id)}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            {/* Timeline Node */}
            <div className="relative z-10 flex-shrink-0">
              <div 
                className={`w-6 h-6 rounded-full border-4 border-black transition-all duration-300 cursor-pointer ${
                  hoveredEvent === event.id || selectedEvent === event.id
                    ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50'
                    : 'bg-gray-600'
                }`}
                onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
              >
                {/* Pulse effect */}
                {(hoveredEvent === event.id || selectedEvent === event.id) && (
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75"></div>
                )}
              </div>
              
              {/* Year Label */}
              <div className="absolute -left-2 -top-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded px-2 py-1 text-xs font-bold text-cyan-400">
                {event.year}
              </div>
            </div>

            {/* Event Card */}
            <div 
              className={`flex-1 bg-black/40 border border-cyan-500/30 rounded-lg p-6 transition-all duration-300 cursor-pointer ${
                hoveredEvent === event.id ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-400/20' : ''
              }`}
              onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4" />
                      <span className="text-green-400">{event.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight 
                  className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${
                    selectedEvent === event.id ? 'rotate-90' : ''
                  }`}
                />
              </div>

              <p className="text-gray-300 mb-4">{event.description}</p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {event.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded text-purple-400"
                  >
                    {tech}
                  </span>
                ))}
                {event.technologies.length > 4 && (
                  <span className="px-2 py-1 text-xs text-cyan-400">
                    +{event.technologies.length - 4}
                  </span>
                )}
              </div>

              {/* Expanded Content */}
              {selectedEvent === event.id && (
                <div className="mt-6 pt-6 border-t border-cyan-500/30 animate-fadeIn">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span>Key Achievements</span>
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {event.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-gray-300">
                        <span className="text-green-400 mt-1">▶</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  {event.technologies.length > 4 && (
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">All Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-sm bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded text-cyan-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InteractiveTimeline;