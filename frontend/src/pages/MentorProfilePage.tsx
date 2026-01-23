import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { ProfileResponse } from '../types/auth';
import { ArrowLeft, Save, X, Edit2, Trash2, Plus } from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

// Graduation Year options (from 2000 to current year + 5)
const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) => 2000 + i);

// Date options for work experience
const DATE_YEARS = Array.from({ length: 20 }, (_, i) => 2010 + i); // 2010-2029
const DATE_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MentorProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    graduationYear: '',
    currentCompany: '',
    currentPosition: '',
    skillsOffered: [] as string[],
    mentoringGoals: [] as string[],
    mentoringTypes: [] as string[], // oneOff, vocational, employment
    about: '',
    location: '',
    linkedInUrl: '',
    workExperience: [] as Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>,
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [expandedWorkExperienceIds, setExpandedWorkExperienceIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<ProfileResponse>(API_ENDPOINTS.profile);
        
        if (response.user) {
          // Parse name into firstName and lastName
          const fullName = response.user.name || '';
          const nameParts = fullName.trim().split(/\s+/);
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          const workExp = Array.isArray(response.user.workExperience) 
            ? response.user.workExperience.map((exp: any, idx: number) => ({
                id: exp.id || `exp-${idx}`,
                title: exp.title || '',
                company: exp.company || '',
                location: exp.location || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                current: exp.current || false,
                description: exp.description || ''
              }))
            : [];
          
          setFormData({
            firstName: firstName,
            lastName: lastName,
            graduationYear: response.user.graduationYear?.toString() || '',
            currentCompany: response.user.currentCompany || '',
            currentPosition: response.user.currentPosition || '',
            skillsOffered: response.user.skillsOffered || [],
            mentoringGoals: response.user.mentoringGoals || [],
            about: response.user.about || '',
            location: response.user.location || '',
            linkedInUrl: response.user.linkedInUrl || '',
            workExperience: workExp,
          });
        }
      } catch (err) {
        console.warn('Failed to load profile, using default data:', err);
        // Parse user name into firstName and lastName
        const fullName = user?.name || '';
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData({
          firstName: firstName,
          lastName: lastName,
          graduationYear: '',
          currentCompany: '',
          currentPosition: '',
          skillsOffered: [],
          mentoringGoals: [],
          mentoringTypes: [],
          about: '',
          location: '',
          linkedInUrl: '',
          workExperience: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skillsOffered.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && !formData.mentoringGoals.includes(newGoal.trim())) {
      setFormData(prev => ({
        ...prev,
        mentoringGoals: [...prev.mentoringGoals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      mentoringGoals: prev.mentoringGoals.filter(g => g !== goal)
    }));
  };

  const handleAddWorkExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp]
    }));
    setExpandedWorkExperienceIds(prev => new Set([...prev, newExp.id]));
  };

  const handleUpdateWorkExperience = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleRemoveWorkExperience = (id: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
    setExpandedWorkExperienceIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleWorkExperienceExpanded = (id: string) => {
    setExpandedWorkExperienceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Combine firstName and lastName into name
    const fullName = [formData.firstName.trim(), formData.lastName.trim()].filter(Boolean).join(' ');

    try {
      // Clean workExperience data - remove id field before sending
      const cleanedWorkExperience = formData.workExperience.map(({ id, ...rest }) => rest);
      
      const updateData: any = {
        name: fullName || undefined,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
        currentCompany: formData.currentCompany || undefined,
        currentPosition: formData.currentPosition || undefined,
        skillsOffered: formData.skillsOffered,
        mentoringGoals: formData.mentoringGoals,
        mentoringTypes: formData.mentoringTypes,
        about: formData.about || undefined,
        location: formData.location || undefined,
        linkedInUrl: formData.linkedInUrl || undefined,
        workExperience: cleanedWorkExperience,
      };

      await apiRequest(API_ENDPOINTS.profile, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      setSuccess(true);
      setSaving(false);
      // Show success message briefly, then navigate
      setTimeout(() => {
        navigate('/mentor/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/mentor/dashboard');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('/mentor/dashboard')}>
                <img src={waikatoLogo} alt="Waikato" style={{ height: '40px', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={handleCancel}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '0.5rem', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Edit Profile</h1>
        </div>
        <p style={{ color: '#6b7280', marginBottom: '2rem', marginLeft: '52px' }}>Update your profile information</p>

        {/* Error/Success messages */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#dc2626' }}>Error: {error}</p>
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#16a34a' }}>Profile updated successfully! Redirecting...</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '2rem' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Basic Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  First Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Last Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Graduation Year
                </label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white',
                    color: '#111827',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select graduation year</option>
                  {GRADUATION_YEARS.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Current Position
                </label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Current Company
              </label>
              <input
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleInputChange}
                placeholder="e.g., Tech Company Inc."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          {/* Skills Offered */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Skills Offered</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              List the skills you can help students develop
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g., Software Development"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#C8102E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                Add
              </button>
            </div>

            {formData.skillsOffered.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.skillsOffered.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '9999px',
                      fontSize: '0.875rem'
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '9999px',
                        border: 'none',
                        backgroundColor: '#d1d5db',
                        color: '#374151',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mentoring Goals */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Mentoring Goals</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Describe what you hope to achieve through mentoring
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGoal();
                  }
                }}
                placeholder="e.g., Help students with career planning"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="button"
                onClick={handleAddGoal}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#C8102E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                Add
              </button>
            </div>

            {formData.mentoringGoals.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.mentoringGoals.map((goal, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '9999px',
                      fontSize: '0.875rem'
                    }}
                  >
                    {goal}
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(goal)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '9999px',
                        border: 'none',
                        backgroundColor: '#d1d5db',
                        color: '#374151',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mentoring Types */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Mentoring Types</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Select the types of mentoring you can provide (you can select multiple)
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', transition: 'all 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.mentoringTypes.includes('oneOff')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        mentoringTypes: [...prev.mentoringTypes, 'oneOff']
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        mentoringTypes: prev.mentoringTypes.filter(t => t !== 'oneOff')
                      }));
                    }
                  }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>One-Off Advice</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Quick support via phone, email, or a single meeting for CV tips, interview prep, and industry insights</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', transition: 'all 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.mentoringTypes.includes('vocational')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        mentoringTypes: [...prev.mentoringTypes, 'vocational']
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        mentoringTypes: prev.mentoringTypes.filter(t => t !== 'vocational')
                      }));
                    }
                  }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Vocational Mentoring</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>2-3 sessions with deeper guidance on industry expectations, goal setting, and career planning</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', transition: 'all 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.mentoringTypes.includes('employment')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        mentoringTypes: [...prev.mentoringTypes, 'employment']
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        mentoringTypes: prev.mentoringTypes.filter(t => t !== 'employment')
                      }));
                    }
                  }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Employment Opportunities</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Access workplace visits, internship opportunities, and work experience placements</div>
                </div>
              </label>
            </div>
          </div>

          {/* About Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>About</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Write a brief introduction about yourself, your career journey, and what you bring as a mentor
            </p>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Tell us about yourself, your career path, and your mentoring philosophy..."
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Work Experience Timeline */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Career Timeline</h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Add your work experience to show your career journey
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddWorkExperience}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#C8102E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <Plus size={16} />
                <span>Add Experience</span>
              </button>
            </div>

            {formData.workExperience.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px dashed #d1d5db',
                color: '#6b7280'
              }}>
                <p>No work experience added yet. Click "Add Experience" to get started.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.workExperience.map((exp, index) => {
                  const isExpanded = expandedWorkExperienceIds.has(exp.id);
                  return (
                    <div
                      key={exp.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: 'white',
                        overflow: 'hidden'
                      }}
                    >
                      {!isExpanded ? (
                        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                              {exp.title || 'Untitled Position'}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {exp.company && exp.title ? `${exp.company} • ` : exp.company || ''}
                              {exp.startDate && exp.endDate && !exp.current 
                                ? `${exp.startDate} - ${exp.endDate}`
                                : exp.current && exp.startDate
                                ? `${exp.startDate} - Present`
                                : exp.startDate || ''}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => toggleWorkExperienceExpanded(exp.id)}
                              style={{
                                padding: '0.375rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Edit2 size={16} color="#6b7280" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveWorkExperience(exp.id)}
                              style={{
                                padding: '0.375rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Trash2 size={16} color="#dc2626" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                Job Title <span style={{ color: '#dc2626' }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleUpdateWorkExperience(exp.id, 'title', e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 0.75rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.5rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                Company <span style={{ color: '#dc2626' }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleUpdateWorkExperience(exp.id, 'company', e.target.value)}
                                placeholder="e.g., Tech Company Inc."
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 0.75rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.5rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                Location
                              </label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => handleUpdateWorkExperience(exp.id, 'location', e.target.value)}
                                placeholder="e.g., Auckland, New Zealand"
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 0.75rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.5rem',
                                  fontSize: '0.875rem'
                                }}
                              />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.625rem' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', margin: 0 }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <input
                                    type="checkbox"
                                    checked={exp.current}
                                    onChange={(e) => {
                                      handleUpdateWorkExperience(exp.id, 'current', e.target.checked);
                                      if (e.target.checked) {
                                        handleUpdateWorkExperience(exp.id, 'endDate', '');
                                      }
                                    }}
                                    style={{ 
                                      cursor: 'pointer',
                                      width: '18px',
                                      height: '18px',
                                      margin: 0,
                                      opacity: 0,
                                      position: 'absolute',
                                      zIndex: 1
                                    }}
                                  />
                                  <div
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      border: '2px solid #d1d5db',
                                      borderRadius: '0.25rem',
                                      backgroundColor: '#f3f4f6',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      position: 'relative',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    {exp.current && (
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M2 6L5 9L10 2"
                                          stroke="#374151"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <span>Currently working here</span>
                              </label>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                Start Date
                              </label>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <select
                                  value={(() => {
                                    if (!exp.startDate) return '';
                                    const parts = exp.startDate.split(' ');
                                    const monthPart = DATE_MONTHS.find(m => parts.includes(m));
                                    return monthPart || '';
                                  })()}
                                  onChange={(e) => {
                                    const month = e.target.value;
                                    const currentParts = exp.startDate ? exp.startDate.split(' ') : [];
                                    const existingMonth = DATE_MONTHS.find(m => currentParts.includes(m));
                                    const existingYear = DATE_YEARS.find(y => currentParts.includes(y.toString()));
                                    const year = existingYear ? existingYear.toString() : '';
                                    
                                    if (month && year) {
                                      handleUpdateWorkExperience(exp.id, 'startDate', `${month} ${year}`);
                                    } else if (month) {
                                      handleUpdateWorkExperience(exp.id, 'startDate', month);
                                    } else if (year) {
                                      handleUpdateWorkExperience(exp.id, 'startDate', year);
                                    } else {
                                      handleUpdateWorkExperience(exp.id, 'startDate', '');
                                    }
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    color: '#111827',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="">Month</option>
                                  {DATE_MONTHS.map((month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={(() => {
                                    if (!exp.startDate) return '';
                                    const parts = exp.startDate.split(' ');
                                    const yearPart = DATE_YEARS.find(y => parts.includes(y.toString()));
                                    return yearPart ? yearPart.toString() : '';
                                  })()}
                                  onChange={(e) => {
                                    const year = e.target.value;
                                    const currentParts = exp.startDate ? exp.startDate.split(' ') : [];
                                    const existingMonth = DATE_MONTHS.find(m => currentParts.includes(m));
                                    const existingYear = DATE_YEARS.find(y => currentParts.includes(y.toString()));
                                    const month = existingMonth || '';
                                    
                                    if (month && year) {
                                      handleUpdateWorkExperience(exp.id, 'startDate', `${month} ${year}`);
                                    } else if (month) {
                                      handleUpdateWorkExperience(exp.id, 'startDate', month);
                                    } else if (year) {
                                      handleUpdateWorkExperience(exp.id, 'startDate', year);
                                    } else {
                                      handleUpdateWorkExperience(exp.id, 'startDate', '');
                                    }
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    color: '#111827',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="">Year</option>
                                  {DATE_YEARS.map((year) => (
                                    <option key={year} value={year.toString()}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {!exp.current && (
                              <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                  End Date
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                  <select
                                    value={(() => {
                                      if (!exp.endDate) return '';
                                      const parts = exp.endDate.split(' ');
                                      const monthPart = DATE_MONTHS.find(m => parts.includes(m));
                                      return monthPart || '';
                                    })()}
                                    onChange={(e) => {
                                      const month = e.target.value;
                                      const currentParts = exp.endDate ? exp.endDate.split(' ') : [];
                                      const existingMonth = DATE_MONTHS.find(m => currentParts.includes(m));
                                      const existingYear = DATE_YEARS.find(y => currentParts.includes(y.toString()));
                                      const year = existingYear ? existingYear.toString() : '';
                                      
                                      if (month && year) {
                                        handleUpdateWorkExperience(exp.id, 'endDate', `${month} ${year}`);
                                      } else if (month) {
                                        handleUpdateWorkExperience(exp.id, 'endDate', month);
                                      } else if (year) {
                                        handleUpdateWorkExperience(exp.id, 'endDate', year);
                                      } else {
                                        handleUpdateWorkExperience(exp.id, 'endDate', '');
                                      }
                                    }}
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem 0.75rem',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '0.5rem',
                                      fontSize: '0.875rem',
                                      backgroundColor: 'white',
                                      color: '#111827',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <option value="">Month</option>
                                    {DATE_MONTHS.map((month) => (
                                      <option key={month} value={month}>
                                        {month}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    value={(() => {
                                      if (!exp.endDate) return '';
                                      const parts = exp.endDate.split(' ');
                                      const yearPart = DATE_YEARS.find(y => parts.includes(y.toString()));
                                      return yearPart ? yearPart.toString() : '';
                                    })()}
                                    onChange={(e) => {
                                      const year = e.target.value;
                                      const currentParts = exp.endDate ? exp.endDate.split(' ') : [];
                                      const existingMonth = DATE_MONTHS.find(m => currentParts.includes(m));
                                      const existingYear = DATE_YEARS.find(y => currentParts.includes(y.toString()));
                                      const month = existingMonth || '';
                                      
                                      if (month && year) {
                                        handleUpdateWorkExperience(exp.id, 'endDate', `${month} ${year}`);
                                      } else if (month) {
                                        handleUpdateWorkExperience(exp.id, 'endDate', month);
                                      } else if (year) {
                                        handleUpdateWorkExperience(exp.id, 'endDate', year);
                                      } else {
                                        handleUpdateWorkExperience(exp.id, 'endDate', '');
                                      }
                                    }}
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem 0.75rem',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '0.5rem',
                                      fontSize: '0.875rem',
                                      backgroundColor: 'white',
                                      color: '#111827',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <option value="">Year</option>
                                    {DATE_YEARS.map((year) => (
                                      <option key={year} value={year.toString()}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                              Description
                            </label>
                            <textarea
                              value={exp.description}
                              onChange={(e) => handleUpdateWorkExperience(exp.id, 'description', e.target.value)}
                              placeholder="Describe your responsibilities and achievements..."
                              rows={4}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => toggleWorkExperienceExpanded(exp.id)}
                              style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact & Links */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Contact & Links</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Hamilton, New Zealand"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedInUrl"
                  value={formData.linkedInUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '0.625rem 1.25rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: saving ? '#9ca3af' : '#C8102E',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

