import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Home, Users, MessageSquare, Calendar, Settings, Bell, Search, 
  TrendingUp, BookOpen, Target, Award, Star, Building2,
  PlayCircle, Download, CheckCircle, Clock, Briefcase, GraduationCap,
  Upload, FileText, Send, UserPlus, BarChart3, Heart
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: string, type?: 'alumni' | 'student') => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [cvUploaded, setCvUploaded] = useState(true);

  // Student profile info
  const studentProfile = {
    name: 'Ravi Kumar',
    studentId: 'S12345678',
    email: 'ravi.kumar@students.waikato.ac.nz',
    expectedGraduation: 'November 2026',
    academicFocus: 'Computer Science',
    mentoringPreferences: ['Technical Skill Development', 'Career Planning and Progression'],
    cvStatus: cvUploaded ? 'Uploaded' : 'Not Uploaded',
    profileComplete: 85
  };

  // Current mentor (if matched)
  const currentMentor = {
    name: 'Dr. Sarah Mitchell',
    title: 'Senior Data Scientist',
    company: 'Tech Solutions NZ',
    avatar: '',
    matchedDate: 'March 5, 2026',
    nextSession: 'March 15, 2026',
    sessionsCompleted: 2,
    mentoringType: 'Vocational Mentoring (2-3 sessions)',
    status: 'Active'
  };

  // Recommended mentors with match scores
  const recommendedMentors = [
    {
      id: 1,
      name: 'James Chen',
      role: 'Software Engineering Lead',
      company: 'Global Tech Corp',
      expertise: ['Software Engineering', 'Computer Science'],
      matchScore: 88,
      avatar: '',
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Emma Williams',
      role: 'Cybersecurity Specialist',
      company: 'SecureNet NZ',
      expertise: ['Cybersecurity', 'Computer Science'],
      matchScore: 85,
      avatar: '',
      availability: 'Limited'
    },
    {
      id: 3,
      name: 'Michael Brown',
      role: 'AI Research Scientist',
      company: 'Innovation Labs',
      expertise: ['AI & Machine Learning', 'Computer Science'],
      matchScore: 82,
      avatar: '',
      availability: 'Available'
    }
  ];

  // Mentoring progress milestones
  const mentoringMilestones = [
    { title: 'Complete Profile', status: 'completed', progress: 100, date: 'Feb 20, 2026' },
    { title: 'Upload CV', status: 'completed', progress: 100, date: 'Feb 22, 2026' },
    { title: 'Get Matched with Mentor', status: 'completed', progress: 100, date: 'Mar 5, 2026' },
    { title: 'First Mentoring Session', status: 'completed', progress: 100, date: 'Mar 8, 2026' },
    { title: 'Complete 3 Sessions', status: 'in-progress', progress: 67, date: 'In Progress' },
    { title: 'Provide Feedback & Rating', status: 'pending', progress: 0, date: 'Pending' }
  ];

  // Recent sessions
  const recentSessions = [
    {
      date: 'March 12, 2026',
      duration: '45 min',
      topic: 'Career Planning Discussion',
      notes: 'Discussed career goals and industry expectations',
      mentor: 'Dr. Sarah Mitchell'
    },
    {
      date: 'March 8, 2026',
      duration: '60 min',
      topic: 'Introduction & Goal Setting',
      notes: 'Initial meeting to establish mentoring relationship',
      mentor: 'Dr. Sarah Mitchell'
    }
  ];

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
                <Button variant="ghost" className="flex items-center space-x-2 bg-red-50 text-[#C8102E]">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('directory')}>
                  <Users className="h-4 w-4 mr-2" />
                  Browse Mentors
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('mentorship')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  My Matches
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              
              {/* Removed user avatar and badge */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {studentProfile.name}! 👋</h1>
          <p className="text-gray-600">
            Track your mentoring progress and connect with industry professionals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-[#C8102E]" />
                </div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-gray-600">Active Mentor</div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-gray-600">Sessions Done</div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-gray-600">Session Pending</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{studentProfile.profileComplete}%</div>
                <div className="text-sm text-gray-600">Profile Complete</div>
              </Card>
            </div>

            {/* Current Mentor */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">My Mentor</h2>
                <Badge className="bg-green-100 text-green-700">{currentMentor.status}</Badge>
              </div>
              
              <div className="flex items-start space-x-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={currentMentor.avatar} />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{currentMentor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{currentMentor.title}</p>
                  <p className="text-sm text-[#C8102E]">{currentMentor.company}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {currentMentor.mentoringType}
                  </Badge>
                </div>

                <Button className="bg-[#C8102E] hover:bg-[#A00D24]" onClick={() => onNavigate('mentorship')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Room
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-500">Matched Since</div>
                  <div className="font-semibold">{currentMentor.matchedDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Next Session</div>
                  <div className="font-semibold">{currentMentor.nextSession}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Sessions Completed</div>
                  <div className="font-semibold">{currentMentor.sessionsCompleted} / 3</div>
                </div>
              </div>
            </Card>

            {/* Recent Sessions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Sessions</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={index} className="border-l-4 border-[#C8102E] pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{session.topic}</h3>
                        <p className="text-sm text-gray-600">{session.mentor}</p>
                      </div>
                      <Badge variant="secondary">{session.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{session.notes}</p>
                    <div className="text-xs text-gray-500">{session.date}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Mentors */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Recommended Mentors</h2>
                  <p className="text-sm text-gray-600">Based on your profile and interests</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => onNavigate('directory')}>
                  Browse All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recommendedMentors.map((mentor) => (
                  <div key={mentor.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.role}</p>
                        <p className="text-sm text-[#C8102E]">{mentor.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getMatchScoreColor(mentor.matchScore)}>
                          {mentor.matchScore}% Match
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{mentor.availability}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4 mr-1" />
                        Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">{studentProfile.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{studentProfile.studentId}</p>
                <Badge className="bg-green-100 text-green-700">Final Year CMS Student</Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Graduation:</span>
                  <span className="font-medium">{studentProfile.expectedGraduation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Academic Focus:</span>
                  <span className="font-medium">{studentProfile.academicFocus}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-gray-600 mb-2">Profile Completion</div>
                  <Progress value={studentProfile.profileComplete} className="mb-2" />
                  <div className="text-xs text-gray-500">{studentProfile.profileComplete}% Complete</div>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Card>

            {/* CV Status */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">CV Status</h3>
              {cvUploaded ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">CV Uploaded</div>
                        <div className="text-xs text-gray-500">resume_2026.pdf</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border-2 border-dashed rounded-lg text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">No CV uploaded yet</p>
                  </div>
                  <Button className="w-full bg-[#C8102E] hover:bg-[#A00D24]">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                </div>
              )}
            </Card>

            {/* Mentoring Progress */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Mentoring Journey</h3>
              <div className="space-y-3">
                {mentoringMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`mt-1 rounded-full p-1 ${
                      milestone.status === 'completed' ? 'bg-green-100' :
                      milestone.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : milestone.status === 'in-progress' ? (
                        <Clock className="h-4 w-4 text-blue-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{milestone.title}</div>
                      <div className="text-xs text-gray-500">{milestone.date}</div>
                      {milestone.status === 'in-progress' && (
                        <Progress value={milestone.progress} className="mt-2 h-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('directory')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find More Mentors
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('mentorship')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Mentor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Mentor
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}