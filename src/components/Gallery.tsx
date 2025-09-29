import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Tag, Search, Filter, Grid, List, Download, Share2, Eye, Heart, X, ChevronLeft, ChevronRight, Upload, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterTag, setFilterTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'views'>('date');

  // Sample gallery data - in real app, this would come from an API
  const galleryImages = [
    {
      id: 1,
      title: 'Penetration Testing Lab Setup',
      description: 'Advanced penetration testing laboratory configuration with multiple target systems',
      url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=400',
      uploadDate: '2024-01-15',
      uploadTime: '14:30:22',
      tags: ['penetration-testing', 'lab', 'security'],
      views: 1247,
      likes: 89,
      category: 'Security Labs',
      metadata: {
        camera: 'Canon EOS R5',
        settings: 'f/2.8, 1/60s, ISO 800',
        location: 'Security Lab, San Francisco'
      }
    },
    {
      id: 2,
      title: 'Cloud Security Architecture Diagram',
      description: 'Multi-cloud security architecture implementation for enterprise environments',
      url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?w=400',
      uploadDate: '2024-01-12',
      uploadTime: '09:15:45',
      tags: ['cloud-security', 'architecture', 'aws', 'azure'],
      views: 892,
      likes: 67,
      category: 'Cloud Security',
      metadata: {
        camera: 'iPhone 15 Pro',
        settings: 'Auto mode',
        location: 'Home Office'
      }
    },
    {
      id: 3,
      title: 'CTF Competition Victory',
      description: 'Team photo after winning the International Cybersecurity CTF Championship',
      url: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?w=400',
      uploadDate: '2024-01-10',
      uploadTime: '18:45:12',
      tags: ['ctf', 'competition', 'team', 'victory'],
      views: 2156,
      likes: 234,
      category: 'Competitions',
      metadata: {
        camera: 'Sony A7 III',
        settings: 'f/4.0, 1/125s, ISO 400',
        location: 'Las Vegas Convention Center'
      }
    },
    {
      id: 4,
      title: 'Digital Forensics Investigation',
      description: 'Advanced digital forensics tools and techniques in action',
      url: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg?w=400',
      uploadDate: '2024-01-08',
      uploadTime: '11:20:33',
      tags: ['forensics', 'investigation', 'tools', 'analysis'],
      views: 756,
      likes: 45,
      category: 'Digital Forensics',
      metadata: {
        camera: 'Nikon D850',
        settings: 'f/5.6, 1/200s, ISO 200',
        location: 'Forensics Lab'
      }
    },
    {
      id: 5,
      title: 'DevSecOps Pipeline Visualization',
      description: 'Automated security integration in CI/CD pipeline dashboard',
      url: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg?w=400',
      uploadDate: '2024-01-05',
      uploadTime: '16:10:18',
      tags: ['devsecops', 'pipeline', 'automation', 'ci-cd'],
      views: 1089,
      likes: 78,
      category: 'DevSecOps',
      metadata: {
        camera: 'MacBook Pro Screenshot',
        settings: 'Screen capture',
        location: 'Remote Office'
      }
    },
    {
      id: 6,
      title: 'Security Conference Presentation',
      description: 'Presenting advanced threat hunting techniques at Black Hat Conference',
      url: 'https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg',
      thumbnail: 'https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg?w=400',
      uploadDate: '2024-01-03',
      uploadTime: '13:55:07',
      tags: ['conference', 'presentation', 'black-hat', 'speaking'],
      views: 1834,
      likes: 156,
      category: 'Conferences',
      metadata: {
        camera: 'Canon 5D Mark IV',
        settings: 'f/2.8, 1/100s, ISO 1600',
        location: 'Black Hat Conference, Las Vegas'
      }
    }
  ];

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];
  const allTags = Array.from(new Set(galleryImages.flatMap(img => img.tags)));

  const filteredImages = galleryImages
    .filter(img => {
      const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           img.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = filterTag === 'all' || img.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Security <span className="text-cyan-400">Gallery</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Visual documentation of cybersecurity projects, achievements, and professional moments
          </p>
        </div>

        {/* Gallery Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-6 text-center">
            <ImageIcon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-cyan-400 mb-2">{galleryImages.length}</div>
            <div className="text-gray-300">Images</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-lg p-6 text-center">
            <Eye className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-400 mb-2">
              {galleryImages.reduce((sum, img) => sum + img.views, 0).toLocaleString()}
            </div>
            <div className="text-gray-300">Total Views</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
            <Heart className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {galleryImages.reduce((sum, img) => sum + img.likes, 0)}
            </div>
            <div className="text-gray-300">Total Likes</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 text-center">
            <Tag className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-yellow-400 mb-2">{categories.length - 1}</div>
            <div className="text-gray-300">Categories</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors duration-300"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-4 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors duration-300"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'views')}
              className="px-4 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors duration-300"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="views">Sort by Views</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-black/60 border border-cyan-500/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-cyan-500 text-black' 
                    : 'text-cyan-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-cyan-500 text-black' 
                    : 'text-cyan-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Button */}
            <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="bg-black/40 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 group cursor-pointer hover:scale-105"
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{image.views}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{image.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {image.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{image.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{image.uploadDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{image.uploadTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded text-purple-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-cyan-400">
                        +{image.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="bg-black/40 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                          {image.title}
                        </h3>
                        <p className="text-green-400 text-sm mb-2">{image.category}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{image.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{image.likes}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{image.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{image.uploadDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{image.uploadTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {image.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded text-cyan-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl w-full max-h-full">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 border border-cyan-500/30 rounded-full text-white hover:border-cyan-400 transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/60 border border-cyan-500/30 rounded-full text-white hover:border-cyan-400 transition-colors duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/60 border border-cyan-500/30 rounded-full text-white hover:border-cyan-400 transition-colors duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="bg-black/80 border border-cyan-500/30 rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={filteredImages[selectedImage].url}
                    alt={filteredImages[selectedImage].title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {filteredImages[selectedImage].title}
                      </h3>
                      <p className="text-cyan-400 mb-2">{filteredImages[selectedImage].category}</p>
                      <p className="text-gray-300">{filteredImages[selectedImage].description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-green-400 hover:text-white transition-colors duration-300">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button className="flex items-center space-x-2 text-purple-400 hover:text-white transition-colors duration-300">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span>Uploaded: {filteredImages[selectedImage].uploadDate} at {filteredImages[selectedImage].uploadTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Eye className="w-4 h-4 text-green-400" />
                          <span>Views: {filteredImages[selectedImage].views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Heart className="w-4 h-4 text-purple-400" />
                          <span>Likes: {filteredImages[selectedImage].likes}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Metadata</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div><strong>Camera:</strong> {filteredImages[selectedImage].metadata.camera}</div>
                        <div><strong>Settings:</strong> {filteredImages[selectedImage].metadata.settings}</div>
                        <div><strong>Location:</strong> {filteredImages[selectedImage].metadata.location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-bold text-white mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredImages[selectedImage].tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded-full text-cyan-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No images found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;