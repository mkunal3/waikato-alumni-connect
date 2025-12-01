import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Users, TrendingUp, MessageSquare, ArrowRight, Star, 
  GraduationCap, Briefcase, Calendar, CheckCircle, 
  Target, Award, Clock, Video 
} from 'lucide-react';

interface LandingProps {
  onNavigate: (page: string, type?: 'alumni' | 'student') => void;
}

export function Landing({ onNavigate }: LandingProps) {
  // Current phase for the mentoring programme
  const currentPhase = {
    name: "Matching Period",
    status: "active",
    endsIn: "14 days"
  };

  const mentorTypes = [
    {
      icon: MessageSquare,
      title: "One-Off Advice",
      description: "Quick support via phone, email, or a single meeting for CV tips, interview prep, and industry insights.",
      duration: "Single session"
    },
    {
      icon: Users,
      title: "Vocational Mentoring",
      description: "2-3 sessions with deeper guidance on industry expectations, goal setting, and career planning.",
      duration: "2-3 sessions"
    },
    {
      icon: Briefcase,
      title: "Employment Opportunities",
      description: "Access workplace visits, internship opportunities, and work experience placements.",
      duration: "Ongoing"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Register",
      description: "Complete your profile with your academic focus and mentoring preferences"
    },
    {
      step: "2",
      title: "Browse & Match",
      description: "Explore recommended mentors with match scores or browse all available mentors"
    },
    {
      step: "3",
      title: "Connect",
      description: "Send a match request to your preferred mentor and wait for acceptance"
    },
    {
      step: "4",
      title: "Grow",
      description: "Meet with your mentor, track your sessions, and achieve your career goals"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-[#C8102E]" />
            <span className="font-bold text-xl">Waikato Navigator</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate('directory')}>
              Browse Mentors
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('student-dashboard', 'student')}
              className="border-[#C8102E] text-[#C8102E] hover:bg-red-50"
            >
              Student Login
            </Button>
            <Button 
              className="bg-[#C8102E] hover:bg-[#A00D24]"
              onClick={() => onNavigate('alumni-dashboard', 'alumni')}
            >
              Mentor Login
            </Button>
          </div>
        </div>
      </header>

      {/* Current Phase Banner */}
      {currentPhase.status === 'active' && (
        <div className="bg-[#C8102E] text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Current Phase: {currentPhase.name}</span>
              <Badge className="bg-white text-[#C8102E]">
                Ends in {currentPhase.endsIn}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-red-100 text-[#C8102E] hover:bg-red-100">
                  🎓 Waikato Navigator Mentoring Programme
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Navigate Your Career
                  <span className="text-[#C8102E] block">With Expert Guidance</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with University of Waikato alumni for personalized mentorship. 
                  Get career advice, develop skills, and access opportunities in your field.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#C8102E] hover:bg-[#A00D24] text-white px-8 py-6 text-lg"
                  onClick={() => onNavigate('student-dashboard', 'student')}
                >
                  Register as Student
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-red-200 hover:bg-red-50"
                  onClick={() => onNavigate('alumni-dashboard', 'alumni')}
                >
                  Become a Mentor
                </Button>
              </div>

              {/* Programme Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <Card className="p-6 text-center border-red-100 bg-white/50 backdrop-blur">
                  <div className="text-2xl font-bold text-[#C8102E]">4 months</div>
                  <div className="text-sm text-gray-600">Programme Duration</div>
                </Card>
                <Card className="p-6 text-center border-green-100 bg-white/50 backdrop-blur">
                  <div className="text-2xl font-bold text-green-600">1:1</div>
                  <div className="text-sm text-gray-600">Mentoring Pairs</div>
                </Card>
                <Card className="p-6 text-center border-purple-100 bg-white/50 backdrop-blur">
                  <div className="text-2xl font-bold text-purple-600">CMS</div>
                  <div className="text-sm text-gray-600">Final Year Students</div>
                </Card>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1080&h=720&fit=crop"
                alt="Mentoring session"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="text-sm">
                    <div className="font-semibold">Pilot Programme</div>
                    <div className="text-gray-500">Starting March 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Types of Mentoring */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Three Types of Mentoring</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the mentoring style that fits your needs and career goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {mentorTypes.map((type, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-6">
                  <type.icon className="h-8 w-8 text-[#C8102E]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <Badge variant="secondary" className="mb-4">{type.duration}</Badge>
                <p className="text-gray-600 leading-relaxed">{type.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Four simple steps to connect with your ideal mentor
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C8102E] text-white rounded-full text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Programme Guide</h2>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to know about the Waikato Navigator Mentoring Programme
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-8 w-8 text-[#C8102E]" />
                <h3 className="text-2xl font-semibold">For Students</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Available to final year CMS students at University of Waikato</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Upload your CV and complete your academic profile</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Choose your preferred mentoring styles and career interests</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Get matched with one mentor for the 4-month programme</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8 text-[#C8102E]" />
                <h3 className="text-2xl font-semibold">For Mentors</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Open to all University of Waikato alumni</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Share your professional expertise and career journey</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Choose from three flexible mentoring types</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Give back to your alma mater and shape future careers</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Video Placeholder */}
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <Video className="h-10 w-10 text-[#C8102E]" />
              </div>
              <h3 className="text-2xl font-semibold">Watch: How to Use the Platform</h3>
              <p className="text-gray-600 max-w-2xl">
                Learn how to create your profile, browse mentors, send match requests, 
                and make the most of your mentoring experience.
              </p>
              <Button variant="outline" size="lg">
                Watch Tutorial Video
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#C8102E]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start your mentoring journey?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join the Waikato Navigator programme and take the next step in your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#C8102E] hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={() => onNavigate('student-dashboard', 'student')}
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#C8102E] px-8 py-6 text-lg"
              onClick={() => onNavigate('directory')}
            >
              Browse Mentors
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-red-400" />
                <span className="font-bold text-xl">Waikato Navigator</span>
              </div>
              <p className="text-gray-400">
                Connecting CMS students with University of Waikato alumni for meaningful mentorship and career development.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Programme</h4>
              <div className="space-y-2 text-gray-400">
                <div>Mentor Types</div>
                <div>How It Works</div>
                <div>FAQ</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-gray-400">
                <div>Careers & Employability</div>
                <div>Alumni Relations</div>
                <div>University of Waikato</div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Waikato Navigator Mentoring Programme. University of Waikato.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}