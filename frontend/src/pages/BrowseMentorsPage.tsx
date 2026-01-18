import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { 
  ArrowLeft, LogOut, Search, Mail, Briefcase, Calendar, Award, CheckCircle, XCircle
} from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

interface AvailableMentor {
  id: number;
  name: string;
  email: string;
  graduationYear?: number;
  currentCompany?: string;
  currentPosition?: string;
  skillsOffered?: string[];
  mentoringGoals?: string[];
  about?: string;
  workExperience?: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
}

export function BrowseMentorsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentors, setMentors] = useState<AvailableMentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [requesting, setRequesting] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedAlumniId, setSelectedAlumniId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApprovalWarning, setShowApprovalWarning] = useState(false);

  useEffect(() => {
    // Check if user is approved before allowing access
    if (user && user.role === 'student' && user.approvalStatus !== 'approved') {
      setShowApprovalWarning(true);
      setLoading(false);
      return;
    }

    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest<{ mentors: AvailableMentor[] }>(API_ENDPOINTS.availableMentors);
        setMentors(response.mentors || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load available mentors');
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [user]);

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const handleLogoClick = () => {
    navigate('/student/dashboard');
  };

  const handleRequestMatchClick = (alumniId: number) => {
    // Check approval status before allowing match request
    if (user && user.role === 'student' && user.approvalStatus !== 'approved') {
      setShowApprovalWarning(true);
      return;
    }

    setSelectedAlumniId(alumniId);
    setCoverLetter('');
    setShowCoverLetterModal(true);
  };

  const handleSubmitMatchRequest = async () => {
    if (!selectedAlumniId) return;
    
    if (!coverLetter.trim()) {
      setError('Please write a cover letter explaining why you want to connect with this mentor.');
      return;
    }

    try {
      setRequesting(selectedAlumniId);
      setError(null);
      setSuccessMessage(null);
      
      await apiRequest(API_ENDPOINTS.requestMatch, {
        method: 'POST',
        body: JSON.stringify({ 
          alumniId: selectedAlumniId,
          coverLetter: coverLetter.trim()
        }),
      });

      setSuccessMessage('Match request sent successfully! Waiting for admin approval.');
      setShowCoverLetterModal(false);
      setSelectedAlumniId(null);
      setCoverLetter('');
      
      // Remove the requested mentor from the list
      setMentors(prev => prev.filter(m => m.id !== selectedAlumniId));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send match request');
    } finally {
      setRequesting(null);
    }
  };

  const handleCancelMatchRequest = () => {
    setShowCoverLetterModal(false);
    setSelectedAlumniId(null);
    setCoverLetter('');
    setError(null);
  };

  const filteredMentors = mentors.filter(mentor => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(searchLower) ||
      mentor.email.toLowerCase().includes(searchLower) ||
      mentor.currentCompany?.toLowerCase().includes(searchLower) ||
      mentor.currentPosition?.toLowerCase().includes(searchLower) ||
      mentor.skillsOffered?.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

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

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Back Button and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/student/dashboard')}
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
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              Browse Available Mentors
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Find and connect with alumni mentors who can guide your career
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#16a34a', fontSize: '0.875rem' }}>
            {successMessage}
          </div>
        )}

        {/* Approval Warning */}
        {showApprovalWarning && (
          <div style={{ 
            backgroundColor: '#fef3c7', 
            border: '1px solid #fde68a', 
            borderRadius: '0.5rem', 
            padding: '1.5rem', 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <XCircle size={48} color="#d97706" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
              Account Pending Approval
            </h3>
            <p style={{ color: '#78350f', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Your account has not been approved by the administrator yet. You cannot browse mentors or request matches until your account is approved.
            </p>
            <p style={{ color: '#78350f', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Please wait for admin approval. You can still log in and complete your profile in the meantime.
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              style={{
                backgroundColor: '#C8102E',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Search Bar and Mentor List - Only show if approved */}
        {!showApprovalWarning && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by name, company, position, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C8102E';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <p style={{ color: '#6b7280' }}>Loading mentors...</p>
              </div>
            ) : filteredMentors.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {/* Mentor Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '9999px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '1.1rem', flexShrink: 0 }}>
                    {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>{mentor.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{mentor.email}</p>
                    {mentor.graduationYear && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        <Calendar size={14} />
                        <span>Graduated {mentor.graduationYear}</span>
                      </div>
                    )}
                    {mentor.currentCompany && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        <Briefcase size={14} />
                        <span>{mentor.currentPosition ? `${mentor.currentPosition} at ` : ''}{mentor.currentCompany}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* About Section */}
                {mentor.about && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>About</p>
                    <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {mentor.about}
                    </p>
                  </div>
                )}

                {/* Career Timeline Preview */}
                {mentor.workExperience && Array.isArray(mentor.workExperience) && mentor.workExperience.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>Career Timeline</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {mentor.workExperience.slice(0, 2).map((exp: any, idx: number) => (
                        <div key={idx} style={{ fontSize: '0.875rem', color: '#374151' }}>
                          <div style={{ fontWeight: 500 }}>
                            {exp.title || 'Position'} {exp.company ? `at ${exp.company}` : ''}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {exp.startDate && exp.endDate && !exp.current 
                              ? `${exp.startDate} - ${exp.endDate}`
                              : exp.current && exp.startDate
                              ? `${exp.startDate} - Present`
                              : exp.startDate || ''}
                          </div>
                        </div>
                      ))}
                      {mentor.workExperience.length > 2 && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>
                          +{mentor.workExperience.length - 2} more position{mentor.workExperience.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills Offered */}
                {mentor.skillsOffered && mentor.skillsOffered.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>Skills Offered</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {mentor.skillsOffered.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            color: '#374151'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {mentor.skillsOffered.length > 5 && (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', padding: '0.25rem 0.75rem' }}>
                          +{mentor.skillsOffered.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleRequestMatchClick(mentor.id)}
                  disabled={requesting === mentor.id}
                  style={{
                    width: '100%',
                    backgroundColor: requesting === mentor.id ? '#9ca3af' : '#C8102E',
                    color: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: requesting === mentor.id ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (requesting !== mentor.id) {
                      e.currentTarget.style.backgroundColor = '#a01212';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (requesting !== mentor.id) {
                      e.currentTarget.style.backgroundColor = '#C8102E';
                    }
                  }}
                >
                  {requesting === mentor.id ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <span>Requesting...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>Request Match</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
            <Award size={48} color="#d1d5db" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
              {searchTerm ? 'No mentors found' : 'No available mentors'}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Check back later for new mentor opportunities'}
            </p>
          </div>
        )}

        {/* Cover Letter Modal */}
        {showCoverLetterModal && selectedAlumniId && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
            onClick={handleCancelMatchRequest}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Request Match with Mentor
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Write a cover letter explaining why you want to connect with this mentor and what you hope to gain from the mentoring relationship.
              </p>

              {error && (
                <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Cover Letter <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Dear [Mentor Name],&#10;&#10;I am writing to request a mentoring relationship because...&#10;&#10;I am particularly interested in learning about...&#10;&#10;I believe this connection would be valuable because...&#10;&#10;Thank you for considering my request."
                  rows={12}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C8102E';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  Minimum 100 characters. Be specific about your goals and why this mentor is a good fit for you.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancelMatchRequest}
                  disabled={requesting !== null}
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: requesting !== null ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    opacity: requesting !== null ? 0.5 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitMatchRequest}
                  disabled={requesting !== null || !coverLetter.trim() || coverLetter.trim().length < 100}
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: (requesting !== null || !coverLetter.trim() || coverLetter.trim().length < 100) ? '#9ca3af' : '#C8102E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: (requesting !== null || !coverLetter.trim() || coverLetter.trim().length < 100) ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {requesting !== null ? (
                    <>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

