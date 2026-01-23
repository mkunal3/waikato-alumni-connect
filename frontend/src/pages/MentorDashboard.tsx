import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest, API_BASE_URL } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { ProfileResponse } from '../types/auth';
import { 
  MessageSquare, Users, Mail, CheckCircle, LogOut,
  XCircle, FileText, Calendar, GraduationCap, Settings, ArrowLeft, ChevronDown, ChevronUp
} from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

export function MentorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileResponse['user'] | null>(null);
  const [currentMentees, setCurrentMentees] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [selectedMentee, setSelectedMentee] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'menteeDetail'>('list');
  const [expandedWorkExp, setExpandedWorkExp] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [expandedCertification, setExpandedCertification] = useState<number | null>(null);
  const [coverLetterExpanded, setCoverLetterExpanded] = useState<boolean>(false);
  const [profileExpanded, setProfileExpanded] = useState<boolean>(false);
  const myMenteesSectionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileResponse, menteesResponse, requestsResponse] = await Promise.allSettled([
          apiRequest<ProfileResponse>(API_ENDPOINTS.profile),
          apiRequest<any[]>(API_ENDPOINTS.myMentees).catch(() => []),
          apiRequest<any[]>(API_ENDPOINTS.pendingRequests).catch(() => [])
        ]);

        if (profileResponse.status === 'fulfilled') {
          setProfileData(profileResponse.value.user);
        } else {
          setProfileData(null);
        }

        if (menteesResponse.status === 'fulfilled') {
          setCurrentMentees(menteesResponse.value || []);
        } else {
          setCurrentMentees([]);
        }

        if (requestsResponse.status === 'fulfilled') {
          setPendingRequests(requestsResponse.value || []);
        } else {
          setPendingRequests([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setProfileData(null);
        setCurrentMentees([]);
        setPendingRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleViewRequestDetail = (request: any) => {
    setSelectedRequest(request);
    setViewMode('detail');
    // Reset expanded states when viewing a new request
    setCoverLetterExpanded(false);
    setProfileExpanded(false);
    setExpandedWorkExp(null);
    setExpandedProject(null);
    setExpandedCertification(null);
  };

  const handleBackToRequestsList = () => {
    setViewMode('list');
    setSelectedRequest(null);
  };

  const handleViewMenteeDetail = (mentee: any) => {
    setSelectedMentee(mentee);
    setViewMode('menteeDetail');
    // Reset expanded states
    setExpandedWorkExp(null);
    setExpandedProject(null);
    setExpandedCertification(null);
  };

  const handleBackToMenteesList = () => {
    setViewMode('list');
    setSelectedMentee(null);
  };

  const scrollToMyMentees = () => {
    if (myMenteesSectionRef.current) {
      myMenteesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Small offset to account for sticky header
      window.scrollBy(0, -80);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please log in to accept requests');
        return;
      }

      await apiRequest(API_ENDPOINTS.acceptRequest(requestId), {
        method: 'POST',
      });

      // Refresh data
      const [menteesResponse, requestsResponse] = await Promise.allSettled([
        apiRequest<any[]>(API_ENDPOINTS.myMentees).catch(() => []),
        apiRequest<any[]>(API_ENDPOINTS.pendingRequests).catch(() => [])
      ]);

      if (menteesResponse.status === 'fulfilled') {
        setCurrentMentees(menteesResponse.value || []);
      }
      if (requestsResponse.status === 'fulfilled') {
        setPendingRequests(requestsResponse.value || []);
      }

      // If viewing detail, go back to list
      if (viewMode === 'detail' && selectedRequest && selectedRequest.id === requestId) {
        setViewMode('list');
        setSelectedRequest(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept request');
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to decline this request?')) {
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please log in to decline requests');
        return;
      }

      await apiRequest(API_ENDPOINTS.declineRequest(requestId), {
        method: 'POST',
      });

      // Refresh pending requests
      const requestsResponse = await Promise.allSettled([
        apiRequest<any[]>(API_ENDPOINTS.pendingRequests).catch(() => [])
      ]);

      if (requestsResponse[0].status === 'fulfilled') {
        setPendingRequests(requestsResponse[0].value || []);
      }

      // If viewing detail, go back to list
      if (viewMode === 'detail' && selectedRequest && selectedRequest.id === requestId) {
        setViewMode('list');
        setSelectedRequest(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline request');
    }
  };

  const mentorProfile = {
    name: profileData?.name || user?.name || '',
    email: profileData?.email || user?.email || '',
    graduationYear: profileData?.graduationYear || '',
    currentCompany: profileData?.currentCompany || '',
    currentPosition: profileData?.currentPosition || '',
    totalSessions: 0,
  };

  const stats = {
    activeMentees: currentMentees.length,
    pendingRequests: pendingRequests.length,
    totalSessions: mentorProfile.totalSessions,
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

      {/* Error Message */}
      {error && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <p style={{ color: '#6b7280' }}>Loading...</p>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                Welcome back, {mentorProfile.name.split(' ')[0]}!
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Manage your mentoring relationships and help students achieve their goals
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              {/* Main Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div 
                    onClick={scrollToMyMentees}
                    style={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.75rem', 
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                      border: '1px solid #e5e7eb', 
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C8102E';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <Users size={24} color="#C8102E" />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.activeMentees}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Mentees</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>Click to view</div>
                  </div>
                </div>

                {/* Pending Match Requests List */}
                {viewMode === 'list' && (
                  <>
                    {pendingRequests.length > 0 ? (
                      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '2px solid #C8102E', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Pending Match Requests</h2>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Review and respond to student requests</p>
                          </div>
                          <span style={{ backgroundColor: '#C8102E', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                            {pendingRequests.length} New
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {pendingRequests.map((request) => (
                            <div 
                              key={request.id} 
                              onClick={() => handleViewRequestDetail(request)}
                              style={{ 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '0.5rem', 
                                padding: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = '#C8102E';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                  <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600 }}>
                                    {request.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                      <h3 style={{ fontWeight: 600 }}>{request.name}</h3>
                                      {request.matchScore && (
                                        <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                                          {request.matchScore}% Match
                                        </span>
                                      )}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{request.studentId || request.email}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                                      {request.academicFocus && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                          <GraduationCap size={14} />
                                          {request.academicFocus}
                                        </span>
                                      )}
                                      {request.expectedGraduation && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                          <Calendar size={14} />
                                          Grad: {request.expectedGraduation}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                                Click to view details
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem', textAlign: 'center' }}>
                        <Mail size={40} color="#d1d5db" style={{ margin: '0 auto 0.75rem' }} />
                        <p style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>No pending requests</p>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>You're all caught up!</p>
                      </div>
                    )}
                  </>
                )}

                {/* Request Detail View */}
                {viewMode === 'detail' && selectedRequest && (
                  <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <button
                        onClick={handleBackToRequestsList}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#C8102E';
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Student Match Request Details</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Student Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.25rem', flexShrink: 0 }}>
                          {selectedRequest.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedRequest.name}</h3>
                            {selectedRequest.matchScore && (
                              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                                {selectedRequest.matchScore}% Match
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{selectedRequest.email}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Student ID: {selectedRequest.studentId || 'Not provided'}</p>
                        </div>
                      </div>

                      {/* Cover Letter Card */}
                      {selectedRequest.coverLetter && (
                        <div
                          onClick={() => setCoverLetterExpanded(!coverLetterExpanded)}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#C8102E';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Cover Letter</h3>
                            {coverLetterExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
                          </div>
                          {coverLetterExpanded && (
                            <div style={{ 
                              marginTop: '1rem', 
                              padding: '1rem', 
                              backgroundColor: '#f9fafb', 
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb',
                              whiteSpace: 'pre-wrap',
                              fontSize: '0.95rem',
                              color: '#374151',
                              lineHeight: '1.6'
                            }}>
                              {selectedRequest.coverLetter}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Student Profile Card */}
                      <div
                        onClick={() => setProfileExpanded(!profileExpanded)}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '0.75rem',
                          padding: '1.5rem',
                          border: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#C8102E';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Student Profile</h3>
                          {profileExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
                        </div>
                        {profileExpanded && (
                          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Academic Information */}
                      <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Academic Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Degree</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedRequest.degree || 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Year of Study</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedRequest.yearOfStudy ? `Year ${selectedRequest.yearOfStudy}` : 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expected Graduation</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedRequest.expectedGraduation || 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Academic Focus</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedRequest.academicFocus || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* About */}
                      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>About</h3>
                        <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {(selectedRequest as any).about || 'Not provided'}
                        </p>
                      </div>

                      {/* Contact & Links */}
                      <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Contact & Links</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Contact Email</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{(selectedRequest as any).contactEmail || 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{(selectedRequest as any).location || 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GPA</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{(selectedRequest as any).gpa || 'Not provided'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>LinkedIn</p>
                            {(selectedRequest as any).linkedInUrl ? (
                              <a href={(selectedRequest as any).linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                {(selectedRequest as any).linkedInUrl}
                              </a>
                            ) : (
                              <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GitHub</p>
                            {(selectedRequest as any).githubUrl ? (
                              <a href={(selectedRequest as any).githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                {(selectedRequest as any).githubUrl}
                              </a>
                            ) : (
                              <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Portfolio</p>
                            {(selectedRequest as any).portfolioUrl ? (
                              <a href={(selectedRequest as any).portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                {(selectedRequest as any).portfolioUrl}
                              </a>
                            ) : (
                              <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mentoring Goals */}
                      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Mentoring Goals</h3>
                        {selectedRequest.mentoringGoals && selectedRequest.mentoringGoals.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedRequest.mentoringGoals.map((goal: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>

                      {/* Skills Wanted */}
                      <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Skills Wanted</h3>
                        {selectedRequest.skillsWanted && selectedRequest.skillsWanted.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedRequest.skillsWanted.map((skill: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>

                      {/* Languages */}
                      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Languages</h3>
                        {(selectedRequest as any).languages && Array.isArray((selectedRequest as any).languages) && (selectedRequest as any).languages.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {(selectedRequest as any).languages.map((lang: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>

                      {/* Interests */}
                      <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Interests</h3>
                        {(selectedRequest as any).interests && Array.isArray((selectedRequest as any).interests) && (selectedRequest as any).interests.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {(selectedRequest as any).interests.map((interest: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>

                      {/* Work Experience */}
                      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Work Experience</h3>
                        {(selectedRequest as any).workExperience && Array.isArray((selectedRequest as any).workExperience) && (selectedRequest as any).workExperience.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(selectedRequest as any).workExperience.map((exp: any, index: number) => (
                              <div 
                                key={index} 
                                onClick={() => setExpandedWorkExp(expandedWorkExp === index ? null : index)}
                                style={{ 
                                  padding: '1rem', 
                                  backgroundColor: '#f9fafb', 
                                  borderRadius: '0.5rem', 
                                  border: '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#C8102E';
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                      {exp.title || 'Not provided'} {exp.company ? `at ${exp.company}` : ''}
                                    </p>
                                    {exp.location && <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{exp.location}</p>}
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                      {exp.startDate || 'Not specified'} - {exp.current ? 'Present' : (exp.endDate || 'Not specified')}
                                    </p>
                                  </div>
                                  <ChevronDown 
                                    size={20} 
                                    color="#6b7280" 
                                    style={{ 
                                      transform: expandedWorkExp === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }} 
                                  />
                                </div>
                                {expandedWorkExp === index && (
                                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Title</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.title || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Company</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.company || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.location || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Start Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.startDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>End Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                                          {exp.current ? 'Present (Currently working here)' : (exp.endDate || 'Not provided')}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Description</p>
                                      <p style={{ fontSize: '0.95rem', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {exp.description || 'Not provided'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>

                      {/* Projects */}
                      <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Projects</h3>
                        {(selectedRequest as any).projects && Array.isArray((selectedRequest as any).projects) && (selectedRequest as any).projects.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(selectedRequest as any).projects.map((project: any, index: number) => (
                              <div 
                                key={index} 
                                onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                                style={{ 
                                  padding: '1rem', 
                                  backgroundColor: '#ffffff', 
                                  borderRadius: '0.5rem', 
                                  border: '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#C8102E';
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{project.name || 'Not provided'}</p>
                                    {project.description && <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>{project.description}</p>}
                                  </div>
                                  <ChevronDown 
                                    size={20} 
                                    color="#6b7280" 
                                    style={{ 
                                      transform: expandedProject === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }} 
                                  />
                                </div>
                                {expandedProject === index && (
                                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Project Name</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{project.name || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Start Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{project.startDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>End Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{project.endDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Project URL</p>
                                        {project.url ? (
                                          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                            {project.url}
                                          </a>
                                        ) : (
                                          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                                        )}
                                      </div>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Description</p>
                                      <p style={{ fontSize: '0.95rem', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {project.description || 'Not provided'}
                                      </p>
                                    </div>
                                    <div>
                                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Technologies</p>
                                      {project.technologies && project.technologies.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                          {project.technologies.map((tech: string, techIndex: number) => (
                                            <span key={techIndex} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', fontSize: '0.75rem', color: '#374151' }}>
                                              {tech}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>

                      {/* Certifications */}
                      <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Certifications</h3>
                        {(selectedRequest as any).certifications && Array.isArray((selectedRequest as any).certifications) && (selectedRequest as any).certifications.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(selectedRequest as any).certifications.map((cert: any, index: number) => (
                              <div 
                                key={index} 
                                onClick={() => setExpandedCertification(expandedCertification === index ? null : index)}
                                style={{ 
                                  padding: '1rem', 
                                  backgroundColor: '#f9fafb', 
                                  borderRadius: '0.5rem', 
                                  border: '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#C8102E';
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cert.name || 'Not provided'}</p>
                                    {cert.issuer && <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{cert.issuer}</p>}
                                    {cert.issueDate && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Issued: {cert.issueDate}</p>}
                                  </div>
                                  <ChevronDown 
                                    size={20} 
                                    color="#6b7280" 
                                    style={{ 
                                      transform: expandedCertification === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }} 
                                  />
                                </div>
                                {expandedCertification === index && (
                                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Certification Name</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.name || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Issuer</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.issuer || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Issue Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.issueDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expiry Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.expiryDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Credential ID</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.credentialId || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Credential URL</p>
                                        {cert.credentialUrl ? (
                                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                            {cert.credentialUrl}
                                          </a>
                                        ) : (
                                          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>

                            {/* CV */}
                            {selectedRequest.cvFileName && (
                              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>CV Status</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                                  <FileText size={20} color="#6b7280" />
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.25rem' }}>{selectedRequest.cvFileName}</p>
                                    {selectedRequest.cvUploadedAt && (
                                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        Uploaded: {new Date(selectedRequest.cvUploadedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      try {
                                        const token = localStorage.getItem('auth_token');
                                        const studentDbId = (selectedRequest as any).studentDbId;
                                        if (!studentDbId) {
                                          alert('Student ID not found');
                                          return;
                                        }
                                        const url = `${API_BASE_URL}${API_ENDPOINTS.mentorDownloadStudentCV(studentDbId)}`;
                                        const response = await fetch(url, {
                                          headers: {
                                            'Authorization': `Bearer ${token}`,
                                          },
                                        });
                                        
                                        if (!response.ok) {
                                          throw new Error('Failed to fetch CV');
                                        }
                                        
                                        const blob = await response.blob();
                                        const pdfUrl = URL.createObjectURL(blob);
                                        window.open(pdfUrl, '_blank');
                                        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
                                      } catch (err) {
                                        alert(err instanceof Error ? err.message : 'Failed to view CV');
                                      }
                                    }}
                                    style={{
                                      padding: '0.4rem 0.8rem',
                                      backgroundColor: '#C8102E',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '0.375rem',
                                      cursor: 'pointer',
                                      fontSize: '0.875rem',
                                      fontWeight: 500,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.4rem'
                                    }}
                                  >
                                    <FileText size={14} />
                                    <span>View CV</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Match Reasons */}
                      {selectedRequest.matchReasons && selectedRequest.matchReasons.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Match Reasons</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {selectedRequest.matchReasons.map((reason: string, index: number) => (
                              <p key={index} style={{ fontSize: '0.95rem', color: '#374151', paddingLeft: '1rem' }}>
                                • {reason}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Request Date */}
                      {selectedRequest.createdAt && (
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Request submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                        <button
                          onClick={() => handleDeclineRequest(selectedRequest.id)}
                          style={{
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            flex: 1
                          }}
                        >
                          <XCircle size={16} />
                          Decline Request
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(selectedRequest.id)}
                          style={{
                            backgroundColor: '#C8102E',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            flex: 1
                          }}
                        >
                          <CheckCircle size={16} />
                          Accept Request
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Mentees */}
                {viewMode === 'list' && (
                  <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 ref={myMenteesSectionRef} style={{ fontSize: '1.25rem', fontWeight: 600 }}>My Mentees</h2>
                    <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500 }}>
                      {currentMentees.length} Active
                    </span>
                  </div>
                  
                  {currentMentees.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {currentMentees.map((mentee) => (
                        <div 
                          key={mentee.id} 
                          onClick={() => handleViewMenteeDetail(mentee)}
                          style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#C8102E';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600 }}>
                                {mentee.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                  <h3 style={{ fontWeight: 600 }}>{mentee.name}</h3>
                                  <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                                    {mentee.status}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{mentee.studentId}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{mentee.academicFocus}</p>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/chat/${mentee.matchId || mentee.id}`);
                              }}
                              style={{ backgroundColor: '#C8102E', color: 'white', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}
                            >
                              <MessageSquare size={14} />
                              Open Room
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                            <div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Matched Since</div>
                              <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{mentee.matchedDate}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Next Session</div>
                              <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{mentee.nextSession}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Progress</div>
                              <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{mentee.sessionsCompleted} / {mentee.totalPlanned} sessions</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                      <Users size={40} color="#d1d5db" style={{ margin: '0 auto 0.75rem' }} />
                      <p style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>No active mentees yet</p>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Students will appear here once matched</p>
                    </div>
                  )}
                </div>
                )}

                {/* Mentee Detail View */}
                {viewMode === 'menteeDetail' && selectedMentee && (
                  <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <button
                        onClick={handleBackToMenteesList}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#C8102E';
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Student Profile</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Student Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.25rem', flexShrink: 0 }}>
                          {selectedMentee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{selectedMentee.name}</h3>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{selectedMentee.email}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Student ID: {selectedMentee.studentId || 'Not provided'}</p>
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Academic Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Degree</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMentee.degree || 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Year of Study</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMentee.yearOfStudy ? `Year ${selectedMentee.yearOfStudy}` : 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expected Graduation</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMentee.expectedGraduation || 'Not provided'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Academic Focus</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMentee.academicFocus || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* About */}
                      {selectedMentee.about && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>About</h3>
                          <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {selectedMentee.about || 'Not provided'}
                          </p>
                        </div>
                      )}

                      {/* Contact & Links */}
                      {(selectedMentee.contactEmail || selectedMentee.location || selectedMentee.gpa || selectedMentee.linkedInUrl || selectedMentee.githubUrl || selectedMentee.portfolioUrl) && (
                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Contact & Links</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            {selectedMentee.contactEmail && (
                              <div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Contact Email</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMentee.contactEmail}</p>
                              </div>
                            )}
                            {selectedMentee.location && (
                              <div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMentee.location}</p>
                              </div>
                            )}
                            {selectedMentee.gpa && (
                              <div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GPA</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMentee.gpa}</p>
                              </div>
                            )}
                          </div>
                          {(selectedMentee.linkedInUrl || selectedMentee.githubUrl || selectedMentee.portfolioUrl) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                              {selectedMentee.linkedInUrl && (
                                <div>
                                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>LinkedIn</p>
                                  <a href={selectedMentee.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                    {selectedMentee.linkedInUrl}
                                  </a>
                                </div>
                              )}
                              {selectedMentee.githubUrl && (
                                <div>
                                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GitHub</p>
                                  <a href={selectedMentee.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                    {selectedMentee.githubUrl}
                                  </a>
                                </div>
                              )}
                              {selectedMentee.portfolioUrl && (
                                <div>
                                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Portfolio</p>
                                  <a href={selectedMentee.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                    {selectedMentee.portfolioUrl}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mentoring Goals */}
                      {selectedMentee.mentoringGoals && selectedMentee.mentoringGoals.length > 0 && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Mentoring Goals</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedMentee.mentoringGoals.map((goal: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills Wanted */}
                      {selectedMentee.skillsWanted && selectedMentee.skillsWanted.length > 0 && (
                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Skills Wanted</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedMentee.skillsWanted.map((skill: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {selectedMentee.languages && Array.isArray(selectedMentee.languages) && selectedMentee.languages.length > 0 && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Languages</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedMentee.languages.map((lang: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interests */}
                      {selectedMentee.interests && Array.isArray(selectedMentee.interests) && selectedMentee.interests.length > 0 && (
                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Interests</h3>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {selectedMentee.interests.map((interest: string, index: number) => (
                              <span
                                key={index}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  borderRadius: '9999px',
                                  fontSize: '0.875rem',
                                  color: '#374151'
                                }}
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work Experience */}
                      {selectedMentee.workExperience && Array.isArray(selectedMentee.workExperience) && selectedMentee.workExperience.length > 0 && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Work Experience</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedMentee.workExperience.map((exp: any, index: number) => (
                              <div 
                                key={index} 
                                onClick={() => setExpandedWorkExp(expandedWorkExp === index ? null : index)}
                                style={{ 
                                  padding: '1rem', 
                                  backgroundColor: '#f9fafb', 
                                  borderRadius: '0.5rem', 
                                  border: '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#C8102E';
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                      {exp.title || 'Not provided'} {exp.company ? `at ${exp.company}` : ''}
                                    </p>
                                    {exp.location && <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{exp.location}</p>}
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                      {exp.startDate || 'Not specified'} - {exp.current ? 'Present' : (exp.endDate || 'Not specified')}
                                    </p>
                                  </div>
                                  <ChevronDown 
                                    size={20} 
                                    color="#6b7280" 
                                    style={{ 
                                      transform: expandedWorkExp === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }} 
                                  />
                                </div>
                                {expandedWorkExp === index && (
                                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Title</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.title || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Company</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.company || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.location || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Start Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{exp.startDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>End Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                                          {exp.current ? 'Present (Currently working here)' : (exp.endDate || 'Not provided')}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Description</p>
                                      <p style={{ fontSize: '0.95rem', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {exp.description || 'Not provided'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {selectedMentee.projects && Array.isArray(selectedMentee.projects) && selectedMentee.projects.length > 0 && (
                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Projects</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedMentee.projects.map((project: any, index: number) => (
                              <div 
                                key={index} 
                                onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                                style={{ 
                                  padding: '1rem', 
                                  backgroundColor: '#ffffff', 
                                  borderRadius: '0.5rem', 
                                  border: '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#C8102E';
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{project.name || 'Not provided'}</p>
                                    {project.description && <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>{project.description}</p>}
                                  </div>
                                  <ChevronDown 
                                    size={20} 
                                    color="#6b7280" 
                                    style={{ 
                                      transform: expandedProject === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }} 
                                  />
                                </div>
                                {expandedProject === index && (
                                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Project Name</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{project.name || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Start Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{project.startDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>End Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{project.endDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Project URL</p>
                                        {project.url ? (
                                          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                            {project.url}
                                          </a>
                                        ) : (
                                          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                                        )}
                                      </div>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Description</p>
                                      <p style={{ fontSize: '0.95rem', color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {project.description || 'Not provided'}
                                      </p>
                                    </div>
                                    {project.technologies && project.technologies.length > 0 && (
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Technologies</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                          {project.technologies.map((tech: string, techIndex: number) => (
                                            <span key={techIndex} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', fontSize: '0.75rem', color: '#374151' }}>
                                              {tech}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {selectedMentee.certifications && Array.isArray(selectedMentee.certifications) && selectedMentee.certifications.length > 0 && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Certifications</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {selectedMentee.certifications.map((cert: any, index: number) => (
                              <div 
                                key={index} 
                                onClick={() => setExpandedCertification(expandedCertification === index ? null : index)}
                                style={{ 
                                  padding: '1rem', 
                                  backgroundColor: '#f9fafb', 
                                  borderRadius: '0.5rem', 
                                  border: '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#C8102E';
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#e5e7eb';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cert.name || 'Not provided'}</p>
                                    {cert.issuer && <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{cert.issuer}</p>}
                                    {cert.issueDate && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Issued: {cert.issueDate}</p>}
                                  </div>
                                  <ChevronDown 
                                    size={20} 
                                    color="#6b7280" 
                                    style={{ 
                                      transform: expandedCertification === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s'
                                    }} 
                                  />
                                </div>
                                {expandedCertification === index && (
                                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Certification Name</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.name || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Issuer</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.issuer || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Issue Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.issueDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expiry Date</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.expiryDate || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Credential ID</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{cert.credentialId || 'Not provided'}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Credential URL</p>
                                        {cert.credentialUrl ? (
                                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                                            {cert.credentialUrl}
                                          </a>
                                        ) : (
                                          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CV */}
                      {selectedMentee.cvFileName && (
                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>CV Status</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                            <FileText size={20} color="#6b7280" />
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.25rem' }}>{selectedMentee.cvFileName}</p>
                              {selectedMentee.cvUploadedAt && (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                  Uploaded: {new Date(selectedMentee.cvUploadedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('auth_token');
                                  const studentDbId = selectedMentee.studentDbId || selectedMentee.id;
                                  if (!studentDbId) {
                                    alert('Student ID not found');
                                    return;
                                  }
                                  const url = `${API_BASE_URL}${API_ENDPOINTS.mentorDownloadStudentCV(studentDbId)}`;
                                  const response = await fetch(url, {
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                    },
                                  });
                                  
                                  if (!response.ok) {
                                    throw new Error('Failed to fetch CV');
                                  }
                                  
                                  const blob = await response.blob();
                                  const pdfUrl = URL.createObjectURL(blob);
                                  window.open(pdfUrl, '_blank');
                                  setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
                                } catch (err) {
                                  alert(err instanceof Error ? err.message : 'Failed to view CV');
                                }
                              }}
                              style={{
                                padding: '0.4rem 0.8rem',
                                backgroundColor: '#C8102E',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                              }}
                            >
                              <FileText size={14} />
                              <span>View CV</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Profile Card */}
                <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.25rem', margin: '0 auto 0.75rem' }}>
                      {mentorProfile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>{mentorProfile.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>{mentorProfile.email}</p>
                    <span style={{ display: 'inline-block', backgroundColor: '#dbeafe', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500 }}>Alumni</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    {mentorProfile.currentPosition && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280' }}>Position</span>
                        <span style={{ fontWeight: 500 }}>{mentorProfile.currentPosition}</span>
                      </div>
                    )}
                    {mentorProfile.currentCompany && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280' }}>Company</span>
                        <span style={{ fontWeight: 500 }}>{mentorProfile.currentCompany}</span>
                      </div>
                    )}
                    {mentorProfile.graduationYear && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280' }}>Graduation Year</span>
                        <span style={{ fontWeight: 500 }}>{mentorProfile.graduationYear}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => navigate('/mentor/profile')}
                    style={{ width: '100%', marginTop: '1rem', border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}
                  >
                    <Settings size={14} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
