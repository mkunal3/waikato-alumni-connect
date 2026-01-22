import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { ProfileResponse } from '../types/auth';
import { ArrowLeft, Save, X, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

// Degree options - Full list of degrees offered at University of Waikato
const DEGREE_OPTIONS = [
  'Bachelor of Science',
  'Bachelor of Science (Honours)',
  'Bachelor of Computing and Mathematical Sciences',
  'Bachelor of Computing and Mathematical Sciences (Honours)',
  'Bachelor of Engineering (Honours)',
  'Bachelor of Management Studies',
  'Bachelor of Management Studies (Honours)',
  'Bachelor of Business',
  'Bachelor of Business (Honours)',
  'Bachelor of Business Analysis',
  'Bachelor of Business Analysis (Honours)',
  'Bachelor of Arts',
  'Bachelor of Arts (Honours)',
  'Bachelor of Law',
  'Bachelor of Laws (Honours)',
  'Bachelor of Social Sciences',
  'Bachelor of Social Sciences (Honours)',
  'Bachelor of Teaching',
  'Bachelor of Music',
  'Bachelor of Health, Sport and Human Performance',
  'Master of Information Technology',
  'Master of Science',
  'Master of Computing and Mathematical Sciences',
  'Master of Engineering',
  'Master of Business Administration',
  'Master of Management Studies',
  'Master of Management',
  'Master of Professional Management',
  'Master of Business Analysis',
  'Master of Arts',
  'Master of Laws',
  'Master of Social Sciences',
  'Master of Education',
  'Master of Health, Sport and Human Performance',
  'PhD in Computer Science',
  'PhD in Mathematics',
  'PhD in Statistics',
  'PhD in Engineering',
  'PhD in Management',
  'PhD in Business',
  'PhD in Business Analysis',
  'PhD in Arts',
  'PhD in Law',
  'PhD in Social Sciences',
  'PhD in Education',
];

// Academic Focus options - Specializations and areas of study
const ACADEMIC_FOCUS_OPTIONS = [
  // Computer Science & IT
  'Computer Science',
  'Software Engineering',
  'Data Science & Analytics',
  'Cybersecurity',
  'Information Security',
  'Artificial Intelligence & Machine Learning',
  'Machine Learning',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Information Systems',
  'Database Systems',
  'Network Engineering',
  'Cloud Computing',
  'Distributed Systems',
  'Mobile Application Development',
  'Web Development',
  'Game Development',
  'Human-Computer Interaction',
  'User Experience Design',
  
  // Mathematics & Statistics
  'Mathematics (Pure & Applied)',
  'Pure Mathematics',
  'Applied Mathematics',
  'Statistics',
  'Statistical Analysis',
  'Mathematical Modelling',
  'Computational Mathematics',
  'Mathematical Physics',
  'Operations Research',
  'Optimization Theory',
  
  // Engineering
  'Software Engineering',
  'Computer Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biomedical Engineering',
  
  // Business & Management
  'Business Analytics',
  'Business Analysis',
  'Information Management',
  'Project Management',
  'Supply Chain Management',
  'Digital Business',
  'E-Commerce',
  'Business Intelligence',
  'Strategic Management',
  'Organizational Behavior',
  'Human Resource Management',
  'Marketing',
  'Digital Marketing',
  'Finance',
  'Accounting',
  'Economics',
  'Entrepreneurship',
  'Innovation Management',
  'Operations Management',
  'Leadership',
  'Change Management',
  'Customer Experience',
  'Service Design',
  'User Experience (UX)',
  'User Experience Design',
  'User Interface (UI) Design',
  'Interaction Design',
  'Design Thinking',
  'Product Management',
  'Agile Project Management',
  'Business Process Management',
  'Data-Driven Decision Making',
  'Consulting',
  
  // Interdisciplinary
  'Computational Biology',
  'Bioinformatics',
  'Data Analytics',
  'Financial Technology (FinTech)',
  'Digital Health',
  'Smart Systems',
  'IoT (Internet of Things)',
  'Blockchain Technology',
];

// Expected Graduation options (New Zealand academic calendar)
// Year options: 2026-2035 (10 years)
const GRADUATION_YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);

