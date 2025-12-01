import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  MessageSquare,
  Send,
  Paperclip,
  Video,
  Calendar,
  FileText,
  Download,
  Upload,
  ChevronLeft,
  MoreVertical,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Link as LinkIcon,
  Trash2,
  Edit3,
  Plus,
} from "lucide-react";

interface MentoringRoomProps {
  onNavigate: (page: string) => void;
  userType: "student" | "mentor";
  matchId: string;
}

export function MentoringRoom({
  onNavigate,
  userType,
  matchId,
}: MentoringRoomProps) {
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  // Match information
  const matchInfo = {
    student: {
      name: "Ravi Kumar",
      studentId: "S12345678",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      academicFocus: "Computer Science",
    },
    mentor: {
      name: "Dr. Sarah Mitchell",
      title: "Senior Data Scientist",
      company: "Tech Solutions NZ",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    },
    matchedDate: "March 5, 2026",
    mentoringType: "Vocational Mentoring (2-3 sessions)",
    status: "Active",
  };

  // Chat messages
  const messages = [
    {
      id: 1,
      sender: "mentor",
      senderName: "Dr. Sarah Mitchell",
      message:
        "Hi Ravi! Great to be matched with you. Looking forward to our mentoring journey together.",
      timestamp: "March 5, 2026 10:30 AM",
      avatar: matchInfo.mentor.avatar,
    },
    {
      id: 2,
      sender: "student",
      senderName: "Ravi Kumar",
      message:
        "Thank you! I'm really excited to learn from your experience in data science.",
      timestamp: "March 5, 2026 11:15 AM",
      avatar: matchInfo.student.avatar,
    },
    {
      id: 3,
      sender: "mentor",
      senderName: "Dr. Sarah Mitchell",
      message:
        "I've scheduled our first session for next week. Please upload your CV so I can review it before we meet.",
      timestamp: "March 6, 2026 2:00 PM",
      avatar: matchInfo.mentor.avatar,
    },
    {
      id: 4,
      sender: "student",
      senderName: "Ravi Kumar",
      message:
        "Perfect! I've just uploaded my CV. Looking forward to discussing my career goals with you.",
      timestamp: "March 6, 2026 4:30 PM",
      avatar: matchInfo.student.avatar,
    },
    {
      id: 5,
      sender: "mentor",
      senderName: "Dr. Sarah Mitchell",
      message:
        "I've reviewed your CV - looks great! Let's focus on your transition into the data science field during our next session.",
      timestamp: "March 12, 2026 9:00 AM",
      avatar: matchInfo.mentor.avatar,
    },
  ];

  // Session logs
  const sessions = [
    {
      id: 1,
      date: "March 8, 2026",
      duration: "60 min",
      topic: "Introduction & Goal Setting",
      type: "Vocational Mentoring",
      status: "Completed",
      notes:
        "Discussed Ravi's background, career aspirations in data science, and set goals for the mentoring relationship.",
      goals: [
        "Understand the data science industry landscape",
        "Develop technical skills in Python and ML",
        "Prepare for job applications",
      ],
      actionItems: [
        {
          task: "Complete online Python course",
          assignedTo: "student",
          status: "in-progress",
        },
        {
          task: "Review and provide feedback on CV",
          assignedTo: "mentor",
          status: "completed",
        },
      ],
      meetingLink: "https://zoom.us/j/123456789",
    },
    {
      id: 2,
      date: "March 12, 2026",
      duration: "45 min",
      topic: "Career Planning Discussion",
      type: "Vocational Mentoring",
      status: "Completed",
      notes:
        "Covered industry expectations, skill requirements, and career pathways in data science. Discussed Ravi's CV and areas for improvement.",
      goals: [
        "Identify target companies and roles",
        "Understand required technical skills",
        "Build a career roadmap",
      ],
      actionItems: [
        {
          task: "Research 5 target companies",
          assignedTo: "student",
          status: "pending",
        },
        {
          task: "Prepare mock interview questions",
          assignedTo: "mentor",
          status: "pending",
        },
      ],
      meetingLink: "https://zoom.us/j/987654321",
    },
  ];

  // Next session
  const nextSession = {
    date: "March 15, 2026",
    time: "2:00 PM",
    topic: "Technical Skills & Career Development",
    type: "Vocational Mentoring",
    duration: "60 min",
    meetingLink: "https://zoom.us/j/456789123",
    agenda: [
      "Review progress on action items",
      "Discuss technical skill development",
      "Career development strategies",
      "Q&A session",
    ],
  };

  // Shared documents
  const documents = [
    {
      id: 1,
      name: "Ravi_Kumar_CV_2026.pdf",
      uploadedBy: "student",
      uploadDate: "March 6, 2026",
      size: "245 KB",
      type: "CV",
    },
    {
      id: 2,
      name: "Data_Science_Career_Guide.pdf",
      uploadedBy: "mentor",
      uploadDate: "March 8, 2026",
      size: "1.2 MB",
      type: "Resource",
    },
    {
      id: 3,
      name: "Session_1_Notes.pdf",
      uploadedBy: "mentor",
      uploadDate: "March 8, 2026",
      size: "156 KB",
      type: "Session Notes",
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In real app, this would send to backend
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const otherPerson =
    userType === "student"
      ? matchInfo.mentor
      : matchInfo.student;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onNavigate(
                    userType === "student"
                      ? "student-dashboard"
                      : "alumni-dashboard",
                  )
                }
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherPerson.avatar} />
                  <AvatarFallback>
                    {otherPerson.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {otherPerson.name}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {userType === "student"
                      ? otherPerson.company
                      : otherPerson.academicFocus}
                  </p>
                </div>
              </div>

              <Badge className="bg-green-100 text-green-700">
                {matchInfo.status}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Join Meeting
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Tabs */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col"
              >
                <div className="border-b px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                    </TabsTrigger>
                    <TabsTrigger value="sessions">
                      <Calendar className="h-4 w-4 mr-2" />
                      Sessions
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Chat Tab */}
                <TabsContent
                  value="chat"
                  className="flex-1 flex flex-col m-0"
                >
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start space-x-3 ${
                          msg.sender === userType
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>
                            {msg.senderName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex-1 ${msg.sender === userType ? "text-right" : ""}`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {msg.sender !== userType && (
                              <>
                                <span className="text-sm font-medium">
                                  {msg.senderName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {msg.timestamp}
                                </span>
                              </>
                            )}
                            {msg.sender === userType && (
                              <>
                                <span className="text-xs text-gray-500">
                                  {msg.timestamp}
                                </span>
                                <span className="text-sm font-medium">
                                  {msg.senderName}
                                </span>
                              </>
                            )}
                          </div>
                          <div
                            className={`inline-block px-4 py-2 rounded-lg ${
                              msg.sender === userType
                                ? "bg-[#C8102E] text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) =>
                          setMessageInput(e.target.value)
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          handleSendMessage()
                        }
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                      />
                      <Button
                        className="bg-[#C8102E] hover:bg-[#A00D24]"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Sessions Tab */}
                <TabsContent
                  value="sessions"
                  className="flex-1 overflow-y-auto p-6 m-0"
                >
                  <div className="space-y-6">
                    {/* Next Session */}
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-[#C8102E]" />
                        Next Session
                      </h3>
                      <Card className="p-5 bg-blue-50 border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold mb-1">
                              {nextSession.topic}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {nextSession.date}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {nextSession.time}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="mt-2"
                            >
                              {nextSession.type}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#C8102E] hover:bg-[#A00D24]"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </div>
                        <div className="pt-4 border-t">
                          <div className="text-sm font-medium mb-2">
                            Agenda:
                          </div>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {nextSession.agenda.map(
                              (item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start"
                                >
                                  <span className="mr-2">
                                    •
                                  </span>
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </Card>
                    </div>

                    {/* Past Sessions */}
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Completed Sessions ({sessions.length})
                      </h3>
                      <div className="space-y-4">
                        {sessions.map((session) => (
                          <Card
                            key={session.id}
                            className="p-5"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold mb-1">
                                  {session.topic}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>{session.date}</span>
                                  <span>•</span>
                                  <span>
                                    {session.duration}
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700">
                                {session.status}
                              </Badge>
                            </div>

                            <div className="mb-3">
                              <div className="text-sm font-medium mb-1">
                                Notes:
                              </div>
                              <p className="text-sm text-gray-700">
                                {session.notes}
                              </p>
                            </div>

                            <div className="mb-3">
                              <div className="text-sm font-medium mb-2">
                                Goals Set:
                              </div>
                              <ul className="space-y-1">
                                {session.goals.map(
                                  (goal, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start text-sm text-gray-700"
                                    >
                                      <Target className="h-4 w-4 mr-2 mt-0.5 text-[#C8102E] flex-shrink-0" />
                                      {goal}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div>
                              <div className="text-sm font-medium mb-2">
                                Action Items:
                              </div>
                              <div className="space-y-2">
                                {session.actionItems.map(
                                  (item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                                    >
                                      <div className="flex items-center space-x-2">
                                        {item.status ===
                                        "completed" ? (
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <Clock className="h-4 w-4 text-orange-500" />
                                        )}
                                        <span
                                          className={
                                            item.status ===
                                            "completed"
                                              ? "line-through text-gray-500"
                                              : ""
                                          }
                                        >
                                          {item.task}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {item.assignedTo ===
                                        userType
                                          ? "You"
                                          : "Partner"}
                                      </Badge>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                Edit Notes
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                Meeting Link
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent
                  value="documents"
                  className="flex-1 overflow-y-auto p-6 m-0"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        Shared Documents
                      </h3>
                      <Button
                        size="sm"
                        className="bg-[#C8102E] hover:bg-[#A00D24]"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <Card
                          key={doc.id}
                          className="p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                                <FileText className="h-5 w-5 text-[#C8102E]" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {doc.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Uploaded by{" "}
                                  {doc.uploadedBy === userType
                                    ? "You"
                                    : otherPerson.name}{" "}
                                  • {doc.uploadDate} •{" "}
                                  {doc.size}
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="mt-1 text-xs"
                                >
                                  {doc.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {doc.uploadedBy === userType && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {documents.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="mb-4">
                          No documents shared yet
                        </p>
                        <Button className="bg-[#C8102E] hover:bg-[#A00D24]">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload First Document
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar - Match Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">
                Match Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">
                    Matched Since
                  </div>
                  <div className="font-medium">
                    {matchInfo.matchedDate}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">
                    Mentoring Type
                  </div>
                  <Badge variant="secondary">
                    {matchInfo.mentoringType}
                  </Badge>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">
                    Status
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {matchInfo.status}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">
                Progress Tracking
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Sessions Completed</span>
                    <span className="font-semibold">2 / 3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#C8102E] h-2 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="text-center">
                    <div className="font-semibold">
                      {sessions.length}
                    </div>
                    <div className="text-xs text-gray-600">
                      Meetings
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {documents.length}
                    </div>
                    <div className="text-xs text-gray-600">
                      Documents
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Session Notes
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Mentoring Guide
                </Button>
              </div>
            </Card>

            {userType === "student" && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">
                  Rate Your Mentor
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Share your experience after completing the
                  mentoring programme
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Rate Mentor (After Completion)
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}