import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Search, Filter, MapPin, Building2, GraduationCap, Users, 
  MessageSquare, UserPlus, Mail, Briefcase, Target, 
  CheckCircle, TrendingUp, Clock
} from 'lucide-react';

interface MentorBrowseProps {
  onNavigate: (page: string, type?: 'alumni' | 'student') => void;
  userType: 'alumni' | 'student' | null;
}

export function MentorBrowse({ onNavigate, userType }: MentorBrowseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    academicFocus: 'all',
    mentoringStyle: 'all',
    careerStage: 'all',
    mentorType: 'all'
  });

  // Academic Focus categories
  const academicFocusOptions = [
    'Computer Science',
    'Data Science and Analytics',
    'Software Engineering',
    'Cybersecurity',
    'Artificial Intelligence and Machine Learning',
    'Mathematics (Pure and Applied)',
    'Statistics',
    'Computational Modelling',
    'Information Systems',
    'Mathematical Physics'
  ];

  // Mentoring Styles
  const mentoringStyles = [
    'Career Planning and Progression',
    'Technical Skill Development',
    'Work-Life Balance',
    'Postgraduate Study Advice',
    'Networking and Industry Insights',
    'CV and Interview Preparation',
    'Leadership and Management Skills'
  ];

  // Career Stages
  const careerStages = [
    'Graduate or Entry-Level',
    'Mid-Career Professional',
    'Senior Leader or Executive',
    'Academic or Researcher',
    'Entrepreneur or Startup Founder',
    'Career Changer'
  ];

  // Mentor Types
  const mentorTypes = [
    'One-Off Advice',
    'Vocational Mentoring (2-3 sessions)',
    'Employment Opportunities'
  ];

  // Mock mentor data with match scores
  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      title: 'Senior Data Scientist',
      company: 'TechFlow Solutions',
      location: 'Auckland, New Zealand',
      graduationYear: '2015',
      university: 'University of Waikato',
      academicFocus: ['Data Science and Analytics', 'Statistics'],
      mentoringStyles: ['Technical Skill Development', 'Career Planning and Progression'],
      careerStage: 'Senior Leader or Executive',
      mentoringTypes: ['Vocational Mentoring (2-3 sessions)', 'One-Off Advice'],
      avatar: '',
      matchScore: 92,
      availability: 'Available',
      bio: 'Data scientist with 10+ years experience. Passionate about helping students transition into tech careers.'
    },
    {
      id: 2,
      name: 'James Chen',
      title: 'Software Engineering Lead',
      company: 'DataVision Ltd',
      location: 'Hamilton, New Zealand',
      graduationYear: '2017',
      university: 'University of Waikato',
      academicFocus: ['Software Engineering', 'Computer Science'],
      mentoringStyles: ['Technical Skill Development', 'Career Planning and Progression'],
      careerStage: 'Mid-Career Professional',
      mentoringTypes: ['Vocational Mentoring (2-3 sessions)', 'Employment Opportunities'],
      avatar: '',
      matchScore: 88,
      availability: 'Available',
      bio: 'Software engineering leader specializing in cloud solutions and mentoring junior developers.'
    },
    {
      id: 3,
      name: 'Emma Williams',
      title: 'Cybersecurity Specialist',
      company: 'CyberShield NZ',
      location: 'Wellington, New Zealand',
      graduationYear: '2018',
      university: 'University of Waikato',
      academicFocus: ['Cybersecurity', 'Computer Science'],
      mentoringStyles: ['Technical Skill Development', 'Networking and Industry Insights'],
      careerStage: 'Mid-Career Professional',
      mentoringTypes: ['One-Off Advice', 'Vocational Mentoring (2-3 sessions)'],
      avatar: '',
      matchScore: 85,
      availability: 'Limited',
      bio: 'Cybersecurity expert helping students navigate the information security landscape.'
    },
    {
      id: 4,
      name: 'Michael Brown',
      title: 'AI Research Scientist',
      company: 'InnovateTech Labs',
      location: 'Christchurch, New Zealand',
      graduationYear: '2016',
      university: 'University of Waikato',
      academicFocus: ['Artificial Intelligence and Machine Learning', 'Computer Science'],
      mentoringStyles: ['Technical Skill Development', 'Postgraduate Study Advice'],
      careerStage: 'Academic or Researcher',
      mentoringTypes: ['Vocational Mentoring (2-3 sessions)', 'One-Off Advice'],
      avatar: '',
      matchScore: 82,
      availability: 'Available',
      bio: 'AI researcher passionate about machine learning applications and academic mentoring.'
    },
    {
      id: 5,
      name: 'Lisa Taylor',
      title: 'Startup Founder & CEO',
      company: 'CodeCraft Innovations',
      location: 'Auckland, New Zealand',
      graduationYear: '2013',
      university: 'University of Waikato',
      academicFocus: ['Information Systems', 'Computer Science'],
      mentoringStyles: ['Career Planning and Progression', 'Networking and Industry Insights', 'Leadership and Management Skills'],
      careerStage: 'Entrepreneur or Startup Founder',
      mentoringTypes: ['Vocational Mentoring (2-3 sessions)', 'Employment Opportunities'],
      avatar: '',
      matchScore: 78,
      availability: 'Limited',
      bio: 'Tech entrepreneur with experience building startups from the ground up.'
    },
    {
      id: 6,
      name: 'Prof. David Kumar',
      title: 'Mathematics Professor',
      company: 'Advanced Research Institute',
      location: 'Auckland, New Zealand',
      graduationYear: '2010',
      university: 'University of Waikato',
      academicFocus: ['Mathematics (Pure and Applied)', 'Computational Modelling'],
      mentoringStyles: ['Postgraduate Study Advice', 'Career Planning and Progression'],
      careerStage: 'Academic or Researcher',
      mentoringTypes: ['One-Off Advice', 'Vocational Mentoring (2-3 sessions)'],
      avatar: '',
      matchScore: 75,
      availability: 'Available',
      bio: 'Mathematics professor helping students pursue academic and research careers.'
    }
  ];

  // Filter mentors based on search and filters
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = searchQuery === '' || 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.academicFocus.some(focus => focus.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAcademicFocus = selectedFilters.academicFocus === 'all' || 
      mentor.academicFocus.includes(selectedFilters.academicFocus);
    
    const matchesMentoringStyle = selectedFilters.mentoringStyle === 'all' || 
      mentor.mentoringStyles.includes(selectedFilters.mentoringStyle);
    
    const matchesCareerStage = selectedFilters.careerStage === 'all' || 
      mentor.careerStage === selectedFilters.careerStage;

    const matchesMentorType = selectedFilters.mentorType === 'all' || 
      mentor.mentoringTypes.includes(selectedFilters.mentorType);

    return matchesSearch && matchesAcademicFocus && matchesMentoringStyle && 
           matchesCareerStage && matchesMentorType;
  });

  // Sort by match score (highest first)
  const sortedMentors = [...filteredMentors].sort((a, b) => b.matchScore - a.matchScore);

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-[#C8102E]" />
                <span className="font-bold text-xl">Waikato Navigator</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <Button variant="ghost" onClick={() => onNavigate(userType === 'alumni' ? 'alumni-dashboard' : 'student-dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2 bg-red-50 text-[#C8102E]">
                  <Users className="h-4 w-4" />
                  <span>Browse Mentors</span>
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('mentorship')}>
                  My Matches
                </Button>
              </nav>
            </div>

            {/* Removed user avatar and badge - Browse Mentors is now a public page */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Mentors</h1>
          <p className="text-gray-600">
            Find your ideal mentor from {mentors.length} available Waikato alumni. Match scores show compatibility based on your profile.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Academic Focus</label>
                <Select 
                  value={selectedFilters.academicFocus} 
                  onValueChange={(value) => setSelectedFilters({...selectedFilters, academicFocus: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Academic Focus</SelectItem>
                    {academicFocusOptions.map((focus) => (
                      <SelectItem key={focus} value={focus}>{focus}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mentoring Style</label>
                <Select 
                  value={selectedFilters.mentoringStyle} 
                  onValueChange={(value) => setSelectedFilters({...selectedFilters, mentoringStyle: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Styles</SelectItem>
                    {mentoringStyles.map((style) => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Career Stage</label>
                <Select 
                  value={selectedFilters.careerStage} 
                  onValueChange={(value) => setSelectedFilters({...selectedFilters, careerStage: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {careerStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mentor Type</label>
                <Select 
                  value={selectedFilters.mentorType} 
                  onValueChange={(value) => setSelectedFilters({...selectedFilters, mentorType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {mentorTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Count */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                Showing {sortedMentors.length} of {mentors.length} mentors
              </p>
              {Object.values(selectedFilters).some(v => v !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedFilters({
                    academicFocus: 'all',
                    mentoringStyle: 'all',
                    careerStage: 'all',
                    mentorType: 'all'
                  })}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMentors.map((mentor) => (
            <Card key={mentor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Match Score Banner */}
              <div className={`py-2 px-4 ${getMatchScoreColor(mentor.matchScore)} border-b`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Match Score</span>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span className="font-bold">{mentor.matchScore}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={mentor.avatar} />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {mentor.verified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#C8102E] rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{mentor.title}</p>
                    <p className="text-sm text-[#C8102E]">{mentor.company}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{mentor.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Graduated {mentor.graduationYear}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{mentor.careerStage}</span>
                  </div>
                </div>

                {/* Academic Focus */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-500 mb-2">EXPERTISE</div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.academicFocus.slice(0, 2).map((focus, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {focus.length > 20 ? focus.substring(0, 20) + '...' : focus}
                      </Badge>
                    ))}
                    {mentor.academicFocus.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{mentor.academicFocus.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Mentor Types */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-500 mb-2">OFFERS</div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.mentoringTypes.map((type, idx) => (
                      <Badge key={idx} className="bg-red-100 text-[#C8102E] text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="font-semibold text-sm">{mentor.sessionsCompleted}</div>
                    <div className="text-xs text-gray-500">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm flex items-center justify-center">
                      {mentor.rating} <span className="text-yellow-400 ml-1">★</span>
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <Badge 
                      variant={mentor.availability === 'Available' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {mentor.availability}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-[#C8102E] hover:bg-[#A00D24]">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Send Request
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {sortedMentors.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No mentors found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilters({
                  academicFocus: 'all',
                  mentoringStyle: 'all',
                  careerStage: 'all',
                  mentorType: 'all'
                });
              }}
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}