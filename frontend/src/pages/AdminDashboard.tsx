import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest, API_BASE_URL } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { 
  Users, GraduationCap, Award, Clock, CheckCircle, XCircle, LogOut,
  Target, Mail, FileText, ArrowLeft, Key, Copy, Plus, ChevronDown, ChevronUp, AlertCircle, Bell
} from 'lucide-react';

const waikatoLogo = '/waikato-logo.png';

interface PendingUser {
  id: number;
  name: string;
  email: string;
  role: string;
  approvalStatus: string;
  createdAt: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
  approvalStatus: string;
  createdAt: string;
  studentId?: string;
  contactEmail?: string;
  degree?: string;
  yearOfStudy?: number;
  expectedGraduation?: string;
  academicFocus?: string;
  mentoringGoals?: string[];
  skillsWanted?: string[];
  cvFileName?: string;
  cvUploadedAt?: string;
  about?: string;
  location?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  gpa?: string;
  languages?: string[];
  interests?: string[];
  workExperience?: any;
  projects?: any;
  certifications?: any;
}

interface Alumni {
  id: number;
  name: string;
  email: string;
  role: string;
  approvalStatus: string;
  createdAt: string;
  graduationYear?: number;
  currentCompany?: string;
  currentPosition?: string;
  mentoringGoals?: string[];
  skillsOffered?: string[];
  about?: string;
  location?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  languages?: string[];
  interests?: string[];
  workExperience?: any;
  projects?: any;
  certifications?: any;
}

interface Match {
  id: number;
  status: string;
  matchScore?: number;
  matchReasons?: string[];
  coverLetter?: string;
  confirmedAt?: string;
  createdAt: string;
  student: {
    id: number;
    name: string;
    email: string;
    studentId?: string;
    degree?: string;
    yearOfStudy?: number;
    expectedGraduation?: string;
    academicFocus?: string;
  };
  alumni: {
    id: number;
    name: string;
    email: string;
    graduationYear?: number;
    currentCompany?: string;
    currentPosition?: string;
  };
  confirmedBy?: {
    id: number;
    name: string;
    email: string;
  };
}

