import React, { useState } from 'react';
import { Trophy, Medal, Target, Zap, Crown, Star, Award, ChevronDown, ChevronUp } from 'lucide-react';

const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedAchievement, setExpandedAchievement] = useState<number | null>(null);

  const achievements = [
    {
      id: 1,
      title: 'Global CTF Championship Winner',
      category: 'competitions',
      year: '2023',
      description: 'First place in the International Cybersecurity Capture The Flag Championship',
      details: 'Led a team of 4 security professionals to victory against 200+ teams from 45 countries. Solved 23 out of 25 challenges across web exploitation, reverse engineering, cryptography, and forensics categories.',
      impact: 'Established reputation as a top-tier ethical hacker in the global cybersecurity community',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      level: 'legendary',
      points: 2500,
      skills: ['Web Exploitation', 'Reverse Engineering', 'Cryptography', 'Digital Forensics'],
      stats: {
        teams: 200,
        countries: 45,
        challenges: '23/25',
        duration: '48 hours'
      }
    },
    {
      id: 2,
      title: 'SANS Institute Hall of Fame',
      category: 'recognition',
      year: '2023',
      description: 'Inducted into SANS Institute Hall of Fame for outstanding contributions to cybersecurity education',
      details: 'Recognized for developing innovative training methodologies and contributing to the cybersecurity community through research, training, and mentorship programs.',
      impact: 'Lifetime achievement recognition from the leading cybersecurity training organization',
      icon: Trophy,
      color: 'from-purple-400 to-pink-500',
      level: 'legendary',
      points: 3000,
      skills: ['Education', 'Community Building', 'Research', 'Leadership'],
      stats: {
        trainees: '5000+',
        courses: 12,
        rating: '4.9/5',
        years: 8
      }
    },
    {
      id: 3,
      title: 'Bug Bounty Hall of Fame',
      category: 'security',
      year: '2022',
      description: 'Top 10 researcher on multiple Fortune 500 bug bounty programs',
      details: 'Discovered and responsibly disclosed 47 critical vulnerabilities across major tech companies including Google, Microsoft, Amazon, and Facebook. Total bounty earnings exceeded $150,000.',
      impact: 'Contributed to securing millions of user accounts and sensitive data worldwide',
      icon: Target,
      color: 'from-green-400 to-cyan-500',
      level: 'elite',
      points: 2200,
      skills: ['Vulnerability Research', 'Web Security', 'Mobile Security', 'API Security'],
      stats: {
        vulnerabilities: 47,
        bounty: '$150k+',
        companies: 15,
        severity: 'Critical'
      }
    },
    {
      id: 4,
      title: 'IEEE Outstanding Paper Award',
      category: 'research',
      year: '2023',
      description: 'Best paper award for "Advanced Persistent Threats in Cloud Infrastructure"',
      details: 'Research paper received the IEEE Transactions on Information Forensics and Security Outstanding Paper Award for groundbreaking work on APT detection in cloud environments.',
      impact: 'Influenced industry standards and best practices for cloud security',
      icon: Award,
      color: 'from-blue-400 to-indigo-500',
      level: 'expert',
      points: 1800,
      skills: ['Research', 'Academic Writing', 'Cloud Security', 'Machine Learning'],
      stats: {
        citations: 127,
        downloads: '2.3k',
        impact: '8.5',
        rank: '1st'
      }
    },
    {
      id: 5,
      title: 'Cybersecurity Influencer of the Year',
      category: 'recognition',
      year: '2022',
      description: 'Named Cybersecurity Influencer of the Year by InfoSec Community',
      details: 'Recognized for thought leadership, community engagement, and contributions to raising cybersecurity awareness through social media, conferences, and publications.',
      impact: 'Reached over 100,000 cybersecurity professionals with educational content',
      icon: Star,
      color: 'from-pink-400 to-red-500',
      level: 'expert',
      points: 1500,
      skills: ['Thought Leadership', 'Community Engagement', 'Content Creation', 'Public Speaking'],
      stats: {
        followers: '100k+',
        posts: 500,
        engagement: '12%',
        reach: '2M+'
      }
    },
    {
      id: 6,
      title: 'DEF CON Black Badge',
      category: 'competitions',
      year: '2021',
      description: 'Earned the prestigious DEF CON Black Badge for winning the Network Attack & Defense competition',
      details: 'Led the winning team in one of the most challenging cybersecurity competitions, demonstrating expertise in network security, incident response, and defensive strategies.',
      impact: 'Lifetime recognition and free admission to all DEF CON conferences',
      icon: Medal,
      color: 'from-gray-400 to-gray-600',
      level: 'legendary',
      points: 2800,
      skills: ['Network Security', 'Incident Response', 'Team Leadership', 'Defensive Security'],
      stats: {
        teams: 50,
        duration: '24 hours',
        attacks: '1000+',
        defense: '99.2%'
      }
    },
    {
      id: 7,
      title: 'Zero-Day Discovery Recognition',
      category: 'security',
      year: '2022',
      description: 'Discovered and reported 5 zero-day vulnerabilities in critical infrastructure systems',
      details: 'Identified previously unknown vulnerabilities in industrial control systems and IoT devices, working closely with vendors for responsible disclosure and patch development.',
      impact: 'Protected critical infrastructure from potential cyber attacks',
      icon: Zap,
      color: 'from-red-400 to-orange-500',
      level: 'elite',
      points: 2100,
      skills: ['Zero-Day Research', 'IoT Security', 'Industrial Security', 'Responsible Disclosure'],
      stats: {
        discoveries: 5,
        systems: 'Critical',
        timeline: '90 days',
        impact: 'High'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Achievements', icon: Trophy },
    { id: 'competitions', name: 'Competitions', icon: Target },
    { id: 'recognition', name: 'Recognition', icon: Award },
    { id: 'research', name: 'Research', icon: Star },
    { id: 'security', name: 'Security', icon: Zap }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const levelCounts = achievements.reduce((counts, achievement) => {
    counts[achievement.level] = (counts[achievement.level] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'legendary': return 'text-yellow-400';
      case 'elite': return 'text-purple-400';
      case 'expert': return 'text-cyan-400';
      default: return 'text-green-400';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'elite': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'expert': return 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
      default: return 'bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30';
    }
  };

  return (
    <section id="achievements" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Achievements & <span className="text-cyan-400">Recognition</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Recognition and achievements in cybersecurity competitions, research, and community contributions
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 text-center">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-yellow-400 mb-2">{levelCounts.legendary || 0}</div>
            <div className="text-gray-300">Legendary</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
            <Medal className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-400 mb-2">{levelCounts.elite || 0}</div>
            <div className="text-gray-300">Elite</div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-6 text-center">
            <Star className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-cyan-400 mb-2">{levelCounts.expert || 0}</div>
            <div className="text-gray-300">Expert</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-400 mb-2">{totalPoints.toLocaleString()}</div>
            <div className="text-gray-300">Total Points</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black'
                  : 'bg-black/40 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="bg-black/40 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${achievement.color} bg-opacity-20`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 text-xs rounded-full border ${getLevelBadge(achievement.level)} ${getLevelColor(achievement.level)} uppercase font-bold`}>
                      {achievement.level}
                    </span>
                    <span className="text-cyan-400 font-bold text-lg">+{achievement.points}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{achievement.year}</p>
                <p className="text-gray-300 mb-4">{achievement.description}</p>

                {expandedAchievement === index && (
                  <div className="mb-4 space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Details:</h4>
                      <p className="text-gray-300 text-sm">{achievement.details}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Impact:</h4>
                      <p className="text-green-400 text-sm">{achievement.impact}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Key Statistics:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(achievement.stats).map(([key, value]) => (
                          <div key={key} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded p-2">
                            <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-sm text-white font-semibold">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {achievement.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded text-green-400"
                    >
                      {skill}
                    </span>
                  ))}
                  {achievement.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs text-cyan-400">
                      +{achievement.skills.length - 3}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setExpandedAchievement(expandedAchievement === index ? null : index)}
                  className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors duration-300"
                >
                  <span>{expandedAchievement === index ? 'Show Less' : 'Show Details'}</span>
                  {expandedAchievement === index ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard Style Summary */}
        <div className="mt-12 bg-gradient-to-r from-gray-900/50 to-black/50 border border-cyan-500/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Achievement Leaderboard</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🥇</div>
              <div className="text-xl font-bold text-yellow-400 mb-1">Global Rank #1</div>
              <div className="text-gray-300">CTF Championships</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-xl font-bold text-purple-400 mb-1">Hall of Fame</div>
              <div className="text-gray-300">SANS Institute</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-xl font-bold text-green-400 mb-1">5 Zero-Days</div>
              <div className="text-gray-300">Critical Systems</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;