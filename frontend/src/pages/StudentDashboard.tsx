import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageSquare, Settings,
  Target, CheckCircle, Clock,
  Upload, FileText, BarChart3, Star, LogOut
} from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // TODO: Replace with API call to get CV status
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // TODO: Replace with API call to get student profile
  const studentProfile = {
    name: user?.name || '',
    email: user?.email || '',
    expectedGraduation: '',
    academicFocus: '',
    profileComplete: 0
  };

  // TODO: Replace with API call to get matched mentor
  const currentMentor: {
    name: string;
    title: string;
    company: string;
    email: string;
    matchedDate: string;
    mentoringType: string;
    status: string;
  } | null = null;

  // TODO: Calculate based on actual user progress
  const mentoringMilestones = [
    { title: 'Complete Profile', status: studentProfile.profileComplete >= 100 ? 'completed' : (studentProfile.profileComplete > 0 ? 'in-progress' : 'pending'), progress: studentProfile.profileComplete, date: '' },
    { title: 'Upload CV', status: cvUploaded ? 'completed' : 'pending', progress: cvUploaded ? 100 : 0, date: '' },
    { title: 'Get Matched with Mentor', status: currentMentor ? 'completed' : 'pending', progress: currentMentor ? 100 : 0, date: currentMentor?.matchedDate || '' },
    { title: 'First Contact with Mentor', status: 'pending', progress: 0, date: '' },
    { title: 'Complete Mentoring Programme', status: 'pending', progress: 0, date: '' },
    { title: 'Provide Feedback', status: 'pending', progress: 0, date: '' }
  ];



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
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#D50000', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Welcome back, {studentProfile.name}!</h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Track your mentoring progress and connect with industry professionals
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Target size={24} color="#C8102E" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', lineHeight: '1.2' }}>{currentMentor ? 1 : 0}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.2' }}>Active Mentor</div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <BarChart3 size={24} color="#a855f7" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', lineHeight: '1.2' }}>{studentProfile.profileComplete}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.2' }}>Profile Complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Mentor */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>My Mentor</h2>
                {currentMentor && (
                  <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500 }}>{currentMentor.status}</span>
                )}
              </div>
              
              {currentMentor ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.1rem' }}>
                      {currentMentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.95rem' }}>{currentMentor.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.15rem' }}>{currentMentor.title}</p>
                      <p style={{ fontSize: '0.8rem', color: '#C8102E' }}>{currentMentor.company}</p>
                      <span style={{ display: 'inline-block', marginTop: '0.4rem', backgroundColor: '#f3f4f6', color: '#374151', padding: '0.2rem 0.6rem', borderRadius: '0.375rem', fontSize: '0.7rem' }}>
                        {currentMentor.mentoringType}
                      </span>
                    </div>

                    <a href={`mailto:${currentMentor.email}`} style={{ backgroundColor: '#C8102E', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                      <MessageSquare size={14} />
                      <span>Email</span>
                    </a>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Matched Since</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentMentor.matchedDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Mentor Email</div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{currentMentor.email}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                  <Target size={40} color="#d1d5db" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No mentor assigned yet</p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Complete your profile to get matched</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Profile Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.25rem', margin: '0 auto 0.75rem' }}>
                  {studentProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>{studentProfile.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>{studentProfile.email}</p>
                <span style={{ display: 'inline-block', backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500 }}>Student</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Expected Graduation</span>
                  <span style={{ fontWeight: 500 }}>{studentProfile.expectedGraduation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Academic Focus</span>
                  <span style={{ fontWeight: 500 }}>{studentProfile.academicFocus}</span>
                </div>
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ color: '#6b7280', marginBottom: '0.4rem', fontSize: '0.8rem' }}>Profile Completion</div>
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '6px', marginBottom: '0.3rem' }}>
                    <div style={{ backgroundColor: '#C8102E', height: '6px', borderRadius: '9999px', width: `${studentProfile.profileComplete}%` }}></div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{studentProfile.profileComplete}% Complete</div>
                </div>
              </div>

              <button style={{ width: '100%', marginTop: '0.75rem', border: '1px solid #d1d5db', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <Settings size={14} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* CV Status */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>CV Status</h3>
              {cvUploaded ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle size={18} color="#16a34a" />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>CV Uploaded</div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{cvFileName || 'CV uploaded'}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button style={{ flex: 1, border: '1px solid #d1d5db', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <FileText size={14} />
                      <span style={{ fontSize: '0.8rem' }}>View</span>
                    </button>
                    <button style={{ flex: 1, border: '1px solid #d1d5db', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <Upload size={14} />
                      <span style={{ fontSize: '0.8rem' }}>Replace</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ padding: '0.75rem', border: '2px dashed #d1d5db', borderRadius: '0.5rem', textAlign: 'center' }}>
                    <Upload size={28} color="#9ca3af" style={{ margin: '0 auto 0.4rem' }} />
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>No CV uploaded yet</p>
                  </div>
                  <button style={{ width: '100%', backgroundColor: '#C8102E', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                    <Upload size={14} />
                    <span>Upload CV</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mentoring Progress */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Mentoring Journey</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {mentoringMilestones.map((milestone, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{ marginTop: '0.15rem', borderRadius: '9999px', padding: '0.2rem', backgroundColor: milestone.status === 'completed' ? '#dcfce7' : milestone.status === 'in-progress' ? '#dbeafe' : '#f3f4f6' }}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle size={14} color="#16a34a" />
                      ) : milestone.status === 'in-progress' ? (
                        <Clock size={14} color="#2563eb" />
                      ) : (
                        <div style={{ width: '14px', height: '14px', borderRadius: '9999px', border: '2px solid #d1d5db' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{milestone.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{milestone.date}</div>
                      {milestone.status === 'in-progress' && (
                        <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '3px', marginTop: '0.4rem' }}>
                          <div style={{ backgroundColor: '#3b82f6', height: '3px', borderRadius: '9999px', width: `${milestone.progress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Quick Actions</h3>
              <button style={{ width: '100%', border: '1px solid #d1d5db', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                <Star size={14} />
                <span>Provide Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