interface AdminStats {
  totalStudents: number;
  totalAlumni: number;
  pendingStudents: number;
  totalMatches: number;
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize viewMode from URL params or default to 'overview'
  const initialViewMode = (() => {
    const view = searchParams.get('view') as 'overview' | 'students' | 'studentDetail' | 'alumni' | 'alumniDetail' | 'matches' | 'matchDetail' | 'pending' | 'pendingDetail' | 'stats' | null;
    // Map 'stats' to 'overview' for backward compatibility
    if (view === 'stats') return 'overview';
    return view || 'overview';
  })();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalAlumni: 0,
    pendingStudents: 0,
    totalMatches: 0,
  });
  const [pendingAlumni, setPendingAlumni] = useState<PendingUser[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [pendingMatchesCount, setPendingMatchesCount] = useState<number>(0);
  const [activeMatchesCount, setActiveMatchesCount] = useState<number>(0);
  const [awaitingAlumniCount, setAwaitingAlumniCount] = useState<number>(0);
  const [matchFilter, setMatchFilter] = useState<'all' | 'pending' | 'active'>('all');
  const [coverLetterExpanded, setCoverLetterExpanded] = useState<boolean>(false);
  const [studentFilter, setStudentFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [studentSortBy, setStudentSortBy] = useState<'name' | 'createdAt'>('name');
  const [alumniFilter, setAlumniFilter] = useState<'all' | 'matched' | 'awaitingResponse' | 'unmatched'>('all');
  const [alumniSortBy, setAlumniSortBy] = useState<'name' | 'createdAt'>('name');
  const [viewMode, setViewMode] = useState<'overview' | 'students' | 'studentDetail' | 'alumni' | 'alumniDetail' | 'matches' | 'matchDetail' | 'pending' | 'pendingDetail'>(initialViewMode);
  const [studentSubFilter, setStudentSubFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [alumniSubFilter, setAlumniSubFilter] = useState<'all' | 'matched' | 'unmatched' | 'awaitingResponse'>('all');
  const [matchSubFilter, setMatchSubFilter] = useState<'all' | 'active' | 'completed' | 'pending' | 'awaitingAlumni'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [expandedWorkExp, setExpandedWorkExp] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [expandedCertification, setExpandedCertification] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingMatch, setProcessingMatch] = useState<number | null>(null);
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [newInvitationCode, setNewInvitationCode] = useState('');
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [creatingInvitationCode, setCreatingInvitationCode] = useState(false);

  // Update URL when viewMode changes
  useEffect(() => {
    const currentView = searchParams.get('view') || 'overview';
    // Only update if the URL doesn't match current viewMode
    if (currentView !== viewMode) {
      const params = new URLSearchParams(searchParams);
      if (viewMode === 'overview') {
        params.delete('view');
      } else {
        params.set('view', viewMode);
      }
      setSearchParams(params, { replace: true });
    }
  }, [viewMode, searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine what data to load based on current viewMode
        const shouldLoadStudents = viewMode === 'students' || viewMode === 'studentDetail';
        const shouldLoadAlumni = viewMode === 'alumni' || viewMode === 'alumniDetail';
        // Load matches for students/alumni views too, as we need match status for displaying student/alumni status
        const shouldLoadMatches = viewMode === 'matches' || viewMode === 'matchDetail' || viewMode === 'overview' || viewMode === 'students' || viewMode === 'studentDetail' || viewMode === 'alumni' || viewMode === 'alumniDetail';

        const [statsResponse, studentsResponse, alumniResponse, matchesResponse, invitationCodeResponse] = await Promise.allSettled([
          apiRequest<AdminStats>(API_ENDPOINTS.adminStatistics),
          shouldLoadStudents 
            ? apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents).catch(() => ({ students: [] }))
            : apiRequest<{ students: PendingUser[] }>(API_ENDPOINTS.adminPendingStudents).catch(() => ({ students: [] })),
          shouldLoadAlumni
            ? apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni).catch(() => ({ mentors: [] }))
            : apiRequest<{ mentors: PendingUser[] }>(API_ENDPOINTS.adminPendingAlumni).catch(() => ({ mentors: [] })),
          shouldLoadMatches
            ? apiRequest<{ matches: Match[] }>(API_ENDPOINTS.adminAllMatches).catch(() => ({ matches: [] }))
            : Promise.resolve({ matches: [] }),
          apiRequest<{ code: string | null }>(API_ENDPOINTS.adminGetInvitationCode).catch(() => ({ code: null }))
        ]);

        if (statsResponse.status === 'fulfilled') {
          setStats(statsResponse.value);
        } else {
          const error = statsResponse.reason;
          if (error instanceof Error && (error.message.includes('expired') || error.message.includes('Unauthorized'))) {
            // Token expired, will be handled by apiRequest
            return;
          }
          console.warn('Failed to load statistics');
        }

        if (studentsResponse.status === 'fulfilled') {
          if (shouldLoadStudents) {
            setAllStudents((studentsResponse.value as { students: Student[] }).students || []);
          } else {
            // For overview, we don't need to set allStudents
          }
        }

        if (alumniResponse.status === 'fulfilled') {
          if (shouldLoadAlumni) {
            setAllAlumni((alumniResponse.value as { mentors: Alumni[] }).mentors || []);
          } else {
            setPendingAlumni((alumniResponse.value as { mentors: PendingUser[] }).mentors || []);
          }
        } else {
          if (shouldLoadAlumni) {
            setAllAlumni([]);
          } else {
            setPendingAlumni([]);
          }
        }

        if (matchesResponse.status === 'fulfilled') {
          const matches = (matchesResponse.value as { matches: Match[] }).matches || [];
          setAllMatches(matches);
          const pendingCount = matches.filter(m => m.status === 'pending').length;
          const activeCount = matches.filter(m => m.status === 'accepted').length;
          const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
          setPendingMatchesCount(pendingCount);
          setActiveMatchesCount(activeCount);
          setAwaitingAlumniCount(awaitingCount);
        } else {
          setAllMatches([]);
          setPendingMatchesCount(0);
          setActiveMatchesCount(0);
          setAwaitingAlumniCount(0);
        }

        if (invitationCodeResponse.status === 'fulfilled') {
          setInvitationCode(invitationCodeResponse.value.code);
        } else {
          setInvitationCode(null);
        }
      } catch (err) {
        console.warn('Failed to load data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode]);

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleViewAllStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents);
      setAllStudents(response.students || []);
      setViewMode('students');
      // URL will be updated by the useEffect that watches viewMode
    } catch (err) {
      console.error('Failed to load all students:', err);
      setError('Failed to load students list');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setSelectedStudent(null);
    setSelectedAlumni(null);
    setSelectedMatch(null);
    setMatchFilter('all');
    setStudentFilter('all');
    setStudentSubFilter('all');
    setStudentSortBy('name');
    setAlumniFilter('all');
    setAlumniSubFilter('all');
    setAlumniSortBy('name');
    setMatchSubFilter('all');
  };

  const handleBackToStudentsList = () => {
    setViewMode('students');
    setSelectedStudent(null);
  };

  const handleViewStudentDetail = async (student: Student) => {
    // If student is pending, navigate to pending students list and show detail
    if (student.approvalStatus === 'pending') {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminPendingStudents);
        setPendingStudents(response.students || []);
        setSelectedStudent(student);
        setViewMode('pendingDetail');
      } catch (err) {
        console.error('Failed to load pending students:', err);
        setError('Failed to load pending students list');
      } finally {
        setLoading(false);
      }
    } else {
      // For approved students, show normal detail view
      setSelectedStudent(student);
      setViewMode('studentDetail');
    }
  };

  const handleViewAllAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni);
      setAllAlumni(response.mentors || []);
      setViewMode('alumni');
    } catch (err) {
      console.error('Failed to load all alumni:', err);
      setError('Failed to load alumni list');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAlumniList = () => {
    setViewMode('alumni');
    setSelectedAlumni(null);
  };

  const handleViewAlumniDetail = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setViewMode('alumniDetail');
  };

  const handleViewPendingStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminPendingStudents);
      setPendingStudents(response.students || []);
      setViewMode('pending');
    } catch (err) {
      console.error('Failed to load pending students:', err);
      setError('Failed to load pending students list');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPendingList = () => {
    setViewMode('pending');
    setSelectedStudent(null);
  };

  const handleViewPendingStudentDetail = (student: Student) => {
    setSelectedStudent(student);
    setViewMode('pendingDetail');
  };

  const handleViewAllMatches = async (filter: 'all' | 'pending' | 'active' = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest<{ matches: Match[] }>(API_ENDPOINTS.adminAllMatches);
      const matches = response.matches || [];
      setAllMatches(matches);
      const pendingCount = matches.filter(m => m.status === 'pending').length;
      const activeCount = matches.filter(m => m.status === 'accepted').length;
      const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
      setPendingMatchesCount(pendingCount);
      setActiveMatchesCount(activeCount);
      setAwaitingAlumniCount(awaitingCount);
      setMatchFilter(filter);
      setViewMode('matches');
    } catch (err) {
      console.error('Failed to load all matches:', err);
      setError('Failed to load matches list');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPendingMatches = () => {
    handleViewAllMatches('pending');
  };

  const handleViewActiveMatches = () => {
    handleViewAllMatches('active');
  };

  const handleBackToMatchesList = () => {
    setViewMode('matches');
    setSelectedMatch(null);
  };

  const handleViewMatchDetail = (match: Match) => {
    setSelectedMatch(match);
    setViewMode('matchDetail');
    setCoverLetterExpanded(false);
  };

  const handleApproveMatch = async (matchId: number) => {
    try {
      setProcessingMatch(matchId);
      setError(null);
      
      await apiRequest(API_ENDPOINTS.approveMatch(matchId), {
        method: 'POST',
      });

      // Refresh matches list and stats
      const [matchesResponse, statsResponse] = await Promise.allSettled([
        apiRequest<{ matches: Match[] }>(API_ENDPOINTS.adminAllMatches).catch(() => ({ matches: [] })),
        apiRequest<AdminStats>(API_ENDPOINTS.adminStatistics),
      ]);

      if (matchesResponse.status === 'fulfilled') {
        const matches = matchesResponse.value.matches || [];
        setAllMatches(matches);
        const pendingCount = matches.filter(m => m.status === 'pending').length;
        const activeCount = matches.filter(m => m.status === 'accepted').length;
        const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
        setPendingMatchesCount(pendingCount);
        setActiveMatchesCount(activeCount);
        setAwaitingAlumniCount(awaitingCount);
        // Update selected match if viewing detail
        if (viewMode === 'matchDetail' && selectedMatch && selectedMatch.id === matchId) {
          const updated = matches.find(m => m.id === matchId);
          if (updated) {
            setSelectedMatch(updated);
          }
        }
      }
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve match');
    } finally {
      setProcessingMatch(null);
    }
  };

  const handleRejectMatch = async (matchId: number) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessingMatch(matchId);
      setError(null);
      
      await apiRequest(API_ENDPOINTS.rejectMatch(matchId), {
        method: 'POST',
        body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
      });

      // Close modal and clear reason
      setShowRejectModal(false);
      setRejectionReason('');

      // Refresh matches list and stats
      const [matchesResponse, statsResponse] = await Promise.allSettled([
        apiRequest<{ matches: Match[] }>(API_ENDPOINTS.adminAllMatches).catch(() => ({ matches: [] })),
        apiRequest<AdminStats>(API_ENDPOINTS.adminStatistics),
      ]);

      if (matchesResponse.status === 'fulfilled') {
        const matches = matchesResponse.value.matches || [];
        setAllMatches(matches);
        const pendingCount = matches.filter(m => m.status === 'pending').length;
        const activeCount = matches.filter(m => m.status === 'accepted').length;
        const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
        setPendingMatchesCount(pendingCount);
        setActiveMatchesCount(activeCount);
        setAwaitingAlumniCount(awaitingCount);
        // If viewing detail of rejected match, go back to list (preserve current filter)
        if (viewMode === 'matchDetail' && selectedMatch && selectedMatch.id === matchId) {
          setViewMode('matches');
          setSelectedMatch(null);
          // Keep current matchFilter
        }
      }
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject match');
    } finally {
      setProcessingMatch(null);
    }
  };

  const handleApprove = async (userId: number, role: string) => {
    try {
      setError(null);
      const endpoint = role === 'student' 
        ? API_ENDPOINTS.adminApproveStudent(userId)
        : API_ENDPOINTS.adminApproveAlumni(userId);
      
      const response = await apiRequest(endpoint, { method: 'POST' });
      
      // Refresh data
      const [studentsResponse, alumniResponse, statsResponse, allStudentsResponse, allAlumniResponse] = await Promise.allSettled([
        apiRequest<{ students: PendingUser[] }>(API_ENDPOINTS.adminPendingStudents).catch(() => ({ students: [] })),
        apiRequest<{ mentors: PendingUser[] }>(API_ENDPOINTS.adminPendingAlumni).catch(() => ({ mentors: [] })),
        apiRequest<AdminStats>(API_ENDPOINTS.adminStatistics),
        viewMode === 'students' || viewMode === 'studentDetail' || viewMode === 'pendingDetail'
          ? apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents).catch(() => ({ students: [] }))
          : Promise.resolve({ students: [] }),
        viewMode === 'alumni' || viewMode === 'alumniDetail' 
          ? apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni).catch(() => ({ mentors: [] }))
          : Promise.resolve({ mentors: [] })
      ]);

      if (studentsResponse.status === 'fulfilled') {
        setPendingStudents(studentsResponse.value.students || []);
        
        // If in pendingDetail view and student is approved, go back to pending list
        if (viewMode === 'pendingDetail' && role === 'student') {
          // If no more pending students, go back to overview
          if (!studentsResponse.value.students || studentsResponse.value.students.length === 0) {
            setViewMode('overview');
            setSelectedStudent(null);
          } else {
            // Go back to pending list
            setViewMode('pending');
            setSelectedStudent(null);
          }
        }
      }
      if (alumniResponse.status === 'fulfilled') {
        setPendingAlumni(alumniResponse.value.mentors || []);
      }
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value);
      }
      if (allStudentsResponse.status === 'fulfilled' && allStudentsResponse.value.students) {
        setAllStudents(allStudentsResponse.value.students);
        // Update selected student if viewing detail (but not pendingDetail, handled above)
        if (viewMode === 'studentDetail' && selectedStudent) {
          const updated = allStudentsResponse.value.students.find(s => s.id === selectedStudent.id);
          if (updated) {
            // If student was pending and is now approved, go back to students list
            if (selectedStudent.approvalStatus === 'pending' && updated.approvalStatus === 'approved') {
              setViewMode('students');
              setSelectedStudent(null);
            } else {
              setSelectedStudent(updated);
            }
          }
        }
      }
      if (allAlumniResponse.status === 'fulfilled' && allAlumniResponse.value.mentors) {
        setAllAlumni(allAlumniResponse.value.mentors);
        // Update selected alumni if viewing detail
        if (viewMode === 'alumniDetail' && selectedAlumni) {
          const updated = allAlumniResponse.value.mentors.find(a => a.id === selectedAlumni.id);
          if (updated) {
            setSelectedAlumni(updated);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve user');
      console.error('Approve error:', err);
    }
  };

  const handleCreateInvitationCode = async () => {
    if (!newInvitationCode.trim()) {
      setError('Please enter an invitation code');
      return;
    }

    try {
      setCreatingInvitationCode(true);
      setError(null);
      
      const response = await apiRequest<{ invitationCode: { code: string } }>(API_ENDPOINTS.adminCreateInvitationCode, {
        method: 'POST',
        body: JSON.stringify({ code: newInvitationCode.trim() }),
      });

      setInvitationCode(response.invitationCode.code);
      setShowInvitationModal(false);
      setNewInvitationCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invitation code');
    } finally {
      setCreatingInvitationCode(false);
    }
  };

  const handleReject = async (userId: number, role: string) => {
    if (!window.confirm(`Are you sure you want to reject this ${role}?`)) {
      return;
    }

    try {
      setError(null);
      const endpoint = role === 'student' 
        ? API_ENDPOINTS.adminRejectStudent(userId)
        : API_ENDPOINTS.adminRejectAlumni(userId);
      
      await apiRequest(endpoint, { method: 'POST' });
      
      // Refresh data
      const [studentsResponse, alumniResponse, statsResponse, allStudentsResponse, allAlumniResponse] = await Promise.allSettled([
        apiRequest<{ students: PendingUser[] }>(API_ENDPOINTS.adminPendingStudents).catch(() => ({ students: [] })),
        apiRequest<{ mentors: PendingUser[] }>(API_ENDPOINTS.adminPendingAlumni).catch(() => ({ mentors: [] })),
        apiRequest<AdminStats>(API_ENDPOINTS.adminStatistics),
        viewMode === 'students' || viewMode === 'studentDetail' || viewMode === 'pendingDetail'
          ? apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents).catch(() => ({ students: [] }))
          : Promise.resolve({ students: [] }),
        viewMode === 'alumni' || viewMode === 'alumniDetail' 
          ? apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni).catch(() => ({ mentors: [] }))
          : Promise.resolve({ mentors: [] })
      ]);

      if (studentsResponse.status === 'fulfilled') {
        setPendingStudents(studentsResponse.value.students || []);
        
        // If in pendingDetail view and student is rejected, go back to pending list
        if (viewMode === 'pendingDetail' && role === 'student') {
          // If no more pending students, go back to overview
          if (!studentsResponse.value.students || studentsResponse.value.students.length === 0) {
            setViewMode('overview');
            setSelectedStudent(null);
          } else {
            // Go back to pending list
            setViewMode('pending');
            setSelectedStudent(null);
          }
        }
      }
      if (alumniResponse.status === 'fulfilled') {
        setPendingAlumni(alumniResponse.value.mentors || []);
      }
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value);
      }
      if (allStudentsResponse.status === 'fulfilled' && allStudentsResponse.value.students) {
        setAllStudents(allStudentsResponse.value.students);
        // Update selected student if viewing detail
        if (viewMode === 'studentDetail' && selectedStudent) {
          const updated = allStudentsResponse.value.students.find(s => s.id === selectedStudent.id);
          if (updated) {
            setSelectedStudent(updated);
          }
        }
      }
      if (allAlumniResponse.status === 'fulfilled' && allAlumniResponse.value.mentors) {
        setAllAlumni(allAlumniResponse.value.mentors);
        // Update selected alumni if viewing detail
        if (viewMode === 'alumniDetail' && selectedAlumni) {
          const updated = allAlumniResponse.value.mentors.find(a => a.id === selectedAlumni.id);
          if (updated) {
            setSelectedAlumni(updated);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject user');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
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

      {/* Pending Approval Alert Banners */}
      {viewMode === 'overview' && (stats.pendingStudents > 0 || pendingMatchesCount > 0) && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.pendingStudents > 0 && (
              <div 
                onClick={async () => {
                  await handleViewAllStudents();
                  setStudentSubFilter('pending');
                }}
                style={{ 
                  backgroundColor: '#fef3c7', 
                  border: '2px solid #fbbf24', 
                  borderRadius: '0.5rem', 
                  padding: '1rem 1.5rem', 
                  color: '#92400e', 
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(251, 191, 36, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fde68a';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(251, 191, 36, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(251, 191, 36, 0.2)';
                }}
              >
                <AlertCircle size={24} style={{ flexShrink: 0, animation: 'pulse 2s infinite' }} />
                <div style={{ flex: 1 }}>
                  <strong>Action Required:</strong> You have <strong>{stats.pendingStudents}</strong> student{stats.pendingStudents > 1 ? 's' : ''} waiting for approval. Click here to review.
                </div>
                <ArrowLeft size={20} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
              </div>
            )}
            {pendingMatchesCount > 0 && (
              <div 
                onClick={async () => {
                  await handleViewAllMatches('pending');
                  setMatchSubFilter('pending');
                }}
                style={{ 
                  backgroundColor: '#fef3c7', 
                  border: '2px solid #fbbf24', 
                  borderRadius: '0.5rem', 
                  padding: '1rem 1.5rem', 
                  color: '#92400e', 
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(251, 191, 36, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fde68a';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(251, 191, 36, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(251, 191, 36, 0.2)';
                }}
              >
                <AlertCircle size={24} style={{ flexShrink: 0, animation: 'pulse 2s infinite' }} />
                <div style={{ flex: 1 }}>
                  <strong>Action Required:</strong> You have <strong>{pendingMatchesCount}</strong> match request{pendingMatchesCount > 1 ? 's' : ''} waiting for approval. Click here to review.
                </div>
                <ArrowLeft size={20} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
              </div>
            )}
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
                Welcome back, {user?.name}!
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Manage users, approvals, and system settings
              </p>
            </div>

            {/* Main Overview - 3 Core Sections */}
            {viewMode === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Students Section */}
                <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleViewAllStudents();
                  }}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                    border: '2px solid #e5e7eb', 
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#C8102E';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '0.75rem', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GraduationCap size={32} color="#16a34a" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Students</h2>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage student accounts and approvals</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', alignItems: 'end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{stats.totalStudents - stats.pendingStudents}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Approved Students</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{stats.pendingStudents}</div>
                          {stats.pendingStudents > 0 && (
                            <AlertCircle 
                              size={24} 
                              color="#f97316" 
                              style={{ 
                                animation: 'pulse 2s infinite',
                                filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))'
                              }} 
                            />
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending Approval</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
                    <span>Click to view details</span>
                    <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </div>

                {/* Alumni Section */}
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleViewAllAlumni();
                  }}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                    border: '2px solid #e5e7eb', 
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#C8102E';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '0.75rem', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={32} color="#2563eb" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Alumni</h2>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage alumni mentors</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', alignItems: 'end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{stats.totalAlumni}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Alumni</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>{activeMatchesCount}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>In Active Matches</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
                    <span>Click to view details</span>
                    <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </div>

                {/* Matches Section */}
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleViewAllMatches('all');
                  }}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.75rem', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                    border: '2px solid #e5e7eb', 
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#C8102E';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '0.75rem', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Target size={32} color="#C8102E" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Matches</h2>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage mentorship matches</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', alignItems: 'end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>{activeMatchesCount}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{pendingMatchesCount + awaitingAlumniCount}</div>
                          {pendingMatchesCount > 0 && (
                            <AlertCircle 
                              size={24} 
                              color="#f97316" 
                              style={{ 
                                animation: 'pulse 2s infinite',
                                filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))'
                              }} 
                            />
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>
                    <span>Click to view details</span>
                    <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Invitation Code Management */}
            {viewMode === 'overview' && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Key size={20} color="#C8102E" />
                    Alumni Invitation Code
                  </h2>
                  <button
                    onClick={() => {
                      setNewInvitationCode('');
                      setShowInvitationModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#C8102E',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    <Plus size={16} />
                    Generate New Code
                  </button>
                </div>
                
                {invitationCode ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Current Active Code</p>
                      <p style={{ fontSize: '1.125rem', fontWeight: 600, fontFamily: 'monospace', color: '#111827' }}>{invitationCode}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(invitationCode);
                        // Simple feedback - you could enhance this with a toast notification
                        alert('Invitation code copied to clipboard!');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#fef3c7', 
                    borderRadius: '0.5rem',
                    border: '1px solid #fde68a'
                  }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem' }}>
                      No active invitation code. Generate one to allow alumni registration.
                    </p>
                    <button
                      onClick={() => {
                        setNewInvitationCode('');
                        setShowInvitationModal(true);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#C8102E',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      <Plus size={16} />
                      Generate Invitation Code
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* All Students List */}
            {viewMode === 'students' && (() => {
              // Get student match statuses - priority: accepted > confirmed > pending
              const studentMatchStatuses = new Map<number, 'accepted' | 'confirmed' | 'pending'>();
              
              allMatches.forEach(match => {
                const studentId = match.student.id;
                const currentStatus = studentMatchStatuses.get(studentId);
                
                // Priority: accepted > confirmed > pending
                if (match.status === 'accepted') {
                  studentMatchStatuses.set(studentId, 'accepted');
                } else if (match.status === 'confirmed' && currentStatus !== 'accepted') {
                  studentMatchStatuses.set(studentId, 'confirmed');
                } else if (match.status === 'pending' && !currentStatus) {
                  studentMatchStatuses.set(studentId, 'pending');
                }
              });

              // Get student IDs who are fully matched (accepted only)
              const fullyMatchedStudentIds = new Set(
                allMatches
                  .filter(m => m.status === 'accepted')
                  .map(m => m.student.id)
              );

              // Filter students by sub-filter
              const filteredStudents = allStudents.filter(s => {
                if (studentSubFilter === 'all') return true;
                if (studentSubFilter === 'approved' && s.approvalStatus !== 'approved') return false;
                if (studentSubFilter === 'pending' && s.approvalStatus !== 'pending') return false;
                return true;
              });

              // Sort students by name (A-Z)
              const sortedStudents = [...filteredStudents].sort((a, b) => {
                return a.name.localeCompare(b.name);
              });

              return (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={handleBackToOverview}
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
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Students Management</h2>
                  </div>
                  
                  {/* Category Tabs */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
                    {(['all', 'approved', 'pending'] as const).map((filter) => {
                      const labels: Record<typeof filter, string> = {
                        all: 'All Students',
                        approved: 'Approved',
                        pending: 'Pending Approval'
                      };
                      const counts: Record<typeof filter, number> = {
                        all: allStudents.length,
                        approved: allStudents.filter(s => s.approvalStatus === 'approved').length,
                        pending: allStudents.filter(s => s.approvalStatus === 'pending').length
                      };
                      const pendingCount = counts[filter];
                      const showBadge = filter === 'pending' && pendingCount > 0;
                      
                      return (
                        <button
                          key={filter}
                          onClick={() => setStudentSubFilter(filter)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderBottom: studentSubFilter === filter ? '3px solid #C8102E' : '3px solid transparent',
                            backgroundColor: 'transparent',
                            color: studentSubFilter === filter ? '#C8102E' : '#6b7280',
                            fontWeight: studentSubFilter === filter ? 600 : 500,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s',
                            marginBottom: '-2px',
                            position: 'relative'
                          }}
                        >
                          {labels[filter]} ({counts[filter]})
                          {showBadge && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '8px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                borderRadius: '10px',
                                minWidth: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                padding: '0 6px',
                                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                                animation: 'pulse 2s infinite'
                              }}
                            >
                              {pendingCount > 99 ? '99+' : pendingCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Loading...
                  </div>
                ) : sortedStudents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedStudents.map((student) => (
                      <div 
                        key={student.id} 
                        onClick={() => handleViewStudentDetail(student)}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{student.name}</h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{student.email}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: student.approvalStatus === 'approved' ? '#dcfce7' : student.approvalStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                                color: student.approvalStatus === 'approved' ? '#16a34a' : student.approvalStatus === 'pending' ? '#d97706' : '#dc2626',
                                fontWeight: 500
                              }}>
                                {student.approvalStatus.charAt(0).toUpperCase() + student.approvalStatus.slice(1)}
                              </span>
                              {(() => {
                                const matchStatus = studentMatchStatuses.get(student.id);
                                if (matchStatus === 'accepted') {
                                  return (
                                    <span style={{
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '9999px',
                                      backgroundColor: '#dcfce7',
                                      color: '#16a34a',
                                      fontWeight: 500
                                    }}>
                                      Matched
                                    </span>
                                  );
                                } else if (matchStatus === 'confirmed') {
                                  return (
                                    <span style={{
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '9999px',
                                      backgroundColor: '#fef3c7',
                                      color: '#d97706',
                                      fontWeight: 500
                                    }}>
                                      Awaiting Alumni
                                    </span>
                                  );
                                } else if (matchStatus === 'pending') {
                                  return (
                                    <span style={{
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '9999px',
                                      backgroundColor: '#fef3c7',
                                      color: '#d97706',
                                      fontWeight: 500
                                    }}>
                                      Pending Approval
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span style={{
                                      fontSize: '0.75rem',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '9999px',
                                      backgroundColor: '#f3f4f6',
                                      color: '#6b7280',
                                      fontWeight: 500
                                    }}>
                                      Not in Match
                                    </span>
                                  );
                                }
                              })()}
                              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                Registered: {new Date(student.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '0.95rem' }}>No students found</p>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Student Detail View */}
            {viewMode === 'studentDetail' && selectedStudent && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={handleBackToStudentsList}
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
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Student Details</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Basic Information */}
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Basic Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Name</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.name}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Student ID</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.studentId || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Contact Email</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.contactEmail || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.location || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GPA</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.gpa || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Approval Status</p>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: selectedStudent.approvalStatus === 'approved' ? '#dcfce7' : selectedStudent.approvalStatus === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: selectedStudent.approvalStatus === 'approved' ? '#16a34a' : selectedStudent.approvalStatus === 'pending' ? '#d97706' : '#dc2626',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>
                          {selectedStudent.approvalStatus.charAt(0).toUpperCase() + selectedStudent.approvalStatus.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Registered Date</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Academic Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Degree</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.degree || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Year of Study</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.yearOfStudy ? `Year ${selectedStudent.yearOfStudy}` : 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expected Graduation</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.expectedGraduation || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Academic Focus</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.academicFocus || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>About</h3>
                    <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {selectedStudent.about || 'Not provided'}
                    </p>
                  </div>

                  {/* Contact & Links */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Contact & Links</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Contact Email</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.contactEmail || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.location || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GPA</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.gpa || 'Not provided'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>LinkedIn</p>
                        {selectedStudent.linkedInUrl ? (
                          <a href={selectedStudent.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                            {selectedStudent.linkedInUrl}
                          </a>
                        ) : (
                          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GitHub</p>
                        {selectedStudent.githubUrl ? (
                          <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                            {selectedStudent.githubUrl}
                          </a>
                        ) : (
                          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Portfolio</p>
                        {selectedStudent.portfolioUrl ? (
                          <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                            {selectedStudent.portfolioUrl}
                          </a>
                        ) : (
                          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mentoring Goals */}
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Mentoring Goals</h3>
                    {selectedStudent.mentoringGoals && selectedStudent.mentoringGoals.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedStudent.mentoringGoals.map((goal, index) => (
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
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Skills Wanted</h3>
                    {selectedStudent.skillsWanted && selectedStudent.skillsWanted.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedStudent.skillsWanted.map((skill, index) => (
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
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Languages</h3>
                    {selectedStudent.languages && selectedStudent.languages.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedStudent.languages.map((lang, index) => (
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
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Interests</h3>
                    {selectedStudent.interests && selectedStudent.interests.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedStudent.interests.map((interest, index) => (
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
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Work Experience</h3>
                    {selectedStudent.workExperience && Array.isArray(selectedStudent.workExperience) && selectedStudent.workExperience.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedStudent.workExperience.map((exp: any, index: number) => (
                          <div 
                            key={index} 
                            onClick={() => setExpandedWorkExp(expandedWorkExp === index ? null : index)}
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
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Projects</h3>
                    {selectedStudent.projects && Array.isArray(selectedStudent.projects) && selectedStudent.projects.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedStudent.projects.map((project: any, index: number) => (
                          <div 
                            key={index} 
                            onClick={() => setExpandedProject(expandedProject === index ? null : index)}
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
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Certifications</h3>
                    {selectedStudent.certifications && Array.isArray(selectedStudent.certifications) && selectedStudent.certifications.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedStudent.certifications.map((cert: any, index: number) => (
                          <div 
                            key={index} 
                            onClick={() => setExpandedCertification(expandedCertification === index ? null : index)}
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

                  {/* CV Status */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>CV Status</h3>
                    {selectedStudent.cvFileName ? (
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>CV File</p>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>{selectedStudent.cvFileName}</p>
                          <button
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('auth_token');
                                if (!token) {
                                  alert('Please log in to view CV');
                                  return;
                                }
                                const url = `${API_BASE_URL}${API_ENDPOINTS.adminDownloadStudentCV(selectedStudent.id)}`;
                                const response = await fetch(url, {
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                  },
                                });
                                
                                if (!response.ok) {
                                  const errorText = await response.text();
                                  let errorMessage = 'Failed to fetch CV';
                                  try {
                                    const errorData = JSON.parse(errorText);
                                    errorMessage = errorData.error || errorMessage;
                                  } catch {
                                    errorMessage = `HTTP ${response.status}: ${errorText}`;
                                  }
                                  throw new Error(errorMessage);
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
                              backgroundColor: '#dc2626',
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
                            <span>View</span>
                          </button>
                        </div>
                        {selectedStudent.cvUploadedAt && (
                          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                            Uploaded: {new Date(selectedStudent.cvUploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>No CV uploaded</p>
                    )}
                  </div>

                  {/* Approval Actions (if pending) */}
                  {selectedStudent.approvalStatus === 'pending' && (
                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <button
                        onClick={() => handleReject(selectedStudent.id, 'student')}
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
                          fontWeight: 500
                        }}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(selectedStudent.id, 'student')}
                        style={{
                          backgroundColor: '#16a34a',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* All Alumni List */}
            {viewMode === 'alumni' && (() => {
              // Get alumni match statuses - priority: accepted > confirmed
              const alumniMatchStatuses = new Map<number, 'accepted' | 'confirmed'>();
              
              allMatches.forEach(match => {
                const alumniId = match.alumni.id;
                const currentStatus = alumniMatchStatuses.get(alumniId);
                
                // Priority: accepted > confirmed
                if (match.status === 'accepted') {
                  alumniMatchStatuses.set(alumniId, 'accepted');
                } else if (match.status === 'confirmed' && currentStatus !== 'accepted') {
                  alumniMatchStatuses.set(alumniId, 'confirmed');
                }
              });

              // Filter alumni by sub-filter
              const matchedAlumniIds = new Set(
                allMatches.filter(m => m.status === 'accepted').map(m => m.alumni.id)
              );
              const filteredAlumni = allAlumni.filter(a => {
                if (alumniSubFilter === 'all') return true;
                if (alumniSubFilter === 'matched' && !matchedAlumniIds.has(a.id)) return false;
                if (alumniSubFilter === 'awaitingResponse' && alumniMatchStatuses.get(a.id) !== 'confirmed') return false;
                if (alumniSubFilter === 'unmatched' && alumniMatchStatuses.has(a.id)) return false;
                return true;
              });

              // Sort alumni by name (A-Z)
              const sortedAlumni = [...filteredAlumni].sort((a, b) => {
                return a.name.localeCompare(b.name);
              });

              return (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={handleBackToOverview}
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
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Alumni Management</h2>
                  </div>
                  
                  {/* Category Tabs */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
                    {(['all', 'matched', 'awaitingResponse', 'unmatched'] as const).map((filter) => {
                      const labels: Record<typeof filter, string> = {
                        all: 'All Alumni',
                        matched: 'In Matches',
                        awaitingResponse: 'Awaiting Response',
                        unmatched: 'No Matches'
                      };
                      const matchedAlumniIds = new Set(
                        allMatches.filter(m => m.status === 'accepted').map(m => m.alumni.id)
                      );
                      const counts: Record<typeof filter, number> = {
                        all: allAlumni.length,
                        matched: allAlumni.filter(a => matchedAlumniIds.has(a.id)).length,
                        awaitingResponse: allAlumni.filter(a => alumniMatchStatuses.get(a.id) === 'confirmed').length,
                        unmatched: allAlumni.filter(a => !alumniMatchStatuses.has(a.id)).length
                      };
                      return (
                        <button
                          key={filter}
                          onClick={() => setAlumniSubFilter(filter)}
                          style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderBottom: alumniSubFilter === filter ? '3px solid #C8102E' : '3px solid transparent',
                            backgroundColor: 'transparent',
                            color: alumniSubFilter === filter ? '#C8102E' : '#6b7280',
                            fontWeight: alumniSubFilter === filter ? 600 : 500,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s',
                            marginBottom: '-2px'
                          }}
                        >
                          {labels[filter]} ({counts[filter]})
                        </button>
                      );
                    })}
                  </div>
                  
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Loading...
                  </div>
                ) : sortedAlumni.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedAlumni.map((alumni) => {
                      const matchStatus = alumniMatchStatuses.get(alumni.id);
                      return (
                        <div 
                          key={alumni.id} 
                          onClick={() => handleViewAlumniDetail(alumni)}
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{alumni.name}</h3>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{alumni.email}</p>
                              {alumni.currentCompany && (
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                  {alumni.currentPosition ? `${alumni.currentPosition} at ` : ''}{alumni.currentCompany}
                                </p>
                              )}
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                {(() => {
                                  if (matchStatus === 'accepted') {
                                    return (
                                      <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        backgroundColor: '#dcfce7',
                                        color: '#16a34a',
                                        fontWeight: 500
                                      }}>
                                        Matched
                                      </span>
                                    );
                                  } else if (matchStatus === 'confirmed') {
                                    return (
                                      <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        backgroundColor: '#fef3c7',
                                        color: '#d97706',
                                        fontWeight: 500
                                      }}>
                                        Awaiting Response
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        backgroundColor: '#f3f4f6',
                                        color: '#6b7280',
                                        fontWeight: 500
                                      }}>
                                        Not in Match
                                      </span>
                                    );
                                  }
                                })()}
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                  Registered: {new Date(alumni.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '0.95rem' }}>No alumni found</p>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Alumni Detail View */}
            {viewMode === 'alumniDetail' && selectedAlumni && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={handleBackToAlumniList}
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
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Alumni Details</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Basic Information */}
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Basic Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Name</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.name}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.email}</p>
                      </div>
                      {selectedAlumni.graduationYear && (
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Graduation Year</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.graduationYear}</p>
                        </div>
                      )}
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Registered Date</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{new Date(selectedAlumni.createdAt).toLocaleDateString()}</p>
                      </div>
                      {(() => {
                        // Get match status for this alumni
                        const alumniMatches = allMatches.filter(m => m.alumni.id === selectedAlumni.id);
                        const hasAccepted = alumniMatches.some(m => m.status === 'accepted');
                        const hasConfirmed = alumniMatches.some(m => m.status === 'confirmed');
                        
                        let matchStatus: 'accepted' | 'confirmed' | null = null;
                        if (hasAccepted) {
                          matchStatus = 'accepted';
                        } else if (hasConfirmed) {
                          matchStatus = 'confirmed';
                        }
                        
                        return (
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Match Status</p>
                            {matchStatus === 'accepted' ? (
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: '#dcfce7',
                                color: '#16a34a',
                                fontWeight: 500,
                                display: 'inline-block'
                              }}>
                                Matched
                              </span>
                            ) : matchStatus === 'confirmed' ? (
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                fontWeight: 500,
                                display: 'inline-block'
                              }}>
                                Awaiting Response
                              </span>
                            ) : (
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: '#f3f4f6',
                                color: '#6b7280',
                                fontWeight: 500,
                                display: 'inline-block'
                              }}>
                                Not in Match
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Professional Information */}
                  {(selectedAlumni.currentCompany || selectedAlumni.currentPosition) && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Professional Information</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {selectedAlumni.currentCompany && (
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Current Company</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.currentCompany}</p>
                          </div>
                        )}
                        {selectedAlumni.currentPosition && (
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Current Position</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.currentPosition}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mentoring Goals */}
                  {selectedAlumni.mentoringGoals && selectedAlumni.mentoringGoals.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Mentoring Goals</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedAlumni.mentoringGoals.map((goal, index) => (
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

                  {/* Skills Offered */}
                  {selectedAlumni.skillsOffered && selectedAlumni.skillsOffered.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Skills Offered</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedAlumni.skillsOffered.map((skill, index) => (
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
                </div>
              </div>
            )}

            {/* Pending Students List */}
            {viewMode === 'pending' && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={handleBackToStats}
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
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pending Student Approvals ({pendingStudents.length})</h2>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Loading...
                  </div>
                ) : pendingStudents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {pendingStudents.map((student) => (
                      <div 
                        key={student.id} 
                        onClick={() => handleViewPendingStudentDetail(student)}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{student.name}</h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{student.email}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                fontWeight: 500
                              }}>
                                Pending
                              </span>
                              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                Registered: {new Date(student.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '0.95rem' }}>No pending students found</p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Student Detail View */}
            {viewMode === 'pendingDetail' && selectedStudent && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={handleBackToPendingList}
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
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pending Student Details</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Basic Information */}
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Basic Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Name</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.name}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.email}</p>
                      </div>
                      {selectedStudent.studentId && (
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Student ID</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.studentId}</p>
                        </div>
                      )}
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Approval Status</p>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: '#fef3c7',
                          color: '#d97706',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>
                          Pending
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Registered Date</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  {(selectedStudent.degree || selectedStudent.yearOfStudy || selectedStudent.expectedGraduation || selectedStudent.academicFocus) && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Academic Information</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {selectedStudent.degree && (
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Degree</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.degree}</p>
                          </div>
                        )}
                        {selectedStudent.yearOfStudy && (
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Year of Study</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Year {selectedStudent.yearOfStudy}</p>
                          </div>
                        )}
                        {selectedStudent.expectedGraduation && (
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expected Graduation</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.expectedGraduation}</p>
                          </div>
                        )}
                        {selectedStudent.academicFocus && (
                          <div>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Academic Focus</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.academicFocus}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Approval Actions */}
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <button
                      onClick={() => handleReject(selectedStudent.id, 'student')}
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
                        fontWeight: 500
                      }}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleApprove(selectedStudent.id, 'student');
                      }}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* All Matches List */}
            {viewMode === 'matches' && (() => {
              const filteredMatches = matchSubFilter === 'all'
                ? allMatches
                : matchSubFilter === 'active'
                ? allMatches.filter(m => m.status === 'accepted')
                : matchSubFilter === 'completed'
                ? allMatches.filter(m => m.status === 'completed' || m.status === 'ended')
                : matchSubFilter === 'pending'
                ? allMatches.filter(m => m.status === 'pending')
                : matchSubFilter === 'awaitingAlumni'
                ? allMatches.filter(m => m.status === 'confirmed')
                : allMatches;
              
              return (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={handleBackToOverview}
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
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Matches Management</h2>
                  </div>
                </div>
                
                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
                  {(['all', 'active', 'pending', 'awaitingAlumni', 'completed'] as const).map((filter) => {
                    const labels: Record<typeof filter, string> = {
                      all: 'All Matches',
                      active: 'Active',
                      pending: 'Pending Approval',
                      awaitingAlumni: 'Awaiting Alumni',
                      completed: 'Completed'
                    };
                    const counts: Record<typeof filter, number> = {
                      all: allMatches.length,
                      active: allMatches.filter(m => m.status === 'accepted').length,
                      pending: allMatches.filter(m => m.status === 'pending').length,
                      awaitingAlumni: allMatches.filter(m => m.status === 'confirmed').length,
                      completed: allMatches.filter(m => m.status === 'completed' || m.status === 'ended').length
                    };
                    const pendingCount = counts.pending;
                    const showBadge = filter === 'pending' && pendingCount > 0;
                    return (
                      <button
                        key={filter}
                        onClick={() => setMatchSubFilter(filter)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          border: 'none',
                          borderBottom: matchSubFilter === filter ? '3px solid #C8102E' : '3px solid transparent',
                          backgroundColor: 'transparent',
                          color: matchSubFilter === filter ? '#C8102E' : '#6b7280',
                          fontWeight: matchSubFilter === filter ? 600 : 500,
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                          marginBottom: '-2px',
                          position: 'relative'
                        }}
                      >
                        {labels[filter]} ({counts[filter]})
                        {showBadge && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '-4px',
                              right: '8px',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              borderRadius: '9999px',
                              padding: '0.1rem 0.4rem',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              minWidth: '20px',
                              textAlign: 'center',
                              animation: 'pulse 2s infinite',
                              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                            }}
                          >
                            {pendingCount > 99 ? '99+' : pendingCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Loading...
                  </div>
                ) : filteredMatches.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredMatches.map((match) => (
                      <div 
                        key={match.id} 
                        onClick={() => handleViewMatchDetail(match)}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '0.5rem', alignItems: 'start' }}>
                              <div style={{ minWidth: 0, width: '100%' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', height: '1rem' }}>Student</p>
                                <p style={{ fontWeight: 600, marginBottom: '0.25rem', wordBreak: 'break-word', minHeight: '1.5rem' }}>{match.student.name}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', wordBreak: 'break-all', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{match.student.email}</p>
                              </div>
                              <div style={{ minWidth: 0, width: '100%' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', height: '1rem' }}>Alumni Mentor</p>
                                <p style={{ fontWeight: 600, marginBottom: '0.25rem', wordBreak: 'break-word', minHeight: '1.5rem' }}>{match.alumni.name}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', wordBreak: 'break-all', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{match.alumni.email}</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: match.status === 'confirmed' ? '#dcfce7' : match.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                color: match.status === 'confirmed' ? '#16a34a' : match.status === 'pending' ? '#d97706' : '#dc2626',
                                fontWeight: 500
                              }}>
                                {match.status === 'confirmed' ? 'Awaiting Alumni' : match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </span>
                              {match.matchScore && (
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                  Score: {match.matchScore.toFixed(1)}%
                                </span>
                              )}
                              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                Created: {new Date(match.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                    <p style={{ fontSize: '0.95rem' }}>No matches found</p>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Match Detail View */}
            {viewMode === 'matchDetail' && selectedMatch && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button
                    onClick={handleBackToMatchesList}
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
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Match Details</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Match Information */}
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Match Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</p>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: selectedMatch.status === 'confirmed' ? '#dcfce7' : selectedMatch.status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: selectedMatch.status === 'confirmed' ? '#16a34a' : selectedMatch.status === 'pending' ? '#d97706' : '#dc2626',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>
                          {selectedMatch.status === 'confirmed' ? 'Awaiting Alumni' : selectedMatch.status.charAt(0).toUpperCase() + selectedMatch.status.slice(1)}
                        </span>
                      </div>
                      {selectedMatch.matchScore && (
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Match Score</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMatch.matchScore.toFixed(1)}%</p>
                        </div>
                      )}
                      {selectedMatch.confirmedAt && (
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Confirmed At</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{new Date(selectedMatch.confirmedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Created At</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{new Date(selectedMatch.createdAt).toLocaleDateString()}</p>
                      </div>
                      {selectedMatch.confirmedBy && (
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Confirmed By</p>
                          <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedMatch.confirmedBy.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {selectedMatch.matchReasons && selectedMatch.matchReasons.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Match Reasons</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {selectedMatch.matchReasons.map((reason, index) => (
                          <p key={index} style={{ fontSize: '0.95rem', color: '#374151', paddingLeft: '1rem' }}>
                            • {reason}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Three Card Sections */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {/* Student Card */}
                    <div
                      onClick={async () => {
                        // Try to get full student data from allStudents list
                        let student = allStudents.find(s => s.id === selectedMatch.student.id);
                        if (!student) {
                          // If not found, fetch from API
                          try {
                            const response = await apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents);
                            student = response.students.find(s => s.id === selectedMatch.student.id);
                          } catch (err) {
                            console.error('Error fetching student:', err);
                          }
                        }
                        if (student) {
                          setSelectedStudent(student);
                          setShowStudentModal(true);
                        }
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C8102E';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GraduationCap size={24} color="#16a34a" />
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Student</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{selectedMatch.student.name}</p>
                        {(selectedMatch.student.degree || selectedMatch.student.academicFocus) && (
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {selectedMatch.student.degree || selectedMatch.student.academicFocus}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Alumni Card */}
                    <div
                      onClick={async () => {
                        const alumni = allAlumni.find(a => a.id === selectedMatch.alumni.id);
                        if (alumni) {
                          setSelectedAlumni(alumni);
                          setShowAlumniModal(true);
                        } else {
                          // Fetch full alumni data if not in list
                          try {
                            const response = await apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni);
                            const fullAlumni = response.mentors.find(a => a.id === selectedMatch.alumni.id);
                            if (fullAlumni) {
                              setSelectedAlumni(fullAlumni);
                              setShowAlumniModal(true);
                            }
                          } catch (err) {
                            console.error('Error fetching alumni:', err);
                          }
                        }
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C8102E';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={24} color="#2563eb" />
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Alumni</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{selectedMatch.alumni.name}</p>
                        {selectedMatch.alumni.currentPosition && (
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedMatch.alumni.currentPosition}</p>
                        )}
                        {selectedMatch.alumni.currentCompany && (
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedMatch.alumni.currentCompany}</p>
                        )}
                      </div>
                    </div>

                    {/* Cover Letter Card */}
                    <div
                      onClick={() => {
                        if (selectedMatch.coverLetter) {
                          setShowCoverLetterModal(true);
                        }
                      }}
                      style={{
                        backgroundColor: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        cursor: selectedMatch.coverLetter ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        opacity: selectedMatch.coverLetter ? 1 : 0.6
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMatch.coverLetter) {
                          e.currentTarget.style.borderColor = '#C8102E';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={24} color="#d97706" />
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Cover Letter</h3>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {selectedMatch.coverLetter ? 'Click to view cover letter' : 'No cover letter provided'}
                      </p>
                    </div>
                  </div>

                  {/* Approval Actions (if pending) */}
                  {selectedMatch.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                      <button
                        onClick={() => {
                          setRejectionReason('');
                          setShowRejectModal(true);
                        }}
                        disabled={processingMatch === selectedMatch.id}
                        style={{
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          cursor: processingMatch === selectedMatch.id ? 'not-allowed' : 'pointer',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          opacity: processingMatch === selectedMatch.id ? 0.6 : 1
                        }}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveMatch(selectedMatch.id)}
                        disabled={processingMatch === selectedMatch.id}
                        style={{
                          backgroundColor: processingMatch === selectedMatch.id ? '#9ca3af' : '#16a34a',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          cursor: processingMatch === selectedMatch.id ? 'not-allowed' : 'pointer',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        {processingMatch === selectedMatch.id ? (
                          <>
                            <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} />
                            Approve
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </main>

      {/* Reject Match Modal */}
      {showRejectModal && selectedMatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              Reject Match Request
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              Please provide a reason for rejecting this match request. This message will be sent to the student via email.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#374151' }}>
                Rejection Reason <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejecting this match request..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
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

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={processingMatch === selectedMatch.id}
                style={{
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: processingMatch === selectedMatch.id ? 'not-allowed' : 'pointer',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: processingMatch === selectedMatch.id ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectMatch(selectedMatch.id)}
                disabled={processingMatch === selectedMatch.id || !rejectionReason.trim()}
                style={{
                  backgroundColor: processingMatch === selectedMatch.id || !rejectionReason.trim() ? '#9ca3af' : '#dc2626',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: processingMatch === selectedMatch.id || !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {processingMatch === selectedMatch.id ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    Reject Match
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invitation Code Modal */}
      {showInvitationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              Generate New Invitation Code
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              Creating a new invitation code will automatically deactivate all previous codes. Only one code can be active at a time.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#374151' }}>
                Invitation Code <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={newInvitationCode}
                onChange={(e) => setNewInvitationCode(e.target.value)}
                placeholder="Enter invitation code (e.g., ALUMNI-2025)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowInvitationModal(false);
                  setNewInvitationCode('');
                }}
                disabled={creatingInvitationCode}
                style={{
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: creatingInvitationCode ? 'not-allowed' : 'pointer',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: creatingInvitationCode ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvitationCode}
                disabled={creatingInvitationCode || !newInvitationCode.trim()}
                style={{
                  backgroundColor: creatingInvitationCode || !newInvitationCode.trim() ? '#9ca3af' : '#C8102E',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: creatingInvitationCode || !newInvitationCode.trim() ? 'not-allowed' : 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {creatingInvitationCode ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Create Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {showStudentModal && selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowStudentModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Student Profile</h3>
              <button
                onClick={() => setShowStudentModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <XCircle size={20} color="#6b7280" />
              </button>
            </div>
            
            {/* Student Detail Content - Full Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Basic Information */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Basic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Name</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.email}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Contact Email</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.contactEmail || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Student ID</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.studentId || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.location || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GPA</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.gpa || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Academic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Degree</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.degree || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Year of Study</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.yearOfStudy ? `Year ${selectedStudent.yearOfStudy}` : 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expected Graduation</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.expectedGraduation || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Academic Focus</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.academicFocus || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>About</h4>
                <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedStudent.about || 'Not provided'}
                </p>
              </div>

              {/* Contact & Links */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Contact & Links</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Contact Email</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.contactEmail || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.location || 'Not provided'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GPA</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedStudent.gpa || 'Not provided'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>LinkedIn</p>
                    {selectedStudent.linkedInUrl ? (
                      <a href={selectedStudent.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                        {selectedStudent.linkedInUrl}
                      </a>
                    ) : (
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>GitHub</p>
                    {selectedStudent.githubUrl ? (
                      <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                        {selectedStudent.githubUrl}
                      </a>
                    ) : (
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Portfolio</p>
                    {selectedStudent.portfolioUrl ? (
                      <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                        {selectedStudent.portfolioUrl}
                      </a>
                    ) : (
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#9ca3af' }}>Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mentoring Goals */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Mentoring Goals</h4>
                {selectedStudent.mentoringGoals && selectedStudent.mentoringGoals.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedStudent.mentoringGoals.map((goal, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {goal}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                )}
              </div>

              {/* Skills Wanted */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Skills Wanted</h4>
                {selectedStudent.skillsWanted && selectedStudent.skillsWanted.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedStudent.skillsWanted.map((skill, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                )}
              </div>

              {/* Languages */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Languages</h4>
                {selectedStudent.languages && selectedStudent.languages.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedStudent.languages.map((lang, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                )}
              </div>

              {/* Interests */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Interests</h4>
                {selectedStudent.interests && selectedStudent.interests.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedStudent.interests.map((interest, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.95rem', color: '#9ca3af' }}>Not provided</p>
                )}
              </div>

              {/* Work Experience */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Work Experience</h4>
                {selectedStudent.workExperience && Array.isArray(selectedStudent.workExperience) && selectedStudent.workExperience.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedStudent.workExperience.map((exp: any, index: number) => (
                      <div 
                        key={index} 
                        onClick={() => setExpandedWorkExp(expandedWorkExp === index ? null : index)}
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
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Projects</h4>
                {selectedStudent.projects && Array.isArray(selectedStudent.projects) && selectedStudent.projects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedStudent.projects.map((project: any, index: number) => (
                      <div 
                        key={index} 
                        onClick={() => setExpandedProject(expandedProject === index ? null : index)}
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
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>Certifications</h4>
                {selectedStudent.certifications && Array.isArray(selectedStudent.certifications) && selectedStudent.certifications.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedStudent.certifications.map((cert: any, index: number) => (
                      <div 
                        key={index} 
                        onClick={() => setExpandedCertification(expandedCertification === index ? null : index)}
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

              {/* CV Status */}
              {selectedStudent.cvFileName && (
                <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>CV</h4>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>{selectedStudent.cvFileName}</p>
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('auth_token');
                          if (!token) {
                            alert('Please log in to view CV');
                            return;
                          }
                          const url = `${API_BASE_URL}${API_ENDPOINTS.adminDownloadStudentCV(selectedStudent.id)}`;
                          const response = await fetch(url, {
                            headers: {
                              'Authorization': `Bearer ${token}`,
                            },
                          });
                          
                          if (!response.ok) {
                            const errorText = await response.text();
                            let errorMessage = 'Failed to fetch CV';
                            try {
                              const errorData = JSON.parse(errorText);
                              errorMessage = errorData.error || errorMessage;
                            } catch {
                              errorMessage = `HTTP ${response.status}: ${errorText}`;
                            }
                            throw new Error(errorMessage);
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
                        backgroundColor: '#dc2626',
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
                      <span>View</span>
                    </button>
                  </div>
                  {selectedStudent.cvUploadedAt && (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Uploaded: {new Date(selectedStudent.cvUploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alumni Profile Modal */}
      {showAlumniModal && selectedAlumni && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowAlumniModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Alumni Profile</h3>
              <button
                onClick={() => setShowAlumniModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <XCircle size={20} color="#6b7280" />
              </button>
            </div>
            
            {/* Alumni Detail Content - Full Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Basic Information */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Basic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Name</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.email}</p>
                  </div>
                  {selectedAlumni.graduationYear && (
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Graduation Year</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.graduationYear}</p>
                    </div>
                  )}
                  {selectedAlumni.location && (
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              {(selectedAlumni.currentCompany || selectedAlumni.currentPosition) && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Professional Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {selectedAlumni.currentCompany && (
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Current Company</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.currentCompany}</p>
                      </div>
                    )}
                    {selectedAlumni.currentPosition && (
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Current Position</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{selectedAlumni.currentPosition}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* About */}
              {selectedAlumni.about && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>About</h4>
                  <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedAlumni.about}</p>
                </div>
              )}

              {/* Links */}
              {(selectedAlumni.linkedInUrl || selectedAlumni.githubUrl || selectedAlumni.portfolioUrl) && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Links</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedAlumni.linkedInUrl && (
                      <a href={selectedAlumni.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                        LinkedIn
                      </a>
                    )}
                    {selectedAlumni.githubUrl && (
                      <a href={selectedAlumni.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                        GitHub
                      </a>
                    )}
                    {selectedAlumni.portfolioUrl && (
                      <a href={selectedAlumni.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'underline' }}>
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Mentoring Goals */}
              {selectedAlumni.mentoringGoals && selectedAlumni.mentoringGoals.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Mentoring Goals</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedAlumni.mentoringGoals.map((goal, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Offered */}
              {selectedAlumni.skillsOffered && selectedAlumni.skillsOffered.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Skills Offered</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedAlumni.skillsOffered.map((skill, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {selectedAlumni.languages && selectedAlumni.languages.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Languages</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedAlumni.languages.map((lang, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {selectedAlumni.interests && selectedAlumni.interests.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Interests</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedAlumni.interests.map((interest, index) => (
                      <span key={index} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f3f4f6', borderRadius: '9999px', fontSize: '0.875rem', color: '#374151' }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {selectedAlumni.workExperience && Array.isArray(selectedAlumni.workExperience) && selectedAlumni.workExperience.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Work Experience</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedAlumni.workExperience.map((exp: any, index: number) => (
                      <div key={index} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{exp.title} at {exp.company}</p>
                        {exp.location && <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{exp.location}</p>}
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        {exp.description && <p style={{ fontSize: '0.875rem', color: '#374151', whiteSpace: 'pre-wrap' }}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {selectedAlumni.projects && Array.isArray(selectedAlumni.projects) && selectedAlumni.projects.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Projects</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedAlumni.projects.map((project: any, index: number) => (
                      <div key={index} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{project.name}</p>
                        {project.description && <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>{project.description}</p>}
                        {project.technologies && project.technologies.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {project.technologies.map((tech: string, techIndex: number) => (
                              <span key={techIndex} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', fontSize: '0.75rem', color: '#374151' }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'underline' }}>
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {selectedAlumni.certifications && Array.isArray(selectedAlumni.certifications) && selectedAlumni.certifications.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Certifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedAlumni.certifications.map((cert: any, index: number) => (
                      <div key={index} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cert.name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{cert.issuer}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Issued: {cert.issueDate}</p>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'underline', marginTop: '0.25rem', display: 'block' }}>
                            View Credential
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cover Letter Modal */}
      {showCoverLetterModal && selectedMatch && selectedMatch.coverLetter && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowCoverLetterModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Cover Letter</h3>
              <button
                onClick={() => setShowCoverLetterModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <XCircle size={20} color="#6b7280" />
              </button>
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              whiteSpace: 'pre-wrap',
              fontSize: '0.95rem',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {selectedMatch.coverLetter}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
