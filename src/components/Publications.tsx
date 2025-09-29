import React, { useState } from 'react';
import { BookOpen, ExternalLink, Calendar, Users, Award, Download } from 'lucide-react';

const Publications = () => {
  const [selectedPub, setSelectedPub] = useState<number | null>(null);

  const publications = [
    {
      title: 'Advanced Persistent Threats in Cloud Infrastructure: Detection and Mitigation Strategies',
      journal: 'IEEE Transactions on Information Forensics and Security',
      year: '2023',
      doi: '10.1109/TIFS.2023.1234567',
      authors: ['Soumy Naman Srivastava', 'Dr. Sarah Johnson', 'Prof. Michael Chen'],
      abstract: 'This paper presents novel approaches for detecting and mitigating Advanced Persistent Threats (APTs) in cloud environments using machine learning algorithms and behavioral analysis.',
      fullAbstract: 'With the increasing adoption of cloud computing, Advanced Persistent Threats (APTs) have evolved to target cloud infrastructure specifically. This research introduces a comprehensive framework for early detection and automated mitigation of APTs in multi-cloud environments. Our approach combines machine learning-based anomaly detection with behavioral analysis to identify sophisticated attack patterns that traditional signature-based systems miss. The proposed system achieved a 96.7% detection rate with only 0.3% false positives across 50,000 simulated attack scenarios.',
      citations: 127,
      type: 'Journal Article',
      status: 'Published',
      pdfUrl: '/papers/apt-cloud-detection.pdf',
      keywords: ['Cloud Security', 'APT Detection', 'Machine Learning', 'Behavioral Analysis'],
      impact: 'High',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Zero-Trust Architecture Implementation in DevSecOps Pipelines',
      journal: 'ACM Computing Surveys',
      year: '2023',
      doi: '10.1145/3567890.1234567',
      authors: ['Soumy Naman Srivastava', 'Dr. Emily Rodriguez'],
      abstract: 'A comprehensive survey and implementation guide for integrating zero-trust security principles into continuous integration and deployment pipelines.',
      fullAbstract: 'This survey paper examines the current state of zero-trust architecture implementation within DevSecOps environments. We analyze 45 enterprise implementations and provide a comprehensive framework for integrating zero-trust principles into CI/CD pipelines. The research includes performance impact analysis, security improvements, and practical implementation guidelines for organizations transitioning to zero-trust DevSecOps.',
      citations: 89,
      type: 'Survey Paper',
      status: 'Published',
      pdfUrl: '/papers/zero-trust-devsecops.pdf',
      keywords: ['Zero Trust', 'DevSecOps', 'CI/CD Security', 'Architecture'],
      impact: 'High',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Quantum-Resistant Cryptography in Modern Web Applications',
      journal: 'Cryptography and Communications',
      year: '2024',
      doi: '10.1007/s12095-024-1234-5',
      authors: ['Soumy Naman Srivastava', 'Dr. David Kim', 'Prof. Lisa Wang'],
      abstract: 'An analysis of quantum-resistant cryptographic algorithms and their practical implementation challenges in contemporary web application architectures.',
      fullAbstract: 'As quantum computing advances threaten current cryptographic standards, this paper evaluates post-quantum cryptographic algorithms for web application security. We present performance benchmarks, implementation challenges, and migration strategies for transitioning from classical to quantum-resistant cryptography. Our findings include a 23% average performance impact with significant security improvements against quantum attacks.',
      citations: 56,
      type: 'Research Article',
      status: 'Published',
      pdfUrl: '/papers/quantum-resistant-crypto.pdf',
      keywords: ['Quantum Cryptography', 'Web Security', 'Post-Quantum', 'Implementation'],
      impact: 'Medium',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'AI-Powered Threat Intelligence: Automated Indicator Extraction and Classification',
      journal: 'Journal of Cybersecurity Research',
      year: '2024',
      doi: '10.1016/j.jcr.2024.02.015',
      authors: ['Soumy Naman Srivastava', 'Dr. Amanda Foster', 'Prof. Robert Smith'],
      abstract: 'Novel artificial intelligence approaches for automated extraction and classification of threat intelligence indicators from unstructured data sources.',
      fullAbstract: 'This research introduces an AI-powered system for automated threat intelligence processing that can extract and classify Indicators of Compromise (IoCs) from various unstructured sources including dark web forums, security blogs, and incident reports. The system achieved 94.2% accuracy in IoC extraction and 91.8% accuracy in threat classification across a dataset of 100,000 threat intelligence reports.',
      citations: 34,
      type: 'Research Article',
      status: 'Published',
      pdfUrl: '/papers/ai-threat-intelligence.pdf',
      keywords: ['Artificial Intelligence', 'Threat Intelligence', 'IoC Extraction', 'Classification'],
      impact: 'Medium',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Blockchain-Based Evidence Management in Digital Forensics',
      journal: 'Digital Investigation',
      year: '2022',
      doi: '10.1016/j.diin.2022.301234',
      authors: ['Soumy Naman Srivastava', 'Dr. Jennifer Lee'],
      abstract: 'Implementation of blockchain technology for ensuring evidence integrity and chain of custody in digital forensic investigations.',
      fullAbstract: 'Digital forensic evidence integrity is crucial for legal proceedings. This paper presents a blockchain-based evidence management system that ensures tamper-proof chain of custody and evidence integrity. The system uses smart contracts for automated evidence handling and provides cryptographic proof of evidence authenticity. Field testing with law enforcement agencies showed 100% evidence integrity maintenance and 67% reduction in evidence handling time.',
      citations: 78,
      type: 'Technical Paper',
      status: 'Published',
      pdfUrl: '/papers/blockchain-forensics.pdf',
      keywords: ['Blockchain', 'Digital Forensics', 'Evidence Management', 'Chain of Custody'],
      impact: 'High',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const stats = {
    totalPublications: publications.length,
    totalCitations: publications.reduce((sum, pub) => sum + pub.citations, 0),
    hIndex: 4,
    i10Index: 3
  };

  return (
    <section id="publications" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Research <span className="text-cyan-400">Publications</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Peer-reviewed research contributions to the cybersecurity academic community
          </p>
        </div>

        {/* Publication Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.totalPublications}</div>
            <div className="text-gray-300">Publications</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.totalCitations}</div>
            <div className="text-gray-300">Citations</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{stats.hIndex}</div>
            <div className="text-gray-300">H-Index</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.i10Index}</div>
            <div className="text-gray-300">i10-Index</div>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-8">
          {publications.map((pub, index) => (
            <div
              key={index}
              className="bg-black/40 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 group"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${pub.color} bg-opacity-20`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded text-blue-400">
                          {pub.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          pub.impact === 'High' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {pub.impact} Impact
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 leading-tight">
                      {pub.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-green-400">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">{pub.journal}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{pub.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{pub.citations} citations</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>DOI: {pub.doi}</span>
                        </div>
                      </div>
                      <div className="text-sm text-purple-400">
                        Authors: {pub.authors.join(', ')}
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">
                      {selectedPub === index ? pub.fullAbstract : pub.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pub.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded text-cyan-400"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Publication</span>
                      </a>
                      <a
                        href={pub.pdfUrl}
                        className="flex items-center space-x-2 text-green-400 hover:text-white transition-colors duration-300"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </a>
                      <button
                        onClick={() => setSelectedPub(selectedPub === index ? null : index)}
                        className="text-purple-400 hover:text-white transition-colors duration-300"
                      >
                        {selectedPub === index ? 'Show Less' : 'Show Full Abstract'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Complete Publication Profile</h3>
            <p className="text-gray-300 mb-6">
              View my complete research profile and citation metrics on Google Scholar
            </p>
            <a
              href="https://scholar.google.com/citations?user=soumysec"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Google Scholar Profile</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Publications;