// Month options: New Zealand academic calendar
const GRADUATION_MONTHS = ['March', 'July', 'November'];

// Date options for work experience, projects, and certifications
const DATE_YEARS = Array.from({ length: 20 }, (_, i) => 2010 + i); // 2010-2029
const DATE_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label: string;
  required?: boolean;
}

function AutocompleteInput({ value, onChange, options, placeholder, label, required }: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value);
    setIsValid(!value || options.includes(value));
  }, [value, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.trim() === '') {
      setFilteredOptions([]);
      setShowDropdown(false);
      setIsValid(true);
      onChange('');
      return;
    }

    const filtered = options.filter(option =>
      option.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(filtered.length > 0);
    
    // Check if input exactly matches an option
    const exactMatch = options.find(opt => opt.toLowerCase() === newValue.toLowerCase());
    setIsValid(!!exactMatch);
    if (exactMatch) {
      onChange(exactMatch);
    } else {
      onChange('');
    }
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    setShowDropdown(false);
    setIsValid(true);
    onChange(option);
  };

  const handleBlur = () => {
    // Delay to allow option click to fire first
    setTimeout(() => {
      setShowDropdown(false);
      if (inputValue && !options.includes(inputValue)) {
        setInputValue(value || '');
        setIsValid(true);
      }
    }, 200);
  };

  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (inputValue) {
            const filtered = options.filter(option =>
              option.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowDropdown(filtered.length > 0);
          }
        }}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: `1px solid ${isValid ? '#d1d5db' : '#dc2626'}`,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          outline: 'none'
        }}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.25rem',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000
          }}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelectOption(option)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                borderBottom: index < filteredOptions.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {inputValue && !isValid && (
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#dc2626' }}>
          Please select an option from the dropdown
        </p>
      )}
    </div>
  );
}

