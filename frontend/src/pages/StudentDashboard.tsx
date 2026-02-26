import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest, API_BASE_URL } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { ProfileResponse, MatchResponse } from '../types/auth';
import { 
  MessageSquare, Settings,
  Target, CheckCircle, Clock,
  Upload, FileText, BarChart3, Star, LogOut, Trash2
} from 'lucide-react';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';

const waikatoLogo = '/waikato-logo.png';

export function StudentDashboard() {
  const { user, logout, setUserState } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileResponse['user'] | null>(null);
  const [matchData, setMatchData] = useState<MatchResponse['match'] | null>(null);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(null);
  const [profilePhotoVersion, setProfilePhotoVersion] = useState(0);
  const normalizedApiBaseUrl = API_BASE_URL.replace(/\/$/, '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileResponse, matchResponse, cvResponse] = await Promise.allSettled([
          apiRequest<ProfileResponse>(API_ENDPOINTS.profile),
          apiRequest<MatchResponse>(API_ENDPOINTS.myMatch),
          apiRequest<{ uploaded: boolean; fileName: string | null }>(API_ENDPOINTS.getCV).catch(() => null)
        ]);

        if (profileResponse.status === 'fulfilled') {
          setProfileData(profileResponse.value.user);
        } else {
          setProfileData(null);
        }

        if (matchResponse.status === 'fulfilled' && matchResponse.value && matchResponse.value.match) {
          setMatchData(matchResponse.value.match);
        } else {
          setMatchData(null);
        }

        if (cvResponse.status === 'fulfilled' && cvResponse.value && cvResponse.value.uploaded && cvResponse.value.fileName) {
          setCvUploaded(true);
          setCvFileName(cvResponse.value.fileName);
        } else {
          setCvUploaded(false);
          setCvFileName(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setProfileData(null);
        setMatchData(null);
        setCvUploaded(false);
        setCvFileName(null);
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

  const handleCVUpload = async (file: File) => {
                <ProfilePhotoUploader
                  photoUrl={(profileData?.profilePhotoFilePath || user?.profilePhotoFilePath)
                    ? `${normalizedApiBaseUrl}${profileData?.profilePhotoFilePath || user?.profilePhotoFilePath}?v=${profilePhotoVersion}`
                    : null}
                  initials={getInitials(studentProfile.name || 'Student')}
                  onUpload={handleProfilePhotoUpload}
                  onRemove={handleProfilePhotoRemove}
                  isUploading={uploadingProfilePhoto}
                  errorMessage={profilePhotoError}
                />
    if (!window.confirm('Are you sure you want to delete your CV?')) {
      return;
    }
    
    try {
      setError(null);
      
      await apiRequest<{ message: string }>(API_ENDPOINTS.deleteCV, {
        method: 'DELETE',
      });
      
      setCvUploaded(false);
      setCvFileName(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete CV');
    }
  };

  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfilePhotoUpload = async (file: File) => {
    try {
      setProfilePhotoError(null);
      setUploadingProfilePhoto(true);

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setProfilePhotoError('Only JPEG, PNG, and WebP images are allowed');
        setUploadingProfilePhoto(false);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setProfilePhotoError('File size must not exceed 2MB');
        setUploadingProfilePhoto(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequest<{ profilePhotoUrl: string; user: any }>(
        API_ENDPOINTS.uploadProfilePhoto,
        {
          method: 'POST',
          body: formData,
          headers: {},
        }
      );

      setUserState(response.user);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      setProfileData(response.user);
      setProfilePhotoVersion((v) => v + 1);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload profile photo';
      setProfilePhotoError(errorMsg);
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const handleProfilePhotoRemove = async () => {
    if (!window.confirm('Remove profile photo?')) {
      return;
    }

    try {
      setProfilePhotoError(null);
      setUploadingProfilePhoto(true);

      const response = await apiRequest<{ user: any }>(API_ENDPOINTS.deleteProfilePhoto, {
        method: 'DELETE',
      });

      setUserState(response.user);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      setProfileData(response.user);
      setProfilePhotoVersion((v) => v + 1);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove profile photo';
      setProfilePhotoError(errorMsg);
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const studentProfile = {
    name: profileData?.name || user?.name || '',
    email: profileData?.email || user?.email || '',
    expectedGraduation: (profileData as any)?.expectedGraduation || '',
    academicFocus: (profileData as any)?.academicFocus || '',
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = (): number => {
    if (!profileData) return 0;
    
    const data = profileData as any;
    let totalScore = 0;
    let earnedScore = 0;

    // Parse name
    const fullName = data.name || '';
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // High weight (8 points each) - Required fields
    const highWeightFields = [
      { value: firstName, weight: 8 },
      { value: lastName, weight: 8 },
      { value: data.studentId || '', weight: 8 },
      { value: data.degree || '', weight: 8 },
      { value: data.yearOfStudy ? String(data.yearOfStudy) : '', weight: 8 },
      { value: data.expectedGraduation || '', weight: 8 },
      { value: data.academicFocus || '', weight: 8 },
    ];

    highWeightFields.forEach(field => {
      totalScore += field.weight;
      if (field.value && field.value.trim()) {
        earnedScore += field.weight;
      }
    });

    // Medium weight (5 points each) - Important optional fields
    totalScore += 5;
    if (data.workExperience && Array.isArray(data.workExperience) && data.workExperience.length > 0) {
      earnedScore += 5;
    }

    totalScore += 5;
    if (data.skillsWanted && Array.isArray(data.skillsWanted) && data.skillsWanted.length > 0) {
      earnedScore += 5;
    }

    totalScore += 5;
    if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
      earnedScore += 5;
    }

    totalScore += 5;
    if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0) {
      earnedScore += 5;
    }

    totalScore += 5;
    if (data.about && data.about.trim()) {
      earnedScore += 5;
    }

    // Low weight (2 points each)
    const lowWeightFields = [
      { value: data.location || '', weight: 2 },
      { value: data.linkedInUrl || '', weight: 2 },
      { value: data.githubUrl || '', weight: 2 },
      { value: data.portfolioUrl || '', weight: 2 },
    ];

    lowWeightFields.forEach(field => {
      totalScore += field.weight;
      if (field.value && field.value.trim()) {
        earnedScore += field.weight;
      }
    });

    totalScore += 2;
    if (data.languages && Array.isArray(data.languages) && data.languages.length > 0) {
      earnedScore += 2;
    }

    totalScore += 2;
    if (data.interests && Array.isArray(data.interests) && data.interests.length > 0) {
      earnedScore += 2;
    }

    // Lowest weight (1 point each)
    totalScore += 1;
    if (data.contactEmail && data.contactEmail.trim()) {
      earnedScore += 1;
    }

    totalScore += 1;
    if (data.gpa && data.gpa.trim()) {
      earnedScore += 1;
    }

    if (totalScore === 0) return 0;
    return Math.round((earnedScore / totalScore) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const currentMentor = matchData ? {
    name: matchData.alumni.name,
    title: matchData.alumni.currentPosition || '',
    company: matchData.alumni.currentCompany || '',
    email: matchData.alumni.email,
    matchedDate: matchData.confirmedAt ? new Date(matchData.confirmedAt).toLocaleDateString() : '',
    mentoringType: '',
    status: matchData.status
  } : null;

  const mentoringMilestones = [
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '9999px', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: '0.95rem' }}>
                {user?.profilePhotoFilePath ? (
                  <img
                    src={`${API_BASE_URL}${user.profilePhotoFilePath}`}
                    alt={user?.name || 'Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{getInitials(user?.name || 'Student')}</span>
                )}
              </div>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#D50000', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <p style={{ color: '#6b7280' }}>Loading...</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde047', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                <p style={{ color: '#92400e', fontSize: '0.875rem' }}>Warning: {error} (Using default data for development)</p>
              </div>
            )}
            {/* Welcome Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Welcome back, {studentProfile.name}!</h1>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Track your mentoring progress and connect with industry professionals
              </p>
            </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', alignItems: 'stretch' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            {/* Current Mentor */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>My Mentor</h2>
                {currentMentor && (
                  <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500 }}>{currentMentor.status}</span>
                )}
              </div>
              
              {currentMentor ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
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

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => navigate(`/chat/${matchData?.id}`)}
                        style={{ backgroundColor: '#C8102E', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        <MessageSquare size={14} />
                        <span>Open Room</span>
                      </button>
                      <a href={`mailto:${currentMentor.email}`} style={{ backgroundColor: 'white', color: '#C8102E', border: '1px solid #C8102E', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>
                        <MessageSquare size={14} />
                        <span>Email</span>
                      </a>
                    </div>
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
                <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#6b7280' }}>
                  <Target size={32} color="#d1d5db" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>No mentor assigned yet</p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>Complete your profile to get matched</p>
                  <button
                    onClick={() => {
                      // Check approval status before navigating
                      if (user && user.approvalStatus !== 'approved') {
                        alert('Your account has not been approved by the administrator yet. You cannot browse mentors or request matches until your account is approved. Please wait for admin approval.');
                        return;
                      }
                      navigate('/student/browse-mentors');
                    }}
                    style={{
                      backgroundColor: '#C8102E',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    Browse Available Mentors
                  </button>
                </div>
              )}
            </div>

            {/* Mentoring Progress */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Mentoring Journey</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
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
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', justifyContent: 'flex-start' }}>
            {/* Profile Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <ProfilePhotoUploader
                  photoUrl={(profileData?.profilePhotoFilePath || user?.profilePhotoFilePath)
                    ? `${normalizedApiBaseUrl}${profileData?.profilePhotoFilePath || user?.profilePhotoFilePath}?v=${profilePhotoVersion}`
                    : null}
                  initials={getInitials(studentProfile.name || 'Student')}
                  onUpload={handleProfilePhotoUpload}
                  onRemove={handleProfilePhotoRemove}
                  isUploading={uploadingProfilePhoto}
                  errorMessage={profilePhotoError}
                />
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>{studentProfile.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>{studentProfile.email}</p>
                <span style={{ display: 'inline-block', backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500 }}>Student</span>
              </div>

              {/* Profile Completion */}
              <div style={{ marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>Profile Completion</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: profileCompletion === 100 ? '#10b981' : '#C8102E' }}>
                    {profileCompletion}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${profileCompletion}%`,
                      backgroundColor: profileCompletion === 100 ? '#10b981' : '#C8102E',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Expected Graduation</span>
                  <span style={{ fontWeight: 500 }}>{studentProfile.expectedGraduation || 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Academic Focus</span>
                  <span style={{ fontWeight: 500 }}>{studentProfile.academicFocus || 'Not set'}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/student/profile')}
                style={{ width: '100%', marginTop: '0.75rem', border: '1px solid #d1d5db', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
              >
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
                    <button 
                      onClick={handleCVView}
                      style={{ flex: 1, border: '1px solid #d1d5db', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontWeight: 600 }}
                    >
                      <FileText size={14} />
                      <span style={{ fontSize: '0.8rem' }}>View</span>
                    </button>
                    <button 
                      onClick={handleCVReplace}
                      style={{ flex: 1, border: '1px solid #d1d5db', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontWeight: 600 }}
                    >
                      <Upload size={14} />
                      <span style={{ fontSize: '0.8rem' }}>Replace</span>
                    </button>
                    <button 
                      onClick={handleCVDelete}
                      style={{ border: '1px solid #fecaca', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontWeight: 600, color: '#dc2626' }}
                      title="Delete CV"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ padding: '0.75rem', border: '2px dashed #d1d5db', borderRadius: '0.5rem', textAlign: 'center' }}>
                    <Upload size={28} color="#9ca3af" style={{ margin: '0 auto 0.4rem' }} />
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>No CV uploaded yet</p>
                  </div>
                  <label style={{ width: '100%', backgroundColor: '#C8102E', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                    <Upload size={14} />
                    <span>Upload CV</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCVUpload(file);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
