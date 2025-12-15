import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, Users, MessageSquare, Calendar, Settings, Bell,
  Target, CheckCircle, Clock, GraduationCap,
  Upload, FileText, Send, UserPlus, BarChart3, Star, LogOut
} from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cvUploaded, setCvUploaded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const studentProfile = {
    name: user?.name || 'Student',
    email: user?.email || '',
    expectedGraduation: 'November 2026',
    academicFocus: 'Computer Science',
    profileComplete: 85
  };

  const currentMentor = {
    name: 'Dr. Sarah Mitchell',
    title: 'Senior Data Scientist',
    company: 'Tech Solutions NZ',
    matchedDate: 'March 5, 2026',
    nextSession: 'March 15, 2026',
    sessionsCompleted: 2,
    mentoringType: 'Vocational Mentoring (2-3 sessions)',
    status: 'Active'
  };

  const recommendedMentors = [
    { id: 1, name: 'James Chen', role: 'Software Engineering Lead', company: 'Global Tech Corp', matchScore: 88, availability: 'Available' },
    { id: 2, name: 'Emma Williams', role: 'Cybersecurity Specialist', company: 'SecureNet NZ', matchScore: 85, availability: 'Limited' },
    { id: 3, name: 'Michael Brown', role: 'AI Research Scientist', company: 'Innovation Labs', matchScore: 82, availability: 'Available' }
  ];

  const mentoringMilestones = [
    { title: 'Complete Profile', status: 'completed', progress: 100, date: 'Feb 20, 2026' },
    { title: 'Upload CV', status: 'completed', progress: 100, date: 'Feb 22, 2026' },
    { title: 'Get Matched with Mentor', status: 'completed', progress: 100, date: 'Mar 5, 2026' },
    { title: 'First Mentoring Session', status: 'completed', progress: 100, date: 'Mar 8, 2026' },
    { title: 'Complete 3 Sessions', status: 'in-progress', progress: 67, date: 'In Progress' },
    { title: 'Provide Feedback & Rating', status: 'pending', progress: 0, date: 'Pending' }
  ];

  const recentSessions = [
    { date: 'March 12, 2026', duration: '45 min', topic: 'Career Planning Discussion', notes: 'Discussed career goals and industry expectations', mentor: 'Dr. Sarah Mitchell' },
    { date: 'March 8, 2026', duration: '60 min', topic: 'Introduction & Goal Setting', notes: 'Initial meeting to establish mentoring relationship', mentor: 'Dr. Sarah Mitchell' }
  ];

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return { bg: '#dcfce7', color: '#16a34a' };
    if (score >= 70) return { bg: '#dbeafe', color: '#2563eb' };
    return { bg: '#f3f4f6', color: '#6b7280' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ cursor: 'pointer' }} onClick={handleLogoClick}>
                <img src={waikatoLogo} alt="Waikato" style={{ height: '40px', objectFit: 'contain' }} />
              </div>
              
              <nav style={{ display: 'flex', gap: '1.5rem' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fee2e2', color: '#C8102E', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  <Home size={16} />
                  <span>Dashboard</span>
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', fontWeight: 600 }}>
                  <Users size={16} />
                  <span>Browse Mentors</span>
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', fontWeight: 600 }}>
                  <MessageSquare size={16} />
                  <span>My Matches</span>
                </button>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{ padding: '0.5rem', color: '#6b7280', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}>
                <Bell size={20} />
              </button>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#D50000', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back, {studentProfile.name}!</h1>
          <p style={{ color: '#6b7280' }}>
            Track your mentoring progress and connect with industry professionals
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Target size={32} color="#C8102E" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Mentor</div>
              </div>
              
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <CheckCircle size={32} color="#22c55e" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sessions Done</div>
              </div>
              
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Clock size={32} color="#3b82f6" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Session Pending</div>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <BarChart3 size={32} color="#a855f7" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{studentProfile.profileComplete}%</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Profile Complete</div>
              </div>
            </div>

            {/* Current Mentor */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>My Mentor</h2>
                <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>{currentMentor.status}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.25rem' }}>
                  SM
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{currentMentor.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{currentMentor.title}</p>
                  <p style={{ fontSize: '0.875rem', color: '#C8102E' }}>{currentMentor.company}</p>
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem' }}>
                    {currentMentor.mentoringType}
                  </span>
                </div>

                <button style={{ backgroundColor: '#C8102E', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <MessageSquare size={16} />
                  <span>Open Room</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Matched Since</div>
                  <div style={{ fontWeight: 600 }}>{currentMentor.matchedDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Next Session</div>
                  <div style={{ fontWeight: 600 }}>{currentMentor.nextSession}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sessions Completed</div>
                  <div style={{ fontWeight: 600 }}>{currentMentor.sessionsCompleted} / 3</div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Sessions</h2>
                <button style={{ fontSize: '0.875rem', color: '#6b7280', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', fontWeight: 600 }}>
                  View All
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentSessions.map((session, index) => (
                  <div key={index} style={{ borderLeft: '4px solid #C8102E', paddingLeft: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <h3 style={{ fontWeight: 600 }}>{session.topic}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{session.mentor}</p>
                      </div>
                      <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>{session.duration}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>{session.notes}</p>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{session.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Mentors */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recommended Mentors</h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Based on your profile and interests</p>
                </div>
                <button style={{ fontSize: '0.875rem', color: '#6b7280', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', fontWeight: 600 }}>
                  Browse All
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recommendedMentors.map((mentor) => {
                  const colors = getMatchScoreColor(mentor.matchScore);
                  return (
                    <div key={mentor.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600 }}>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div>
                          <h3 style={{ fontWeight: 600 }}>{mentor.name}</h3>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{mentor.role}</p>
                          <p style={{ fontSize: '0.875rem', color: '#C8102E' }}>{mentor.company}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ display: 'inline-block', backgroundColor: colors.bg, color: colors.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                            {mentor.matchScore}% Match
                          </span>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{mentor.availability}</div>
                        </div>
                        <button style={{ border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                          <Send size={16} />
                          <span>Request</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Profile Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '96px', height: '96px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.5rem', margin: '0 auto 1rem' }}>
                  {studentProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{studentProfile.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{studentProfile.email}</p>
                <span style={{ display: 'inline-block', backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>Student</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Expected Graduation</span>
                  <span style={{ fontWeight: 500 }}>{studentProfile.expectedGraduation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Academic Focus</span>
                  <span style={{ fontWeight: 500 }}>{studentProfile.academicFocus}</span>
                </div>
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Profile Completion</div>
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px', marginBottom: '0.5rem' }}>
                    <div style={{ backgroundColor: '#C8102E', height: '8px', borderRadius: '9999px', width: `${studentProfile.profileComplete}%` }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{studentProfile.profileComplete}% Complete</div>
                </div>
              </div>

              <button style={{ width: '100%', marginTop: '1rem', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Settings size={16} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* CV Status */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>CV Status</h3>
              {cvUploaded ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={20} color="#16a34a" />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>CV Uploaded</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>resume_2026.pdf</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ flex: 1, border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <FileText size={16} />
                      <span style={{ fontSize: '0.875rem' }}>View</span>
                    </button>
                    <button style={{ flex: 1, border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <Upload size={16} />
                      <span style={{ fontSize: '0.875rem' }}>Replace</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', border: '2px dashed #d1d5db', borderRadius: '0.5rem', textAlign: 'center' }}>
                    <Upload size={32} color="#9ca3af" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>No CV uploaded yet</p>
                  </div>
                  <button style={{ width: '100%', backgroundColor: '#C8102E', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Upload size={16} />
                    <span>Upload CV</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mentoring Progress */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Mentoring Journey</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mentoringMilestones.map((milestone, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ marginTop: '0.25rem', borderRadius: '9999px', padding: '0.25rem', backgroundColor: milestone.status === 'completed' ? '#dcfce7' : milestone.status === 'in-progress' ? '#dbeafe' : '#f3f4f6' }}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle size={16} color="#16a34a" />
                      ) : milestone.status === 'in-progress' ? (
                        <Clock size={16} color="#2563eb" />
                      ) : (
                        <div style={{ width: '16px', height: '16px', borderRadius: '9999px', border: '2px solid #d1d5db' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{milestone.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{milestone.date}</div>
                      {milestone.status === 'in-progress' && (
                        <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '4px', marginTop: '0.5rem' }}>
                          <div style={{ backgroundColor: '#3b82f6', height: '4px', borderRadius: '9999px', width: `${milestone.progress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button style={{ width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <UserPlus size={16} />
                  <span>Find More Mentors</span>
                </button>
                <button style={{ width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <MessageSquare size={16} />
                  <span>Message Mentor</span>
                </button>
                <button style={{ width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Calendar size={16} />
                  <span>Schedule Session</span>
                </button>
                <button style={{ width: '100%', border: '1px solid #d1d5db', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Star size={16} />
                  <span>Rate Mentor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