export function StudentProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    contactEmail: '',
    degree: '',
    yearOfStudy: '',
    expectedGraduation: '',
    academicFocus: '',
    mentoringGoals: [] as string[],
    skillsWanted: [] as string[],
    // New fields
    about: '',
    location: '',
    linkedInUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    gpa: '',
    languages: [] as string[],
    interests: [] as string[],
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
    projects: [] as Array<{
      id: string;
      name: string;
      description: string;
      technologies: string[];
      url: string;
      startDate: string;
      endDate: string;
    }>,
    certifications: [] as Array<{
      id: string;
      name: string;
      issuer: string;
      issueDate: string;
      expiryDate: string;
      credentialId: string;
      credentialUrl: string;
    }>,
  });
  
  const [newGoal, setNewGoal] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  // Separate state for graduation year and month
  const [graduationYear, setGraduationYear] = useState<string>('');
  const [graduationMonth, setGraduationMonth] = useState<string>('');

  // Track which entries are saved (from backend) vs editing (newly added)
  const [savedWorkExperienceIds, setSavedWorkExperienceIds] = useState<Set<string>>(new Set());
  const [savedProjectIds, setSavedProjectIds] = useState<Set<string>>(new Set());
  const [savedCertificationIds, setSavedCertificationIds] = useState<Set<string>>(new Set());
  
  // Track which entries are expanded (for viewing details)
  const [expandedWorkExperienceIds, setExpandedWorkExperienceIds] = useState<Set<string>>(new Set());
  const [expandedProjectIds, setExpandedProjectIds] = useState<Set<string>>(new Set());
  const [expandedCertificationIds, setExpandedCertificationIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<ProfileResponse>(API_ENDPOINTS.profile);
        
        if (response.user) {
          const expectedGrad = (response.user as any)?.expectedGraduation || '';
          // Parse expectedGraduation (e.g., "March 2026") into year and month
          let parsedYear = '';
          let parsedMonth = '';
          if (expectedGrad) {
            const parts = expectedGrad.split(' ');
            if (parts.length === 2) {
              parsedMonth = parts[0];
              parsedYear = parts[1];
            }
          }
          
          // Parse name into firstName and lastName
          const fullName = response.user.name || '';
          const nameParts = fullName.trim().split(/\s+/);
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          const userData = response.user as any;
          setFormData({
            firstName: firstName,
            lastName: lastName,
            studentId: response.user.studentId || '',
            contactEmail: userData?.contactEmail || response.user.email || '',
            degree: response.user.degree || '',
            yearOfStudy: response.user.yearOfStudy?.toString() || '',
            expectedGraduation: expectedGrad,
            academicFocus: userData?.academicFocus || '',
            mentoringGoals: response.user.mentoringGoals || [],
            skillsWanted: response.user.skillsWanted || [],
            about: userData?.about || '',
            location: userData?.location || '',
            linkedInUrl: userData?.linkedInUrl || '',
            githubUrl: userData?.githubUrl || '',
            portfolioUrl: userData?.portfolioUrl || '',
            gpa: userData?.gpa || '',
            languages: userData?.languages || [],
            interests: userData?.interests || [],
            workExperience: userData?.workExperience || [],
            projects: userData?.projects || [],
            certifications: userData?.certifications || [],
          });
          
          // Mark all loaded entries as saved
          // Ensure all entries have an id, generate one if missing (create new objects to avoid mutation)
          const workExpWithIds = (userData?.workExperience || []).map((exp: any, index: number) => ({
            ...exp,
            id: exp.id || `loaded-exp-${index}-${Date.now()}`
          }));
          const projectsWithIds = (userData?.projects || []).map((proj: any, index: number) => ({
            ...proj,
            id: proj.id || `loaded-proj-${index}-${Date.now()}`
          }));
          const certsWithIds = (userData?.certifications || []).map((cert: any, index: number) => ({
            ...cert,
            id: cert.id || `loaded-cert-${index}-${Date.now()}`
          }));
          
          // Update formData with entries that have ids
          setFormData(prev => ({
            ...prev,
            workExperience: workExpWithIds,
            projects: projectsWithIds,
            certifications: certsWithIds,
          }));
          
          // Mark all loaded entries as saved
          const workExpIds = new Set(workExpWithIds.map((exp: any) => exp.id));
          const projectIds = new Set(projectsWithIds.map((proj: any) => proj.id));
          const certIds = new Set(certsWithIds.map((cert: any) => cert.id));
          setSavedWorkExperienceIds(workExpIds);
          setSavedProjectIds(projectIds);
          setSavedCertificationIds(certIds);
          
          setGraduationYear(parsedYear);
          setGraduationMonth(parsedMonth);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        
        // If unauthorized, redirect to login
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }
        
        // Set error message
        setError(errorMessage);
        
        // Parse user name into firstName and lastName (fallback to user from context)
        const fullName = user?.name || '';
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData({
          firstName: firstName,
          lastName: lastName,
          studentId: '',
          contactEmail: user?.email || '',
          degree: '',
          yearOfStudy: '',
          expectedGraduation: '',
          academicFocus: '',
          mentoringGoals: [],
          skillsWanted: [],
          about: '',
          location: '',
          linkedInUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          gpa: '',
          languages: [],
          interests: [],
          workExperience: [],
          projects: [],
          certifications: [],
        });
        setGraduationYear('');
        setGraduationMonth('');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Update expectedGraduation when graduationYear or graduationMonth changes
  useEffect(() => {
    if (graduationYear && graduationMonth) {
      setFormData(prev => ({ ...prev, expectedGraduation: `${graduationMonth} ${graduationYear}` }));
    } else {
      setFormData(prev => ({ ...prev, expectedGraduation: '' }));
    }
  }, [graduationYear, graduationMonth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skillsWanted.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
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
    // New entries start in editing mode (not saved)
  };

  const handleSaveWorkExperience = (id: string) => {
    const exp = formData.workExperience.find(e => e.id === id);
    if (!exp) return;
    
    // Validate required fields (trim to handle whitespace-only values)
    if (!exp.title?.trim() || !exp.company?.trim()) {
      setError('Please fill in required fields (Job Title and Company)');
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Mark as saved
    setSavedWorkExperienceIds(prev => new Set([...prev, id]));
    setExpandedWorkExperienceIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id); // Collapse after saving
      return newSet;
    });
    setError(null);
  };

  const handleEditWorkExperience = (id: string) => {
    setExpandedWorkExperienceIds(prev => new Set([...prev, id]));
  };

  const handleCancelEditWorkExperience = (id: string) => {
    setExpandedWorkExperienceIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
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
    // Also remove from saved and expanded sets
    setSavedWorkExperienceIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setExpandedWorkExperienceIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [] as string[],
      url: '',
      startDate: '',
      endDate: ''
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    // New entries start in editing mode (not saved)
  };

  const handleSaveProject = (id: string) => {
    const project = formData.projects.find(p => p.id === id);
    if (!project) return;
    
    // Validate required fields (trim to handle whitespace-only values)
    if (!project.name?.trim()) {
      setError('Please fill in required fields (Project Name)');
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Mark as saved
    setSavedProjectIds(prev => new Set([...prev, id]));
    setExpandedProjectIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id); // Collapse after saving
      return newSet;
    });
    setError(null);
  };

  const handleEditProject = (id: string) => {
    setExpandedProjectIds(prev => new Set([...prev, id]));
  };

  const handleCancelEditProject = (id: string) => {
    setExpandedProjectIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleUpdateProject = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const handleRemoveProject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
    // Also remove from saved and expanded sets
    setSavedProjectIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setExpandedProjectIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleAddCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: ''
    };
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
    // New entries start in editing mode (not saved)
  };

  const handleSaveCertification = (id: string) => {
    const cert = formData.certifications.find(c => c.id === id);
    if (!cert) return;
    
    // Validate required fields (trim to handle whitespace-only values)
    if (!cert.name?.trim() || !cert.issuer?.trim()) {
      setError('Please fill in required fields (Certification Name and Issuing Organization)');
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Mark as saved
    setSavedCertificationIds(prev => new Set([...prev, id]));
    setExpandedCertificationIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id); // Collapse after saving
      return newSet;
    });
    setError(null);
  };

  const handleEditCertification = (id: string) => {
    setExpandedCertificationIds(prev => new Set([...prev, id]));
  };

  const handleCancelEditCertification = (id: string) => {
    setExpandedCertificationIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleUpdateCertification = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const handleRemoveCertification = (id: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
    // Also remove from saved and expanded sets
    setSavedCertificationIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setExpandedCertificationIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Validate degree, academicFocus, and expectedGraduation
    if (formData.degree && !DEGREE_OPTIONS.includes(formData.degree)) {
      setError('Please select a valid degree from the dropdown options');
      setSaving(false);
      return;
    }

    if (formData.academicFocus && !ACADEMIC_FOCUS_OPTIONS.includes(formData.academicFocus)) {
      setError('Please select a valid academic focus from the dropdown options');
      setSaving(false);
      return;
    }

    // Combine graduation year and month into expectedGraduation
    const expectedGraduation = (graduationYear && graduationMonth) 
      ? `${graduationMonth} ${graduationYear}` 
      : '';

    // Combine firstName and lastName into name
    const fullName = [formData.firstName.trim(), formData.lastName.trim()].filter(Boolean).join(' ');

    try {
      const updateData: any = {
        name: fullName || undefined,
        studentId: formData.studentId || undefined,
        contactEmail: formData.contactEmail || undefined,
        degree: formData.degree || undefined,
        yearOfStudy: formData.yearOfStudy ? parseInt(formData.yearOfStudy) : undefined,
        expectedGraduation: expectedGraduation || undefined,
        academicFocus: formData.academicFocus || undefined,
        mentoringGoals: formData.mentoringGoals,
        skillsWanted: formData.skillsWanted,
        about: formData.about || undefined,
        location: formData.location || undefined,
        linkedInUrl: formData.linkedInUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        portfolioUrl: formData.portfolioUrl || undefined,
        gpa: formData.gpa || undefined,
        languages: formData.languages,
        interests: formData.interests,
        workExperience: formData.workExperience,
        projects: formData.projects,
        certifications: formData.certifications,
      };

      await apiRequest(API_ENDPOINTS.profile, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      setSuccess(true);
      setSaving(false);
      // Show success message briefly, then navigate
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      
      // If unauthorized, redirect to login
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      setError(errorMessage);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/student/dashboard');
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = (): number => {
    let totalScore = 0;
    let earnedScore = 0;

    // High weight (8 points each) - Required fields
    const highWeightFields = [
      { value: formData.firstName, weight: 8 },
      { value: formData.lastName, weight: 8 },
      { value: formData.studentId, weight: 8 },
      { value: formData.degree, weight: 8 },
      { value: formData.yearOfStudy, weight: 8 },
      { value: formData.expectedGraduation, weight: 8 },
      { value: formData.academicFocus, weight: 8 },
    ];

    highWeightFields.forEach(field => {
      totalScore += field.weight;
      if (field.value && field.value.trim()) {
        earnedScore += field.weight;
      }
    });

    // Medium weight (5 points each) - Important optional fields
    // Work Experience (at least 1 entry)
    totalScore += 5;
    if (formData.workExperience && formData.workExperience.length > 0) {
      earnedScore += 5;
    }

    // Skills Wanted (at least 1)
    totalScore += 5;
    if (formData.skillsWanted && formData.skillsWanted.length > 0) {
      earnedScore += 5;
    }

    // Projects (at least 1 entry)
    totalScore += 5;
    if (formData.projects && formData.projects.length > 0) {
      earnedScore += 5;
    }

    // Certifications (at least 1 entry)
    totalScore += 5;
    if (formData.certifications && formData.certifications.length > 0) {
      earnedScore += 5;
    }

    // About
    totalScore += 5;
    if (formData.about && formData.about.trim()) {
      earnedScore += 5;
    }

    // Low weight (2 points each) - Supplementary information
    const lowWeightFields = [
      { value: formData.location, weight: 2 },
      { value: formData.linkedInUrl, weight: 2 },
      { value: formData.githubUrl, weight: 2 },
      { value: formData.portfolioUrl, weight: 2 },
    ];

    lowWeightFields.forEach(field => {
      totalScore += field.weight;
      if (field.value && field.value.trim()) {
        earnedScore += field.weight;
      }
    });

    // Languages (at least 1)
    totalScore += 2;
    if (formData.languages && formData.languages.length > 0) {
      earnedScore += 2;
    }

    // Interests (at least 1)
    totalScore += 2;
    if (formData.interests && formData.interests.length > 0) {
      earnedScore += 2;
    }

    // Lowest weight (1 point each) - Contact information
    const lowestWeightFields = [
      { value: formData.contactEmail, weight: 1 },
      { value: formData.gpa, weight: 1 },
    ];

    lowestWeightFields.forEach(field => {
      totalScore += field.weight;
      if (field.value && field.value.trim()) {
        earnedScore += field.weight;
      }
    });

    if (totalScore === 0) return 0;
    return Math.round((earnedScore / totalScore) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

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
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src={waikatoLogo} alt="Waikato" style={{ height: '40px', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Back button */}
        <button
          onClick={handleCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Edit Profile</h1>
            <p style={{ color: '#6b7280' }}>Update your profile information</p>
          </div>
        </div>

        {/* Profile Completion */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Profile Completion</h3>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: profileCompletion === 100 ? '#10b981' : '#C8102E' }}>
              {profileCompletion}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
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
                  Student ID <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
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
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Preferred email for contact (e.g., personal@gmail.com or student@students.waikato.ac.nz)"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
                <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  This email will be used for mentor contact. Can be your student email or personal email.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <AutocompleteInput
                  value={formData.degree}
                  onChange={(value) => setFormData(prev => ({ ...prev, degree: value }))}
                  options={DEGREE_OPTIONS}
                  placeholder="e.g., Bachelor of Science"
                  label="Degree"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  Year of Study
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4+</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                  Expected Graduation
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <select
                    value={graduationMonth}
                    onChange={(e) => setGraduationMonth(e.target.value)}
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
                    <option value="">Month</option>
                    {GRADUATION_MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
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
                    <option value="">Year</option>
                    {GRADUATION_YEARS.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <AutocompleteInput
                  value={formData.academicFocus}
                  onChange={(value) => setFormData(prev => ({ ...prev, academicFocus: value }))}
                  options={ACADEMIC_FOCUS_OPTIONS}
                  placeholder="e.g., Computer Science"
                  label="Academic Focus"
                />
              </div>
            </div>
          </div>

          {/* Mentoring Goals */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Mentoring Goals</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              What do you hope to achieve through mentoring?
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
                placeholder="Add a goal"
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
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={14} color="#6b7280" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Skills I Want to Learn</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              What skills would you like to develop?
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
                placeholder="Add a skill"
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.skillsWanted.map((skill, index) => (
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
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={14} color="#6b7280" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>About</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Write a brief introduction about yourself, your interests, and career aspirations
            </p>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows={5}
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
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 8.5/9.0"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername"
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
                  Portfolio/Website URL
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
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

          {/* Languages */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Languages</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              List languages you speak
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
                placeholder="e.g., English, Mandarin"
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
                onClick={handleAddLanguage}
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.languages.map((language, index) => (
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
                  {language}
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(language)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={14} color="#6b7280" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Interests</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Share your hobbies and interests
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                placeholder="e.g., Photography, Hiking"
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
                onClick={handleAddInterest}
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.interests.map((interest, index) => (
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
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={14} color="#6b7280" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Work Experience</h2>
              <button
                type="button"
                onClick={handleAddWorkExperience}
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
                + Add Experience
              </button>
            </div>

            {formData.workExperience.map((exp) => {
              const isSaved = savedWorkExperienceIds.has(exp.id);
              const isExpanded = expandedWorkExperienceIds.has(exp.id);
              const isEditing = !isSaved || isExpanded;

              // Compact card view (saved and not expanded)
              if (isSaved && !isExpanded) {
                return (
                  <div 
                    key={exp.id} 
                    onClick={() => handleEditWorkExperience(exp.id)}
                    style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem', 
                      padding: '1rem', 
                      marginBottom: '1rem',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {exp.title || 'Untitled Position'}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          {exp.company || 'Company not specified'}
                        </p>
                        {exp.location && (
                          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                            {exp.location}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                          {exp.startDate && (
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {exp.startDate}
                            </span>
                          )}
                          {exp.startDate && (exp.endDate || exp.current) && (
                            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>-</span>
                          )}
                          {exp.current ? (
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Present</span>
                          ) : exp.endDate ? (
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{exp.endDate}</span>
                          ) : null}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWorkExperience(exp.id);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={18} color="#dc2626" />
                        </button>
                        <ChevronDown size={18} color="#6b7280" />
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      Click to view details
                    </div>
                  </div>
                );
              }

              // Full form view (editing or newly added)
              return (
                <div key={exp.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Experience Entry</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {isSaved && (
                        <button
                          type="button"
                          onClick={() => handleCancelEditWorkExperience(exp.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#374151'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveWorkExperience(exp.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={18} color="#dc2626" />
                      </button>
                    </div>
                  </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleUpdateWorkExperience(exp.id, 'title', e.target.value)}
                      placeholder="e.g., Software Engineering Intern"
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
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleUpdateWorkExperience(exp.id, 'company', e.target.value)}
                      placeholder="e.g., Google"
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

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleUpdateWorkExperience(exp.id, 'current', e.target.checked)}
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
                        value={exp.startDate ? exp.startDate.split(' ')[0] || '' : ''}
                        onChange={(e) => {
                          const month = e.target.value;
                          const year = exp.startDate ? exp.startDate.split(' ')[1] : '';
                          handleUpdateWorkExperience(exp.id, 'startDate', month && year ? `${month} ${year}` : '');
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
                        value={exp.startDate ? exp.startDate.split(' ')[1] || '' : ''}
                        onChange={(e) => {
                          const year = e.target.value;
                          const month = exp.startDate ? exp.startDate.split(' ')[0] : '';
                          handleUpdateWorkExperience(exp.id, 'startDate', month && year ? `${month} ${year}` : '');
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
                          value={exp.endDate ? exp.endDate.split(' ')[0] || '' : ''}
                          onChange={(e) => {
                            const month = e.target.value;
                            const year = exp.endDate ? exp.endDate.split(' ')[1] : '';
                            handleUpdateWorkExperience(exp.id, 'endDate', month && year ? `${month} ${year}` : '');
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
                          value={exp.endDate ? exp.endDate.split(' ')[1] || '' : ''}
                          onChange={(e) => {
                            const year = e.target.value;
                            const month = exp.endDate ? exp.endDate.split(' ')[0] : '';
                            handleUpdateWorkExperience(exp.id, 'endDate', month && year ? `${month} ${year}` : '');
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

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleUpdateWorkExperience(exp.id, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Save button for this entry */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveWorkExperience(exp.id)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      backgroundColor: '#C8102E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          {/* Projects */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Projects</h2>
              <button
                type="button"
                onClick={handleAddProject}
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
                + Add Project
              </button>
            </div>

            {formData.projects.map((project) => {
              const isSaved = savedProjectIds.has(project.id);
              const isExpanded = expandedProjectIds.has(project.id);
              const isEditing = !isSaved || isExpanded;

              // Compact card view (saved and not expanded)
              if (isSaved && !isExpanded) {
                return (
                  <div 
                    key={project.id} 
                    onClick={() => handleEditProject(project.id)}
                    style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem', 
                      padding: '1rem', 
                      marginBottom: '1rem',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {project.name || 'Untitled Project'}
                        </h3>
                        {project.technologies && project.technologies.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span key={idx} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', color: '#6b7280' }}>
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>+{project.technologies.length - 3} more</span>
                            )}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                          {project.startDate && (
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {project.startDate}
                            </span>
                          )}
                          {project.startDate && project.endDate && (
                            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>-</span>
                          )}
                          {project.endDate && (
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{project.endDate}</span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProject(project.id);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={18} color="#dc2626" />
                        </button>
                        <ChevronDown size={18} color="#6b7280" />
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      Click to view details
                    </div>
                  </div>
                );
              }

              // Full form view (editing or newly added)
              return (
                <div key={project.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Project Entry</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {isSaved && (
                        <button
                          type="button"
                          onClick={() => handleCancelEditProject(project.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#374151'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(project.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={18} color="#dc2626" />
                      </button>
                    </div>
                  </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => handleUpdateProject(project.id, 'name', e.target.value)}
                    placeholder="e.g., E-commerce Website"
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

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                    placeholder="Describe the project, your role, and key achievements..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={project.technologies.join(', ')}
                      onChange={(e) => {
                        const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        handleUpdateProject(project.id, 'technologies', techs);
                      }}
                      placeholder="e.g., React, Node.js, MongoDB"
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
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={project.url}
                      onChange={(e) => handleUpdateProject(project.id, 'url', e.target.value)}
                      placeholder="https://github.com/username/project"
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Start Date
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <select
                        value={project.startDate ? project.startDate.split(' ')[0] || '' : ''}
                        onChange={(e) => {
                          const month = e.target.value;
                          const year = project.startDate ? project.startDate.split(' ')[1] : '';
                          handleUpdateProject(project.id, 'startDate', month && year ? `${month} ${year}` : '');
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
                        value={project.startDate ? project.startDate.split(' ')[1] || '' : ''}
                        onChange={(e) => {
                          const year = e.target.value;
                          const month = project.startDate ? project.startDate.split(' ')[0] : '';
                          handleUpdateProject(project.id, 'startDate', month && year ? `${month} ${year}` : '');
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

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      End Date
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <select
                        value={project.endDate ? project.endDate.split(' ')[0] || '' : ''}
                        onChange={(e) => {
                          const month = e.target.value;
                          const year = project.endDate ? project.endDate.split(' ')[1] : '';
                          handleUpdateProject(project.id, 'endDate', month && year ? `${month} ${year}` : '');
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
                        value={project.endDate ? project.endDate.split(' ')[1] || '' : ''}
                        onChange={(e) => {
                          const year = e.target.value;
                          const month = project.endDate ? project.endDate.split(' ')[0] : '';
                          handleUpdateProject(project.id, 'endDate', month && year ? `${month} ${year}` : '');
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
                </div>

                {/* Save button for this entry */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveProject(project.id)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      backgroundColor: '#C8102E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          {/* Certifications */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Certifications</h2>
              <button
                type="button"
                onClick={handleAddCertification}
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
                + Add Certification
              </button>
            </div>

            {formData.certifications.map((cert) => {
              const isSaved = savedCertificationIds.has(cert.id);
              const isExpanded = expandedCertificationIds.has(cert.id);
              const isEditing = !isSaved || isExpanded;

              // Compact card view (saved and not expanded)
              if (isSaved && !isExpanded) {
                return (
                  <div 
                    key={cert.id} 
                    onClick={() => handleEditCertification(cert.id)}
                    style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem', 
                      padding: '1rem', 
                      marginBottom: '1rem',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {cert.name || 'Untitled Certification'}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          {cert.issuer || 'Issuer not specified'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                          {cert.issueDate && (
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              Issued: {cert.issueDate}
                            </span>
                          )}
                          {cert.expiryDate && (
                            <>
                              <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>|</span>
                              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Expires: {cert.expiryDate}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCertification(cert.id);
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={18} color="#dc2626" />
                        </button>
                        <ChevronDown size={18} color="#6b7280" />
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      Click to view details
                    </div>
                  </div>
                );
              }

              // Full form view (editing or newly added)
              return (
                <div key={cert.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Certification Entry</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {isSaved && (
                        <button
                          type="button"
                          onClick={() => handleCancelEditCertification(cert.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#374151'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveCertification(cert.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={18} color="#dc2626" />
                      </button>
                    </div>
                  </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleUpdateCertification(cert.id, 'name', e.target.value)}
                      placeholder="e.g., AWS Certified Solutions Architect"
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
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleUpdateCertification(cert.id, 'issuer', e.target.value)}
                      placeholder="e.g., Amazon Web Services"
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
                      Issue Date
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <select
                        value={cert.issueDate ? cert.issueDate.split(' ')[0] || '' : ''}
                        onChange={(e) => {
                          const month = e.target.value;
                          const year = cert.issueDate ? cert.issueDate.split(' ')[1] : '';
                          handleUpdateCertification(cert.id, 'issueDate', month && year ? `${month} ${year}` : '');
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
                        value={cert.issueDate ? cert.issueDate.split(' ')[1] || '' : ''}
                        onChange={(e) => {
                          const year = e.target.value;
                          const month = cert.issueDate ? cert.issueDate.split(' ')[0] : '';
                          handleUpdateCertification(cert.id, 'issueDate', month && year ? `${month} ${year}` : '');
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

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Expiry Date (if applicable)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <select
                        value={cert.expiryDate ? cert.expiryDate.split(' ')[0] || '' : ''}
                        onChange={(e) => {
                          const month = e.target.value;
                          const year = cert.expiryDate ? cert.expiryDate.split(' ')[1] : '';
                          handleUpdateCertification(cert.id, 'expiryDate', month && year ? `${month} ${year}` : '');
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
                        value={cert.expiryDate ? cert.expiryDate.split(' ')[1] || '' : ''}
                        onChange={(e) => {
                          const year = e.target.value;
                          const month = cert.expiryDate ? cert.expiryDate.split(' ')[0] : '';
                          handleUpdateCertification(cert.id, 'expiryDate', month && year ? `${month} ${year}` : '');
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => handleUpdateCertification(cert.id, 'credentialId', e.target.value)}
                      placeholder="e.g., ABC123XYZ"
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
                      Credential URL
                    </label>
                    <input
                      type="url"
                      value={cert.credentialUrl}
                      onChange={(e) => handleUpdateCertification(cert.id, 'credentialUrl', e.target.value)}
                      placeholder="https://..."
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

                {/* Save button for this entry */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveCertification(cert.id)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      backgroundColor: '#C8102E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
              );
            })}
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
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
                padding: '0.5rem 1.5rem',
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
      </div>
    </div>
  );
}

