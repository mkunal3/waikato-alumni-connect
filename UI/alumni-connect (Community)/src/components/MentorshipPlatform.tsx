import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Users,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Heart,
  Brain,
  Lightbulb,
  GraduationCap,
  Building2,
} from "lucide-react";

interface MentorshipPlatformProps {
  onNavigate: (
    page: string,
    type?: "alumni" | "student",
  ) => void;
  userType: "alumni" | "student" | null;
}

export function MentorshipPlatform({
  onNavigate,
  userType,
}: MentorshipPlatformProps) {
  const [activeTab, setActiveTab] = useState(
    userType === "alumni" ? "mentees" : "mentors",
  );

  const activeMentorships = [
    {
      id: 1,
      name:
        userType === "alumni" ? "Rohan Kumar" : "Priya Sharma",
      role:
        userType === "alumni"
          ? "Computer Science Student"
          : "Senior Software Engineer",
      company: userType === "alumni" ? "Final Year" : "Google",
      avatar:
        userType === "alumni"
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
          : "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      goals: [
        "Career Transition",
        "Technical Skills",
        "Interview Prep",
      ],
      progress: 75,
      nextSession: "Tomorrow, 4:00 PM",
      totalSessions: 8,
      completedSessions: 6,
      rating: 4.9,
    },
    {
      id: 2,
      name:
        userType === "alumni" ? "Sneha Patel" : "Rahul Verma",
      role:
        userType === "alumni"
          ? "Electronics Student"
          : "Product Manager",
      company: userType === "alumni" ? "3rd Year" : "Microsoft",
      avatar:
        userType === "alumni"
          ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      goals: [
        "Product Strategy",
        "Leadership",
        "Career Growth",
      ],
      progress: 45,
      nextSession: "Dec 18, 6:00 PM",
      totalSessions: 10,
      completedSessions: 4,
      rating: 4.8,
    },
  ];

  const suggestedMatches = [
    {
      id: 1,
      name: "Dr. Anita Gupta",
      role: "AI Research Director",
      company: "Microsoft Research",
      expertise: [
        "Machine Learning",
        "Research",
        "PhD Guidance",
      ],
      experience: "12 years",
      rating: 4.9,
      sessions: 200,
      matchScore: 95,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      reason:
        "Perfect match for your AI/ML career goals and research interests",
    },
    {
      id: 2,
      name: "Vikram Mehta",
      role: "Engineering Manager",
      company: "Amazon",
      expertise: [
        "System Design",
        "Leadership",
        "Team Management",
      ],
      experience: "10 years",
      rating: 4.8,
      sessions: 150,
      matchScore: 92,
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      reason:
        "Great fit for engineering leadership and system design mentorship",
    },
    {
      id: 3,
      name: "Maya Singh",
      role: "UX Design Lead",
      company: "Meta",
      expertise: [
        "UI/UX Design",
        "Design Systems",
        "User Research",
      ],
      experience: "8 years",
      rating: 4.7,
      sessions: 120,
      matchScore: 88,
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      reason:
        "Excellent mentor for design thinking and user experience",
    },
  ];

  const mentorshipRequests = [
    {
      id: 1,
      name: "Arjun Patel",
      program: "Computer Science",
      year: "2024",
      topic: "Career transition to Product Management",
      message:
        "Hi! I'm interested in transitioning from engineering to PM. Would love your guidance on building PM skills and making the switch.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      requestedDate: "2 days ago",
    },
    {
      id: 2,
      name: "Kavya Sharma",
      program: "Electronics Engineering",
      year: "2025",
      topic: "Interview preparation for tech companies",
      message:
        "I have upcoming interviews at FAANG companies. Looking for guidance on technical interviews and system design.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      requestedDate: "1 day ago",
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      mentorName:
        userType === "alumni" ? "Rohan Kumar" : "Priya Sharma",
      topic: "Career Planning & Goal Setting",
      date: "Tomorrow",
      time: "4:00 PM",
      duration: "60 mins",
      type: "Video Call",
      avatar:
        userType === "alumni"
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
          : "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      mentorName:
        userType === "alumni" ? "Sneha Patel" : "Rahul Verma",
      topic: "Technical Interview Preparation",
      date: "Dec 18",
      time: "6:00 PM",
      duration: "45 mins",
      type: "Video Call",
      avatar:
        userType === "alumni"
          ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-[#C8102E]" />
                <span className="font-bold text-xl">
                  Waikato Alumni Connect
                </span>
              </div>

              <nav className="hidden md:flex space-x-6">
                <Button
                  variant="ghost"
                  onClick={() =>
                    onNavigate(
                      userType === "alumni"
                        ? "alumni-dashboard"
                        : "student-dashboard",
                    )
                  }
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("directory")}
                >
                  Directory
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 bg-red-50 text-[#C8102E]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Mentorship</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("events")}
                >
                  Events
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Removed user avatar and badge */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {userType === "alumni"
              ? "Mentorship Hub"
              : "Find Your Mentor"}
          </h1>
          <p className="text-gray-600">
            {userType === "alumni"
              ? "Guide the next generation and share your expertise"
              : "Connect with experienced alumni to accelerate your career growth"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
              <Users className="h-6 w-6 text-[#C8102E]" />
            </div>
            <div className="text-2xl font-bold">
              {userType === "alumni" ? "12" : "2"}
            </div>
            <div className="text-sm text-gray-600">
              Active{" "}
              {userType === "alumni" ? "Mentees" : "Mentors"}
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold">
              {userType === "alumni" ? "48" : "14"}
            </div>
            <div className="text-sm text-gray-600">
              Total Sessions
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">4.9</div>
            <div className="text-sm text-gray-600">
              Average Rating
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-gray-600">
              Success Rate
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value={
                    userType === "alumni"
                      ? "mentees"
                      : "mentors"
                  }
                >
                  {userType === "alumni"
                    ? "My Mentees"
                    : "My Mentors"}
                </TabsTrigger>
                <TabsTrigger
                  value={
                    userType === "alumni"
                      ? "requests"
                      : "discover"
                  }
                >
                  {userType === "alumni"
                    ? "Requests"
                    : "Discover"}
                </TabsTrigger>
                <TabsTrigger value="sessions">
                  Sessions
                </TabsTrigger>
              </TabsList>

              {/* Active Mentorships Tab */}
              <TabsContent
                value={
                  userType === "alumni" ? "mentees" : "mentors"
                }
                className="space-y-6"
              >
                {activeMentorships.map((mentorship) => (
                  <Card key={mentorship.id} className="p-6">
                    <div className="flex items-start space-x-6">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={mentorship.avatar} />
                        <AvatarFallback>
                          {mentorship.name[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {mentorship.name}
                            </h3>
                            <p className="text-gray-600">
                              {mentorship.role}
                            </p>
                            <p className="text-sm text-gray-500">
                              {mentorship.company}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">
                                {mentorship.rating}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {mentorship.completedSessions}/
                              {mentorship.totalSessions}{" "}
                              sessions
                            </p>
                          </div>
                        </div>

                        {/* Goals */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">
                            Focus Areas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {mentorship.goals.map(
                              (goal, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                >
                                  {goal}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Progress
                            </span>
                            <span className="text-sm text-gray-600">
                              {mentorship.progress}%
                            </span>
                          </div>
                          <Progress
                            value={mentorship.progress}
                            className="h-2"
                          />
                        </div>

                        {/* Next Session */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Next session:{" "}
                              {mentorship.nextSession}
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-1" />
                              Join Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Requests/Discover Tab */}
              <TabsContent
                value={
                  userType === "alumni"
                    ? "requests"
                    : "discover"
                }
                className="space-y-6"
              >
                {userType === "alumni" ? (
                  // Mentorship Requests for Alumni
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        Pending Requests
                      </h2>
                      <Badge variant="secondary">
                        {mentorshipRequests.length} new
                      </Badge>
                    </div>

                    {mentorshipRequests.map((request) => (
                      <Card key={request.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.avatar} />
                            <AvatarFallback>
                              {request.name[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">
                                  {request.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {request.program} • Class of{" "}
                                  {request.year}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {request.requestedDate}
                              </span>
                            </div>

                            <div className="mb-3">
                              <p className="font-medium text-sm mb-1">
                                Topic: {request.topic}
                              </p>
                              <p className="text-sm text-gray-700">
                                {request.message}
                              </p>
                            </div>

                            <div className="flex space-x-3">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                Schedule Call
                              </Button>
                              <Button size="sm" variant="ghost">
                                Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </>
                ) : (
                  // Suggested Mentors for Students
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        AI-Suggested Matches
                      </h2>
                      <Button variant="outline" size="sm">
                        <Brain className="h-4 w-4 mr-2" />
                        Refine Matches
                      </Button>
                    </div>

                    {suggestedMatches.map((mentor) => (
                      <Card key={mentor.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={mentor.avatar} />
                            <AvatarFallback>
                              {mentor.name[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-lg font-semibold">
                                  {mentor.name}
                                </h4>
                                <p className="text-gray-600">
                                  {mentor.role}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Building2 className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {mentor.company}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center space-x-1 mb-1">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <span className="font-bold text-green-600">
                                    {mentor.matchScore}% match
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">
                                    {mentor.rating} (
                                    {mentor.sessions} sessions)
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {mentor.expertise.map(
                                  (skill, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                    >
                                      {skill}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>

                            <div className="bg-red-50 p-3 rounded-lg mb-4">
                              <div className="flex items-center space-x-2 mb-1">
                                <Lightbulb className="h-4 w-4 text-[#C8102E]" />
                                <span className="text-sm font-medium text-red-800">
                                  Why this match?
                                </span>
                              </div>
                              <p className="text-sm text-red-700">
                                {mentor.reason}
                              </p>
                            </div>

                            <div className="flex space-x-3">
                              <Button
                                size="sm"
                                className="bg-[#C8102E] hover:bg-[#A00D24]"
                              >
                                Request Mentorship
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                View Full Profile
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </>
                )}
              </TabsContent>

              {/* Sessions Tab */}
              <TabsContent
                value="sessions"
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Upcoming Sessions
                  </h2>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New
                  </Button>
                </div>

                {upcomingSessions.map((session) => (
                  <Card key={session.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={session.avatar} />
                        <AvatarFallback>
                          {session.mentorName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">
                              {session.topic}
                            </h4>
                            <p className="text-sm text-gray-600">
                              with {session.mentorName}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{session.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{session.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Video className="h-4 w-4" />
                                <span>{session.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                {userType === "alumni" ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Set Availability
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Update Expertise
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      View Impact Report
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => onNavigate("directory")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Browse Mentors
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Set Career Goals
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learning Resources
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Resource Library */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">
                Resource Library
              </h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-5 w-5 text-[#C8102E]" />
                    <div>
                      <h5 className="font-medium text-sm">
                        Mentorship Guide
                      </h5>
                      <p className="text-xs text-gray-600">
                        Best practices & tips
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Download PDF
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Video className="h-5 w-5 text-green-600" />
                    <div>
                      <h5 className="font-medium text-sm">
                        Career Planning Webinar
                      </h5>
                      <p className="text-xs text-gray-600">
                        45 min session
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Watch Now
                  </Button>
                </div>
              </div>
            </Card>

            {/* Success Metrics */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">
                {userType === "alumni"
                  ? "Your Impact"
                  : "Your Progress"}
              </h4>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#C8102E]">
                    {userType === "alumni" ? "12" : "75%"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {userType === "alumni"
                      ? "Lives Impacted"
                      : "Goal Achievement"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {userType === "alumni"
                        ? "Success Stories"
                        : "Skills Improved"}
                    </span>
                    <span className="font-semibold">
                      {userType === "alumni" ? "8" : "12"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      {userType === "alumni"
                        ? "Total Hours"
                        : "Sessions Completed"}
                    </span>
                    <span className="font-semibold">
                      {userType === "alumni" ? "96h" : "14"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}