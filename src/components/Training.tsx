import React, { useState, useEffect } from 'react';
import { GraduationCap, Users, Star, ChevronLeft, ChevronRight, Award, BookOpen } from 'lucide-react';

const Training = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const trainingSessions = [
    {
      institution: 'Stanford University',
      program: 'Advanced Cybersecurity Workshop Series',
      topic: 'Cloud Security Architecture & Zero Trust Implementation',
      duration: '3 months',
      participants: 150,
      rating: 4.9,
      year: '2023',
      type: 'University Workshop',
      description: 'Comprehensive training program covering advanced cloud security concepts, zero-trust architecture design, and hands-on implementation strategies.',
      outcomes: [
        '95% participant satisfaction rate',
        '87% knowledge retention after 6 months',
        '23 published capstone projects',
        'Industry partnership program launched'
      ],
      testimonials: [
        {
          name: 'Dr. Sarah Mitchell',
          role: 'Professor of Computer Science',
          feedback: 'Exceptional depth of knowledge and practical insights. Students were highly engaged throughout the program.'
        }
      ],
      image: '🎓',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      institution: 'MIT OpenCourseWare',
      program: 'Digital Forensics Specialization',
      topic: 'Advanced Digital Forensics & Incident Response',
      duration: '6 weeks',
      participants: 300,
      rating: 4.8,
      year: '2023',
      type: 'Online Course',
      description: 'In-depth exploration of digital forensics methodologies, incident response procedures, and hands-on analysis of real-world case studies.',
      outcomes: [
        '92% course completion rate',
        '89% certification success rate',
        '45 industry connections made',
        'Open-source tool contributions'
      ],
      testimonials: [
        {
          name: 'Mark Thompson',
          role: 'Cybersecurity Analyst',
          feedback: 'The practical labs and real-world scenarios were invaluable. Applied techniques immediately in my role.'
        }
      ],
      image: '🔍',
      color: 'from-green-500 to-teal-500'
    },
    {
      institution: 'SANS Institute',
      program: 'Penetration Testing Workshop',
      topic: 'Advanced Penetration Testing & Ethical Hacking',
      duration: '5 days',
      participants: 75,
      rating: 4.9,
      year: '2022',
      type: 'Intensive Workshop',
      description: 'Hands-on penetration testing bootcamp covering advanced exploitation techniques, report writing, and remediation strategies.',
      outcomes: [
        '100% practical exercise completion',
        '78% achieved certification',
        '34 new security tools introduced',
        'Industry mentorship program established'
      ],
      testimonials: [
        {
          name: 'Jennifer Lee',
          role: 'Security Consultant',
          feedback: 'Outstanding practical experience. The lab environments were incredibly realistic and challenging.'
        }
      ],
      image: '🎯',
      color: 'from-red-500 to-orange-500'
    },
    {
      institution: 'Carnegie Mellon University',
      program: 'DevSecOps Integration Seminar',
      topic: 'Security Integration in CI/CD Pipelines',
      duration: '2 weeks',
      participants: 120,
      rating: 4.7,
      year: '2022',
      type: 'Graduate Seminar',
      description: 'Advanced seminar on integrating security practices into DevOps workflows, covering automation, monitoring, and compliance.',
      outcomes: [
        '88% implementation success rate',
        '91% reported improved security posture',
        '15 open-source contributions',
        'Cross-industry collaboration network'
      ],
      testimonials: [
        {
          name: 'David Chen',
          role: 'DevOps Engineer',
          feedback: 'Transformed our entire approach to security in development. Practical and immediately applicable.'
        }
      ],
      image: '⚙️',
      color: 'from-purple-500 to-pink-500'
    },
    {
      institution: 'Black Hat Conference',
      program: 'Advanced Threat Hunting',
      topic: 'AI-Powered Threat Detection & Response',
      duration: '2 days',
      participants: 200,
      rating: 4.8,
      year: '2021',
      type: 'Conference Training',
      description: 'Cutting-edge training on AI and machine learning applications in cybersecurity threat detection and automated response systems.',
      outcomes: [
        '96% rated as highly valuable',
        '82% implemented new techniques',
        '27 research collaborations initiated',
        'Industry adoption of presented methods'
      ],
      testimonials: [
        {
          name: 'Rebecca Martinez',
          role: 'Threat Intelligence Analyst',
          feedback: 'Cutting-edge content that pushed the boundaries of traditional threat hunting. Exceptional expertise demonstrated.'
        }
      ],
      image: '🤖',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const totalStats = {
    institutions: 5,
    totalParticipants: trainingSessions.reduce((sum, session) => sum + session.participants, 0),
    averageRating: (trainingSessions.reduce((sum, session) => sum + session.rating, 0) / trainingSessions.length).toFixed(1),
    totalHours: 480
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trainingSessions.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isAutoPlaying, trainingSessions.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % trainingSessions.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + trainingSessions.length) % trainingSessions.length);
    setIsAutoPlaying(false);
  };

  const currentSession = trainingSessions[currentSlide];

  return (
    <section id="training" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Training & <span className="text-cyan-400">Mentorship</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Sharing knowledge and expertise through comprehensive training programs and mentorship initiatives
          </p>
        </div>

        {/* Training Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-6 text-center">
            <GraduationCap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-cyan-400 mb-2">{totalStats.institutions}</div>
            <div className="text-gray-300">Institutions</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-400 mb-2">{totalStats.totalParticipants}+</div>
            <div className="text-gray-300">Participants</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-yellow-400 mb-2">{totalStats.averageRating}</div>
            <div className="text-gray-300">Avg Rating</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
            <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-400 mb-2">{totalStats.totalHours}+</div>
            <div className="text-gray-300">Hours</div>
          </div>
        </div>

        {/* Training Carousel */}
        <div className="relative bg-black/40 border border-cyan-500/30 rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={`text-6xl`}>{currentSession.image}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{currentSession.program}</h3>
                  <p className="text-cyan-400 font-semibold">{currentSession.institution}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span>{currentSession.year}</span>
                    <span>•</span>
                    <span>{currentSession.duration}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded text-green-400">
                      {currentSession.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">{currentSession.participants}</div>
                  <div className="text-sm text-gray-400">Participants</div>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-yellow-400">{currentSession.rating}</span>
                  </div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Training Focus</h4>
                <h5 className="text-lg text-cyan-400 mb-3">{currentSession.topic}</h5>
                <p className="text-gray-300 mb-6">{currentSession.description}</p>

                <h4 className="text-lg font-bold text-white mb-3">Key Outcomes</h4>
                <ul className="space-y-2">
                  {currentSession.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-gray-300">
                      <Award className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Participant Feedback</h4>
                {currentSession.testimonials.map((testimonial, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
                    <p className="text-gray-300 mb-4 italic">"{testimonial.feedback}"</p>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-cyan-400">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between p-6 border-t border-cyan-500/30">
            <button
              onClick={prevSlide}
              className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {trainingSessions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'bg-cyan-400' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors duration-300"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Interested in Training or Mentorship?</h3>
            <p className="text-gray-300 mb-6">
              I offer customized training programs and mentorship opportunities for individuals and organizations
            </p>
            <button className="bg-gradient-to-r from-green-500 to-cyan-500 text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Training;