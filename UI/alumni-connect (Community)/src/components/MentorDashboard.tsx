import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Home, Users, MessageSquare, Calendar, Settings, Bell, Search, 
  TrendingUp, Heart, Briefcase, GraduationCap, MapPin, Building2,
  Award, UserPlus, Clock, CheckCircle, XCircle, Mail, Target,
  Star, FileText, BookOpen, Send
} from 'lucide-react';

interface MentorDashboardProps {
  onNavigate: (page: string, type?: 'alumni' | 'student') => void;
}

export function MentorDashboard({ onNavigate }: MentorDashboardProps) {
  // Mentor profile info
  const mentorProfile = {
    name: 'Dr. Sarah Mitchell',
    alumniId: 'A20150234',
    email: 'sarah.mitchell@techsolutions.co.nz',
    graduationYear: '2015',
    title: 'Senior Data Scientist',
    company: 'Tech Solutions NZ',
    location: 'Auckland, New Zealand',
    academicBackground: ['Data Science and Analytics', 'Statistics'],
    careerStage: 'Senior Leader or Executive',
    mentoringTypes: ['Vocational Mentoring (2-3 sessions)', 'One-Off Advice'],
    mentoringStyles: ['Technical Skill Development', 'Career Planning and Progression'],
    profileComplete: 90,
    rating: 4.9,
    totalSessions: 15
  };

  // Current mentees
  const currentMentees = [
    {
      id: 1,
      name: 'Ravi Kumar',
      studentId: 'S12345678',
      academicFocus: 'Computer Science',
      matchedDate: 'March 5, 2026',
      nextSession: 'March 15, 2026',
      sessionsCompleted: 2,
      totalPlanned: 3,
      mentoringType: 'Vocational Mentoring (2-3 sessions)',
      avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      status: 'Active'
    }
  ];

  // Pending match requests
  const pendingRequests = [
    {
      id: 1,
      name: 'Emma Taylor',
      studentId: 'S87654321',
      academicFocus: 'Data Science and Analytics',
      expectedGraduation: 'November 2026',
      matchScore: 91,
      mentoringPreferences: ['Technical Skill Development', 'Career Planning and Progression'],
      requestDate: 'March 13, 2026',
      avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      cvAvailable: true,
      message: 'I am very interested in pursuing a career in data science and would love to learn about your journey in the field.'
    },
    {
      id: 2,
      name: 'James Wilson',
      studentId: 'S11223344',
      academicFocus: 'Statistics',
      expectedGraduation: 'November 2026',
      matchScore: 85,
      mentoringPreferences: ['Career Planning and Progression', 'Postgraduate Study Advice'],
      requestDate: 'March 12, 2026',
      avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      cvAvailable: true,
      message: 'I am considering pursuing postgraduate studies and would appreciate your guidance on career paths in statistics.'
    }
  ];

  // Recent sessions
  const recentSessions = [
    {
      date: 'March 12, 2026',
      duration: '45 min',
      student: 'Ravi Kumar',
      topic: 'Career Planning Discussion',
      type: 'Vocational Mentoring',
      notes: 'Discussed career goals and industry expectations'
    },
    {
      date: 'March 8, 2026',
      duration: '60 min',
      student: 'Ravi Kumar',
      topic: 'Introduction & Goal Setting',
      type: 'Vocational Mentoring',
      notes: 'Initial meeting to establish mentoring relationship'
    }
  ];

  // Upcoming sessions
  const upcomingSessions = [
    {
      date: 'March 15, 2026',
      time: '2:00 PM',
      student: 'Ravi Kumar',
      topic: 'Technical Skills & Career Development',
      type: 'Vocational Mentoring',
      meetingLink: 'https://zoom.us/j/123456789'
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
                  Browse Students
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('mentorship')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  My Mentees
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {pendingRequests.length > 0 && (
                <Badge className="bg-[#C8102E] text-white">
                  {pendingRequests.length} New Requests
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {mentorProfile.name.split(' ')[1]}! 👋</h1>
          <p className="text-gray-600">
            Manage your mentoring relationships and help students achieve their goals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-[#C8102E]" />
                </div>
                <div className="text-2xl font-bold">{currentMentees.length}</div>
                <div className="text-sm text-gray-600">Active Mentees</div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Mail className="h-8 w-8 text-orange-500" />
                </div>
                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{mentorProfile.totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">{mentorProfile.rating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </Card>
            </div>

            {/* Pending Match Requests */}
            {pendingRequests.length > 0 && (
              <Card className="p-6 border-[#C8102E] border-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Pending Match Requests</h2>
                    <p className="text-sm text-gray-600">Review and respond to student requests</p>
                  </div>
                  <Badge className="bg-[#C8102E] text-white">{pendingRequests.length} New</Badge>
                </div>
                
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id} className="p-5 border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={request.avatar} />
                            <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{request.name}</h3>
                              <Badge className={getMatchScoreColor(request.matchScore)}>
                                {request.matchScore}% Match
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{request.studentId}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                {request.academicFocus}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Grad: {request.expectedGraduation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs font-medium text-gray-500 mb-2">MENTORING PREFERENCES</div>
                        <div className="flex flex-wrap gap-2">
                          {request.mentoringPreferences.map((pref, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Requested on {request.requestDate}
                          {request.cvAvailable && (
                            <Button variant="link" size="sm" className="ml-2 p-0 h-auto text-[#C8102E]">
                              <FileText className="h-3 w-3 mr-1" />
                              View CV
                            </Button>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button size="sm" className="bg-[#C8102E] hover:bg-[#A00D24]">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Current Mentees */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">My Mentees</h2>
                <Badge variant="secondary">{currentMentees.length} Active</Badge>
              </div>
              
              {currentMentees.length > 0 ? (
                <div className="space-y-4">
                  {currentMentees.map((mentee) => (
                    <Card key={mentee.id} className="p-5 border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={mentee.avatar} />
                            <AvatarFallback>{mentee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{mentee.name}</h3>
                              <Badge className="bg-green-100 text-green-700">{mentee.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{mentee.studentId}</p>
                            <p className="text-sm text-gray-500">{mentee.academicFocus}</p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {mentee.mentoringType}
                            </Badge>
                          </div>
                        </div>

                        <Button size="sm" className="bg-[#C8102E] hover:bg-[#A00D24]" onClick={() => onNavigate('mentorship')}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Open Room
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <div className="text-sm text-gray-500">Matched Since</div>
                          <div className="font-medium text-sm">{mentee.matchedDate}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Next Session</div>
                          <div className="font-medium text-sm">{mentee.nextSession}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Progress</div>
                          <div className="font-medium text-sm">{mentee.sessionsCompleted} / {mentee.totalPlanned} sessions</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No active mentees yet</h3>
                  <p className="text-gray-600 mb-4">
                    Accept match requests to start mentoring students
                  </p>
                </div>
              )}
            </Card>

            {/* Upcoming Sessions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>
              
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#C8102E] text-white rounded-lg p-3 text-center">
                          <div className="text-xs">MAR</div>
                          <div className="text-xl font-bold">{session.date.split(' ')[1].replace(',', '')}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{session.topic}</h3>
                          <p className="text-sm text-gray-600 mb-1">with {session.student}</p>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {session.time}
                            </span>
                            <Badge variant="secondary" className="text-xs">{session.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4 mr-1" />
                        Join Meeting
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming sessions scheduled
                </div>
              )}
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
                        <p className="text-sm text-gray-600">with {session.student}</p>
                      </div>
                      <Badge variant="secondary">{session.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{session.notes}</p>
                    <div className="text-xs text-gray-500">{session.date}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentor Profile Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">{mentorProfile.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{mentorProfile.title}</p>
                <p className="text-sm text-[#C8102E] mb-2">{mentorProfile.company}</p>
                <Badge className="bg-red-100 text-[#C8102E]">Mentor • Class of {mentorProfile.graduationYear}</Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {mentorProfile.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {mentorProfile.careerStage}
                </div>
                <div className="pt-3 border-t">
                  <div className="text-gray-600 mb-2">Profile Completion</div>
                  <Progress value={mentorProfile.profileComplete} className="mb-2" />
                  <div className="text-xs text-gray-500">{mentorProfile.profileComplete}% Complete</div>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Card>

            {/* Mentoring Types Offered */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Mentoring Types Offered</h3>
              <div className="space-y-2">
                {mentorProfile.mentoringTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Expertise Areas */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Expertise Areas</h3>
              <div className="flex flex-wrap gap-2">
                {mentorProfile.academicBackground.map((area, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Mentoring Styles */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Mentoring Styles</h3>
              <div className="flex flex-wrap gap-2">
                {mentorProfile.mentoringStyles.map((style, index) => (
                  <Badge key={index} className="bg-red-100 text-[#C8102E] text-xs">
                    {style}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Impact Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Sessions</span>
                  <span className="font-semibold">{mentorProfile.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{mentorProfile.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Mentees</span>
                  <span className="font-semibold">{currentMentees.length}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('mentorship')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Mentees
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Mentoring Guide
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}