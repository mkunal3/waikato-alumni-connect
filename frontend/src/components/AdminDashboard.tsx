import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, UserCheck, UserX, Settings, Bell, Search,
  CheckCircle, XCircle, Clock, TrendingUp, BarChart3,
  Calendar, Target, Star, FileText, Download,
  GraduationCap, Briefcase, UserPlus, Mail, Eye,
  Activity, Award, AlertCircle, Filter, PlayCircle, PauseCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPhase, setCurrentPhase] = useState('matching');

  // Programme phases
  const phases = [
    { id: 'mentor-reg', name: 'Mentor Registration', status: 'completed', duration: '2 weeks' },
    { id: 'student-reg', name: 'Student Registration', status: 'completed', duration: '2 weeks' },
    { id: 'orientation', name: 'Orientation Event', status: 'completed', duration: '1 day' },
    { id: 'matching', name: 'Matching Period', status: 'active', duration: '2 weeks' },
    { id: 'mentoring', name: 'Mentoring Period', status: 'upcoming', duration: '4 months' }
  ];

  // Statistics
  const stats = {
    students: {
      total: 45,
      approved: 38,
      pending: 5,
      rejected: 2
    },
    mentors: {
      total: 32,
      approved: 28,
      pending: 3,
      rejected: 1
    },
    matches: {
      total: 25,
      active: 22,
      pending: 8,
      completed: 3
    },
    sessions: {
      total: 58,
      completed: 45,
      upcoming: 13,
      avgPerMatch: 2.3
    }
  };

  // Pending student registrations
  const pendingStudents = [
    {
      id: 1,
      name: 'Emma Taylor',
      studentId: 'S87654321',
      email: 'emma.taylor@students.waikato.ac.nz',
      expectedGraduation: 'November 2026',
      academicFocus: 'Data Science and Analytics',
      mentoringPreferences: ['Technical Skill Development', 'Career Planning'],
      cvUploaded: true,
      registeredDate: 'March 13, 2026',
      avatar: ''
    },
    {
      id: 2,
      name: 'James Wilson',
      studentId: 'S11223344',
      email: 'james.wilson@students.waikato.ac.nz',
      expectedGraduation: 'November 2026',
      academicFocus: 'Computer Science',
      mentoringPreferences: ['Career Planning', 'CV and Interview Preparation'],
      cvUploaded: true,
      registeredDate: 'March 12, 2026',
      avatar: ''
    },
    {
      id: 3,
      name: 'Sophie Anderson',
      studentId: 'S99887766',
      email: 'sophie.anderson@students.waikato.ac.nz',
      expectedGraduation: 'November 2026',
      academicFocus: 'Cybersecurity',
      mentoringPreferences: ['Technical Skill Development', 'Networking and Industry Insights'],
      cvUploaded: false,
      registeredDate: 'March 11, 2026',
      avatar: ''
    }
  ];

  // Pending mentor registrations
  const pendingMentors = [
    {
      id: 1,
      name: 'Michael Brown',
      alumniId: 'A20160345',
      email: 'michael.brown@innovatelabs.co.nz',
      graduationYear: '2016',
      university: 'University of Waikato',
      company: 'InnovateTech Labs',
      title: 'AI Research Scientist',
      academicBackground: ['Artificial Intelligence and Machine Learning', 'Computer Science'],
      careerStage: 'Academic or Researcher',
      mentoringTypes: ['One-Off Advice', 'Vocational Mentoring'],
      registeredDate: 'March 10, 2026',
      avatar: ''
    },
    {
      id: 2,
      name: 'Lisa Taylor',
      alumniId: 'A20130289',
      email: 'lisa.taylor@codecraft.co.nz',
      graduationYear: '2013',
      university: 'University of Waikato',
      company: 'CodeCraft Innovations',
      title: 'Startup Founder & CEO',
      academicBackground: ['Information Systems', 'Computer Science'],
      careerStage: 'Entrepreneur or Startup Founder',
      mentoringTypes: ['Vocational Mentoring', 'Employment Opportunities'],
      registeredDate: 'March 9, 2026',
      avatar: ''
    }
  ];

  // Pending match requests
  const pendingMatches = [
    {
      id: 1,
      student: {
        name: 'Ravi Kumar',
        studentId: 'S12345678',
        academicFocus: 'Computer Science',
        avatar: '/placeholder.jpg',
      },
      mentor: {
        name: 'Dr. Sarah Mitchell',
        company: 'Tech Solutions NZ',
        title: 'Senior Data Scientist',
        avatar: '/placeholder.jpg',
      },
      matchScore: 92,
      requestDate: 'March 14, 2026',
      status: 'Mentor Accepted, Awaiting Admin Review'
    }
  ];

  // Active matches
  const activeMatches = [
    {
      id: 1,
      student: 'Ravi Kumar (S12345678)',
      mentor: 'Dr. Sarah Mitchell',
      matchedDate: 'March 5, 2026',
      sessionsCompleted: 2,
      totalPlanned: 3,
      mentoringType: 'Vocational Mentoring',
      status: 'Active',
      lastActivity: 'March 12, 2026'
    },
    {
      id: 2,
      student: 'Amy Chen (S23456789)',
      mentor: 'James Chen',
      matchedDate: 'March 6, 2026',
      sessionsCompleted: 1,
      totalPlanned: 3,
      mentoringType: 'Vocational Mentoring',
      status: 'Active',
      lastActivity: 'March 10, 2026'
    }
  ];

  // Top mentors by rating
  const topMentors = [
    {
      name: 'Dr. Sarah Mitchell',
      rating: 4.9,
      sessions: 15,
      mentees: 3,
      avatar: '/placeholder.jpg',
    },
    {
      name: 'James Chen',
      rating: 4.8,
      sessions: 12,
      mentees: 2,
      avatar: '/placeholder.jpg',
    },
    {
      name: 'Emma Williams',
      rating: 4.7,
      sessions: 8,
      mentees: 2,
      avatar: '/placeholder.jpg',
    }
  ];

  const getPhaseStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-gray-100 text-gray-700">Upcoming</Badge>;
      default:
        return null;
    }
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
                <span className="font-bold text-xl">Waikato Navigator Admin</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {(pendingStudents.length + pendingMentors.length) > 0 && (
                <Badge className="bg-[#C8102E] text-white">
                  {pendingStudents.length + pendingMentors.length} Pending Approvals
                </Badge>
              )}
              
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              
              {/* Removed user avatar and badge */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage the Waikato Navigator Mentoring Programme
          </p>
        </div>

        {/* Phase Management */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Programme Phases</h2>
            <Button size="sm" className="bg-[#C8102E] hover:bg-[#A00D24]">
              <Settings className="h-4 w-4 mr-2" />
              Manage Phases
            </Button>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="relative">
                <Card className={`p-4 text-center ${phase.status === 'active' ? 'border-2 border-[#C8102E]' : ''}`}>
                  <div className="mb-3">
                    {phase.status === 'completed' ? (
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                    ) : phase.status === 'active' ? (
                      <PlayCircle className="h-8 w-8 text-[#C8102E] mx-auto" />
                    ) : (
                      <Clock className="h-8 w-8 text-gray-400 mx-auto" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{phase.name}</h3>
                  <div className="text-xs text-gray-500 mb-2">{phase.duration}</div>
                  {getPhaseStatus(phase.status)}
                </Card>
                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="registrations">
              <UserPlus className="h-4 w-4 mr-2" />
              Registrations
              {(pendingStudents.length + pendingMentors.length) > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {pendingStudents.length + pendingMentors.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="matches">
              <Target className="h-4 w-4 mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Calendar className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                  <Badge className="bg-green-100 text-green-700">+{stats.students.pending} Pending</Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.students.total}</div>
                <div className="text-sm text-gray-600">Total Students</div>
                <div className="text-xs text-gray-500 mt-2">{stats.students.approved} approved</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className="h-8 w-8 text-[#C8102E]" />
                  <Badge className="bg-red-100 text-[#C8102E]">+{stats.mentors.pending} Pending</Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.mentors.total}</div>
                <div className="text-sm text-gray-600">Total Mentors</div>
                <div className="text-xs text-gray-500 mt-2">{stats.mentors.approved} approved</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-700">{stats.matches.active} Active</Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.matches.total}</div>
                <div className="text-sm text-gray-600">Total Matches</div>
                <div className="text-xs text-gray-500 mt-2">{stats.matches.pending} pending review</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-700">{stats.sessions.upcoming} Upcoming</Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.sessions.total}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
                <div className="text-xs text-gray-500 mt-2">Avg {stats.sessions.avgPerMatch} per match</div>
              </Card>
            </div>

            {/* Active Matches Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Active Matches</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              
              <div className="space-y-3">
                {activeMatches.slice(0, 5).map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="font-medium">{match.student}</div>
                        <span className="text-gray-400">↔</span>
                        <div className="font-medium">{match.mentor}</div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Matched: {match.matchedDate}</span>
                        <span>•</span>
                        <span>Sessions: {match.sessionsCompleted}/{match.totalPlanned}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">{match.mentoringType}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700">{match.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Mentors */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Top Rated Mentors</h2>
              <div className="space-y-4">
                {topMentors.map((mentor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <Avatar>
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{mentor.name}</div>
                        <div className="text-sm text-gray-600">{mentor.sessions} sessions • {mentor.mentees} mentees</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{mentor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-6">
            {/* Pending Student Registrations */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Pending Student Registrations</h2>
                  <p className="text-sm text-gray-600">Review and approve student applications</p>
                </div>
                <Badge className="bg-orange-100 text-orange-700">{pendingStudents.length} Pending</Badge>
              </div>
              
              <div className="space-y-4">
                {pendingStudents.map((student) => (
                  <Card key={student.id} className="p-5 border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold mb-1">{student.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{student.studentId} • {student.email}</p>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {student.academicFocus}
                            </span>
                            <span>Grad: {student.expectedGraduation}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Registered: {student.registeredDate}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">MENTORING PREFERENCES</div>
                      <div className="flex flex-wrap gap-2">
                        {student.mentoringPreferences.map((pref, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        {student.cvUploaded ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            CV Uploaded
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            No CV
                          </Badge>
                        )}
                        <Button variant="link" size="sm" className="text-[#C8102E]">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" className="bg-[#C8102E] hover:bg-[#A00D24]">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Pending Mentor Registrations */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Pending Mentor Registrations</h2>
                  <p className="text-sm text-gray-600">Review and approve mentor applications</p>
                </div>
                <Badge className="bg-orange-100 text-orange-700">{pendingMentors.length} Pending</Badge>
              </div>
              
              <div className="space-y-4">
                {pendingMentors.map((mentor) => (
                  <Card key={mentor.id} className="p-5 border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={mentor.avatar} />
                          <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold mb-1">{mentor.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{mentor.title}</p>
                          <p className="text-sm text-[#C8102E] mb-2">{mentor.company}</p>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>{mentor.alumniId}</span>
                            <span>•</span>
                            <span>Class of {mentor.graduationYear}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Registered: {mentor.registeredDate}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">EXPERTISE</div>
                        <div className="flex flex-wrap gap-2">
                          {mentor.academicBackground.map((area, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">MENTORING TYPES</div>
                        <div className="flex flex-wrap gap-2">
                          {mentor.mentoringTypes.map((type, idx) => (
                            <Badge key={idx} className="bg-red-100 text-[#C8102E] text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <Badge variant="secondary">{mentor.careerStage}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" className="bg-[#C8102E] hover:bg-[#A00D24]">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">All Matches</h2>
              <div className="space-y-3">
                {activeMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="font-medium">{match.student}</div>
                        <span className="text-gray-400">↔</span>
                        <div className="font-medium">{match.mentor}</div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Matched: {match.matchedDate}</span>
                        <span>•</span>
                        <span>Sessions: {match.sessionsCompleted}/{match.totalPlanned}</span>
                        <span>•</span>
                        <span>Last Activity: {match.lastActivity}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700">{match.status}</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{stats.sessions.completed}</div>
                <div className="text-sm text-gray-600">Completed Sessions</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{stats.sessions.upcoming}</div>
                <div className="text-sm text-gray-600">Upcoming Sessions</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">{stats.sessions.avgPerMatch}</div>
                <div className="text-sm text-gray-600">Avg. Sessions per Match</div>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Export Reports</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Users Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Matches Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Sessions Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Ratings Report
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}