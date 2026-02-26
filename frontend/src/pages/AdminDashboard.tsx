import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest, API_BASE_URL } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { 
  GraduationCap, Award, CheckCircle, XCircle, LogOut,
  Target, FileText, ArrowLeft, Key, Copy, Plus, ChevronDown, AlertCircle, UserCircle,
  Eye, EyeOff
} from 'lucide-react';
import ProfilePhotoUploader from '../components/ProfilePhotoUploader';

const waikatoLogo = '/waikato-logo.png';

interface Student {
  id: number;
  name: string;
  email: string;
  role?: string;
  approvalStatus: string;
  createdAt: string;
  isActive?: boolean;
  about?: string | null;
  studentId?: string;
  degree?: string;
  yearOfStudy?: number;
  expectedGraduation?: string;
  academicFocus?: string;
  gpa?: number | string;
  contactEmail?: string;
  location?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
   mentoringGoals?: string[];
  skillsWanted?: string[];
  skillsOffered?: string[];
  languages?: string[];
  interests?: string[];
  workExperience?: any;
  projects?: any;
  certifications?: any;
  profilePhotoFilePath?: string | null;
  resumeFilePath?: string | null;
  coverLetterFilePath?: string | null;
  cvFileName?: string | null;
  cvUploadedAt?: string | Date | null;
  phoneNumber?: string;
  tags?: string[];
}

interface Alumni {
  id: number;
  name: string;
  email: string;
  role?: string;
  approvalStatus: string;
  createdAt: string;
  isActive?: boolean;
  about?: string | null;
  graduationYear?: number;
  currentCompany?: string;
  currentPosition?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  mentoringGoals?: string[];
  skillsWanted?: string[];
  skillsOffered?: string[];
  expertiseAreas?: string[];
  languages?: string[];
  interests?: string[];
  location?: string;
  profilePhotoFilePath?: string | null;
  workExperience?: any;
  projects?: any;
  certifications?: any;
  cvFileName?: string | null;
  cvUploadedAt?: string | Date | null;
}

type PendingUser = Student & Partial<Alumni>;

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
    profilePhotoFilePath?: string | null;
  };
  alumni: {
    id: number;
    name: string;
    email: string;
    graduationYear?: number;
    currentCompany?: string;
    currentPosition?: string;
    profilePhotoFilePath?: string | null;
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

interface AdminInviteSummary {
  email: string;
  expiresAt: string;
  createdAt: string;
}

/**
 * Reusable Avatar Component - displays 24-32px circular avatar with image or initials
 */
interface AvatarProps {
  name: string;
  photoPath?: string | null;
  size?: number; // in pixels, default 28
}

function Avatar({ name, photoPath, size = 28 }: AvatarProps) {
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getInitialBgColor = (fullName: string): string => {
    // Deterministic color based on name hash
    const hash = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-green-400', 'bg-indigo-400', 'bg-teal-400'];
    return colors[hash % colors.length];
  };

  const initials = getInitials(name);
  const bgColor = getInitialBgColor(name);

  return (
    <div
      className={`flex-shrink-0 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      {photoPath ? (
        <img
          src={API_BASE_URL + photoPath}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show initials instead
            const container = e.currentTarget.parentElement;
            if (container) {
              container.innerHTML = `<div class="${bgColor} w-full h-full flex items-center justify-center"><span class="text-white font-semibold text-xs" style="font-size: ${Math.max(size / 2.5, 8)}px">${initials}</span></div>`;
            }
          }}
        />
      ) : (
        <div className={`${bgColor} w-full h-full flex items-center justify-center`}>
          <span className="text-white font-semibold" style={{ fontSize: Math.max(size / 2.5, 8) }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userState, setUserState] = useState(user);
  const effectiveUser = userState || user;
  const normalizedApiBaseUrl = API_BASE_URL.replace(/\/$/, "");
  const currentUserId = effectiveUser?.id ?? null;

  const initialViewMode: 'overview' | 'students' | 'studentDetail' | 'alumni' | 'alumniDetail' | 'matches' | 'matchDetail' | 'pending' | 'pendingDetail' | 'admins' =
    (searchParams.get('view') as 'overview' | 'students' | 'studentDetail' | 'alumni' | 'alumniDetail' | 'matches' | 'matchDetail' | 'pending' | 'pendingDetail' | 'admins') || 'overview';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalAlumni: 0,
    pendingStudents: 0,
    totalMatches: 0,
  });
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [pendingMatchesCount, setPendingMatchesCount] = useState<number>(0);
  const [activeMatchesCount, setActiveMatchesCount] = useState<number>(0); // Unique alumni in active matches (for Alumni card)
  const [activeMatchesNumber, setActiveMatchesNumber] = useState<number>(0); // Total active matches count (for Matches card)
  const [awaitingAlumniCount, setAwaitingAlumniCount] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'overview' | 'students' | 'studentDetail' | 'alumni' | 'alumniDetail' | 'matches' | 'matchDetail' | 'pending' | 'pendingDetail' | 'admins'>(initialViewMode);
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
  const [newAdminInvitationCode, setNewAdminInvitationCode] = useState('');
  const [showAdminInvitationModal, setShowAdminInvitationModal] = useState(false);
  const [creatingAdminInvitationCode, setCreatingAdminInvitationCode] = useState(false);
  const [alumniInviteExpanded, setAlumniInviteExpanded] = useState(false);
  const [adminInvitesExpanded, setAdminInvitesExpanded] = useState(false);
  const [newAdminInviteEmail, setNewAdminInviteEmail] = useState('');
  const [verificationCodes, setVerificationCodes] = useState<Array<{ id: number; email: string; code: string; purpose: string; expiresAt: string; usedAt: string | null; createdAt: string; status: 'active' | 'expired' | 'used' }>>([]);
  const [verificationCodesExpanded, setVerificationCodesExpanded] = useState(false);
  const [showVerificationCodes, setShowVerificationCodes] = useState(false);
  const [passwordResetRequests, setPasswordResetRequests] = useState<Array<{ id: number; email: string; code: string; createdAt: string; expiresAt: string }>>([]);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
  const [passwordResetExpanded, setPasswordResetExpanded] = useState(false);
  const [creatingAdminInvite, setCreatingAdminInvite] = useState(false);
  const [lastAdminInviteCode, setLastAdminInviteCode] = useState<string | null>(null);
  const [lastAdminInviteExpiresAt, setLastAdminInviteExpiresAt] = useState<string | null>(null);
  const [lastAdminInviteEmail, setLastAdminInviteEmail] = useState<string | null>(null);
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const [selectedStudentForMatch, setSelectedStudentForMatch] = useState<Student | null>(null);
  const [selectedAlumniForMatch, setSelectedAlumniForMatch] = useState<Alumni | null>(null);
  const [matchCoverLetter, setMatchCoverLetter] = useState('');
  const [creatingMatch, setCreatingMatch] = useState(false);
  const [matchStudents, setMatchStudents] = useState<Array<{ id: number; name: string; email: string; studentId?: string }>>([]);
  const [matchAlumni, setMatchAlumni] = useState<Array<{ id: number; name: string; email: string; degree?: string }>>([]);
  const [isLoadingMatchOptions, setIsLoadingMatchOptions] = useState(false);
  const [matchOptionsError, setMatchOptionsError] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Profile photo upload state
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(null);
  const [profilePhotoVersion, setProfilePhotoVersion] = useState(0);

  // Admin management state
  const [admins, setAdmins] = useState<Array<{ id: number; name: string; email: string; isActive: boolean; passwordUpdatedAt: string | null; createdAt: string; profilePhotoFilePath?: string | null }>>([]);
  const [processingAdminId, setProcessingAdminId] = useState<number | null>(null);

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

  // Collapse all sections when returning to overview
  useEffect(() => {
    if (viewMode === 'overview') {
      setAlumniInviteExpanded(false);
      setAdminInvitesExpanded(false);
      setVerificationCodesExpanded(false);
    }
  }, [viewMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine what data to load based on current viewMode
        const shouldLoadStudents = viewMode === 'students' || viewMode === 'studentDetail';
        const shouldLoadAlumni = viewMode === 'alumni' || viewMode === 'alumniDetail';
        const shouldLoadAdmins = viewMode === 'admins';
        // Load matches for students/alumni views too, as we need match status for displaying student/alumni status
        const shouldLoadMatches = viewMode === 'matches' || viewMode === 'matchDetail' || viewMode === 'overview' || viewMode === 'students' || viewMode === 'studentDetail' || viewMode === 'alumni' || viewMode === 'alumniDetail';

        const [statsResponse, studentsResponse, alumniResponse, matchesResponse, invitationCodeResponse, _adminInvitationCodeResponse, verificationCodesResponse, adminsResponse] = await Promise.allSettled([
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
          apiRequest<{ code: string | null }>(API_ENDPOINTS.adminGetInvitationCode).catch(() => ({ code: null })),
          apiRequest<{ code: string | null }>(API_ENDPOINTS.adminGetAdminInvitationCode).catch(() => ({ code: null })),
          apiRequest<{ codes: Array<{ id: number; email: string; code: string; purpose: string; expiresAt: string; usedAt: string | null; createdAt: string; status: 'active' | 'expired' | 'used' }> }>(API_ENDPOINTS.adminVerificationCodes).catch(() => ({ codes: [] })),
          
          shouldLoadAdmins
            ? apiRequest<{ admins: Array<{ id: number; name: string; email: string; isActive: boolean; passwordUpdatedAt: string | null; createdAt: string; profilePhotoFilePath?: string | null }> }>(API_ENDPOINTS.adminListAdmins).catch(() => ({ admins: [] }))
            : Promise.resolve({ admins: [] })
        ]);

        if (statsResponse.status === 'fulfilled') {
          setStats(statsResponse.value);
        } else {
          const error = statsResponse.reason;
          if (error instanceof Error && (error.message.includes('expired') || error.message.includes('Unauthorized'))) {
            // Token expired, will be handled by apiRequest
            return;
          }
          // If statistics API fails, it's critical - show the error
          const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard statistics';
          console.error('Failed to load statistics:', error);
          setError(errorMessage);
          // Don't continue loading if critical statistics are missing
          setLoading(false);
          return;
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
          }
        } else {
          if (shouldLoadAlumni) {
            setAllAlumni([]);
          }
        }

        if (matchesResponse.status === 'fulfilled') {
          const matches = (matchesResponse.value as { matches: Match[] }).matches || [];
          setAllMatches(matches);
          const pendingCount = matches.filter(m => m.status === 'pending').length;
          // Count unique alumni in active matches (for Alumni card)
          const activeMatches = matches.filter(m => m.status === 'accepted');
          const uniqueAlumniIds = new Set(activeMatches.map(m => m.alumni.id));
          const activeAlumniCount = uniqueAlumniIds.size;
          // Count total active matches (for Matches card)
          const activeMatchesNum = activeMatches.length;
          const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
          setPendingMatchesCount(pendingCount);
          setActiveMatchesCount(activeAlumniCount);
          setActiveMatchesNumber(activeMatchesNum);
          setAwaitingAlumniCount(awaitingCount);
        } else {
          // Handle matches loading errors - log for debugging but don't show error banner
          const error = matchesResponse.reason;
          if (error instanceof Error) {
            // Only log non-critical errors (like 500) without showing error banner
            // Authentication errors are handled by apiRequest
            if (!error.message.includes('expired') && !error.message.includes('Unauthorized')) {
              console.warn('Failed to load matches (non-critical):', error.message);
            }
          }
          setAllMatches([]);
          setPendingMatchesCount(0);
          setActiveMatchesCount(0);
          setActiveMatchesNumber(0);
          setAwaitingAlumniCount(0);
        }

        if (invitationCodeResponse.status === 'fulfilled') {
          setInvitationCode(invitationCodeResponse.value.code);
        } else {
          setInvitationCode(null);
        }



        // Admin invites are not displayed in this view; ignore response

        if (verificationCodesResponse.status === 'fulfilled') {
          const codesPayload = verificationCodesResponse.value.codes || [];
          setVerificationCodes(codesPayload);
        } else {
          setVerificationCodes([]);
        }

        if (adminsResponse.status === 'fulfilled') {
          setAdmins(adminsResponse.value.admins || []);
        } else {
          setAdmins([]);
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

  useEffect(() => {
    fetchPasswordResetRequests();
    const interval = setInterval(() => {
      fetchPasswordResetRequests();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleOpenProfile = () => {
    setPasswordError(null);
    setPasswordSuccess(null);
    setShowProfileModal(true);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

    if (!hasUppercase) {
      setPasswordError('Password must include at least one uppercase letter');
      return;
    }

    if (!hasSpecialChar) {
      setPasswordError('Password must include at least one special character');
      return;
    }

    setUpdatingPassword(true);

    try {
      await apiRequest(API_ENDPOINTS.changePassword, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowProfileModal(false);
      logout();
      navigate('/login', { replace: true, state: { passwordChanged: true } });
    } catch (err) {
      let errorMessage = 'Failed to change password.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setPasswordError(errorMessage);
    } finally {
      setUpdatingPassword(false);
    }
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
    setStudentSubFilter('all');
    setAlumniSubFilter('all');
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
      // Count unique alumni in active matches (for Alumni card)
      const activeMatches = matches.filter(m => m.status === 'accepted');
      const uniqueAlumniIds = new Set(activeMatches.map(m => m.alumni.id));
      const activeAlumniCount = uniqueAlumniIds.size;
      // Count total active matches (for Matches card)
      const activeMatchesNum = activeMatches.length;
      const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
      setPendingMatchesCount(pendingCount);
      setActiveMatchesCount(activeAlumniCount);
      setActiveMatchesNumber(activeMatchesNum);
      setAwaitingAlumniCount(awaitingCount);
      setMatchSubFilter(filter);
      setViewMode('matches');
    } catch (err) {
      console.error('Failed to load all matches:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load matches list';
      setError(errorMessage);
      // Don't navigate to matches view if loading failed - stay in current view
    } finally {
      setLoading(false);
    }
  };



  const handleBackToMatchesList = () => {
    setViewMode('matches');
    setSelectedMatch(null);
  };

  const handleViewMatchDetail = (match: Match) => {
    setSelectedMatch(match);
    setViewMode('matchDetail');
  };

  const handleCancelMatch = async (matchId: number) => {
    if (!window.confirm('Are you sure you want to cancel this match?')) {
      return;
    }

    const reason = window.prompt('Enter cancellation reason (optional):');

    try {
      setProcessingMatch(matchId);
      setError(null);

      await apiRequest(API_ENDPOINTS.adminCancelMatch(matchId), {
        method: 'POST',
        body: JSON.stringify({ reason: reason || null }),
      });

      setViewMode('matches');
      setSelectedMatch(null);

      const matchesResponse = await apiRequest<{ matches: Match[] }>(API_ENDPOINTS.adminAllMatches);
      setAllMatches(matchesResponse.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel match');
    } finally {
      setProcessingMatch(null);
    }
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
        // Count unique alumni in active matches (for Alumni card)
        const activeMatches = matches.filter(m => m.status === 'accepted');
        const uniqueAlumniIds = new Set(activeMatches.map(m => m.alumni.id));
        const activeAlumniCount = uniqueAlumniIds.size;
        // Count total active matches (for Matches card)
        const activeMatchesNum = activeMatches.length;
        const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
        setPendingMatchesCount(pendingCount);
        setActiveMatchesCount(activeAlumniCount);
        setActiveMatchesNumber(activeMatchesNum);
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

  const handleCreateMatch = async () => {
    if (!selectedStudentForMatch || !selectedAlumniForMatch) {
      setError('Please select both a student and an alumni');
      return;
    }

    try {
      setCreatingMatch(true);
      setError(null);

      await apiRequest(API_ENDPOINTS.adminCreateMatch, {
        method: 'POST',
        body: JSON.stringify({
          studentId: selectedStudentForMatch.id,
          alumniId: selectedAlumniForMatch.id,
          coverLetter: matchCoverLetter.trim() || undefined,
        }),
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
        const activeMatches = matches.filter(m => m.status === 'accepted');
        const uniqueAlumniIds = new Set(activeMatches.map(m => m.alumni.id));
        const activeAlumniCount = uniqueAlumniIds.size;
        const activeMatchesNum = activeMatches.length;
        const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
        setPendingMatchesCount(pendingCount);
        setActiveMatchesCount(activeAlumniCount);
        setActiveMatchesNumber(activeMatchesNum);
        setAwaitingAlumniCount(awaitingCount);
      }
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value);
      }

      // Close modal and reset
      setShowCreateMatchModal(false);
      setSelectedStudentForMatch(null);
      setSelectedAlumniForMatch(null);
      setMatchCoverLetter('');
      
      // Navigate to matches view
      setViewMode('matches');
      setMatchSubFilter('awaitingAlumni');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create match');
    } finally {
      setCreatingMatch(false);
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
        // Count unique alumni in active matches (for Alumni card)
        const activeMatches = matches.filter(m => m.status === 'accepted');
        const uniqueAlumniIds = new Set(activeMatches.map(m => m.alumni.id));
        const activeAlumniCount = uniqueAlumniIds.size;
        // Count total active matches (for Matches card)
        const activeMatchesNum = activeMatches.length;
        const awaitingCount = matches.filter(m => m.status === 'confirmed').length;
        setPendingMatchesCount(pendingCount);
        setActiveMatchesCount(activeAlumniCount);
        setActiveMatchesNumber(activeMatchesNum);
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
      
      await apiRequest(endpoint, { method: 'POST' });
      
      // Refresh data
      const [studentsResponse, _alumniResponse, statsResponse, allStudentsResponse, allAlumniResponse] = await Promise.allSettled([
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

  const handleCreateAdminInvitationCode = async () => {
    if (!newAdminInvitationCode.trim()) {
      setError('Please enter an admin invitation code');
      return;
    }

    try {
      setCreatingAdminInvitationCode(true);
      setError(null);

      const response = await apiRequest<{ invitationCode: { code: string } }>(API_ENDPOINTS.adminCreateAdminInvitationCode, {
        method: 'POST',
        body: JSON.stringify({ code: newAdminInvitationCode.trim() }),
      });

      setLastAdminInviteCode(response.invitationCode.code);
      setShowAdminInvitationModal(false);
      setNewAdminInvitationCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin invitation code');
    } finally {
      setCreatingAdminInvitationCode(false);
    }
  };

  const handleCreateAdminInvite = async () => {
    if (!newAdminInviteEmail.trim()) {
      setError('Please enter a staff email');
      return;
    }

    try {
      setCreatingAdminInvite(true);
      setError(null);

      const response = await apiRequest<{ invite: { email: string; code: string; expiresAt: string } }>(API_ENDPOINTS.adminCreateAdminInvite, {
        method: 'POST',
        body: JSON.stringify({ email: newAdminInviteEmail.trim() }),
      });

      setLastAdminInviteCode(response.invite.code);
      setLastAdminInviteExpiresAt(response.invite.expiresAt);
      setLastAdminInviteEmail(response.invite.email);
      setNewAdminInviteEmail('');

      // refresh pending invites list
      await apiRequest<{ invites: AdminInviteSummary[] }>(API_ENDPOINTS.adminListPendingAdminInvites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin invite');
    } finally {
      setCreatingAdminInvite(false);
    }
  };

  const fetchPasswordResetRequests = async () => {
    try {
      setPasswordResetLoading(true);
      setPasswordResetError(null);

      const response = await apiRequest<{ count: number; requests: Array<{ id: number; email: string; code: string; createdAt: string; expiresAt: string }> }>(API_ENDPOINTS.adminPasswordResetRequests);
      setPasswordResetRequests(response.requests || []);
    } catch (err) {
      setPasswordResetError(err instanceof Error ? err.message : 'Failed to load password reset requests');
      setPasswordResetRequests([]);
    } finally {
      setPasswordResetLoading(false);
    }
  };


  const handleReject = async (userId: number, role: 'student' | 'alumni') => {
    if (!window.confirm(`Are you sure you want to reject this ${role}?`)) {
      return;
    }

    try {
      setError(null);
      const endpoint = role === 'student'
        ? API_ENDPOINTS.adminRejectStudent(userId)
        : API_ENDPOINTS.adminRejectAlumni(userId);

      await apiRequest(endpoint, { method: 'POST' });
      setSuccessMessage(`${role === 'student' ? 'Student' : 'Alumni'} rejected successfully.`);

      const [studentsResponse, alumniResponse] = await Promise.allSettled([
        apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents).catch(() => ({ students: [] })),
        apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni).catch(() => ({ mentors: [] })),
      ]);

      if (studentsResponse.status === 'fulfilled') {
        setAllStudents(studentsResponse.value.students || []);
        if (viewMode === 'studentDetail' && selectedStudent) {
          const updated = studentsResponse.value.students.find((s) => s.id === selectedStudent.id);
          if (updated) {
            setSelectedStudent(updated);
          }
        }
      }

      if (alumniResponse.status === 'fulfilled') {
        setAllAlumni(alumniResponse.value.mentors || []);
        if (viewMode === 'alumniDetail' && selectedAlumni) {
          const updated = alumniResponse.value.mentors.find((a) => a.id === selectedAlumni.id);
          if (updated) {
            setSelectedAlumni(updated);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject user');
    }
  };

  const handleDeactivateUser = async (userId: number, role: 'student' | 'alumni') => {
    if (!window.confirm(`Are you sure you want to deactivate this ${role}?`)) {
      return;
    }

    const reason = window.prompt('Enter deactivation reason (optional):');

    try {
      setError(null);
      await apiRequest(API_ENDPOINTS.adminDeactivateUser(userId), {
        method: 'POST',
        body: JSON.stringify({ reason: reason?.trim() || undefined }),
      });

      setSuccessMessage(`${role === 'student' ? 'Student' : 'Alumni'} deactivated successfully.`);

      const [studentsResponse, alumniResponse] = await Promise.allSettled([
        apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents).catch(() => ({ students: [] })),
        apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni).catch(() => ({ mentors: [] })),
      ]);

      if (studentsResponse.status === 'fulfilled') {
        setAllStudents(studentsResponse.value.students || []);
        if (viewMode === 'studentDetail' && selectedStudent) {
          const updated = studentsResponse.value.students.find((s) => s.id === selectedStudent.id);
          if (updated) {
            setSelectedStudent(updated);
          }
        }
      }

      if (alumniResponse.status === 'fulfilled') {
        setAllAlumni(alumniResponse.value.mentors || []);
        if (viewMode === 'alumniDetail' && selectedAlumni) {
          const updated = alumniResponse.value.mentors.find((a) => a.id === selectedAlumni.id);
          if (updated) {
            setSelectedAlumni(updated);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
    }
  };

  const handleReactivateUser = async (userId: number, role: 'student' | 'alumni') => {
    try {
      setError(null);
      await apiRequest(API_ENDPOINTS.adminReactivateUser(userId), {
        method: 'POST',
      });

      setSuccessMessage(`${role === 'student' ? 'Student' : 'Alumni'} reactivated successfully.`);

      const [studentsResponse, alumniResponse] = await Promise.allSettled([
        apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents).catch(() => ({ students: [] })),
        apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni).catch(() => ({ mentors: [] })),
      ]);

      if (studentsResponse.status === 'fulfilled') {
        setAllStudents(studentsResponse.value.students || []);
        if (viewMode === 'studentDetail' && selectedStudent) {
          const updated = studentsResponse.value.students.find((s) => s.id === selectedStudent.id);
          if (updated) {
            setSelectedStudent(updated);
          }
        }
      }

      if (alumniResponse.status === 'fulfilled') {
        setAllAlumni(alumniResponse.value.mentors || []);
        if (viewMode === 'alumniDetail' && selectedAlumni) {
          const updated = alumniResponse.value.mentors.find((a) => a.id === selectedAlumni.id);
          if (updated) {
            setSelectedAlumni(updated);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate user');
    }
  };

  const handleDeactivateAdmin = async (adminId: number) => {
    if (!window.confirm('Are you sure you want to deactivate your account? You will not be able to log in.')) {
      return;
    }

    try {
      setError(null);
      setProcessingAdminId(adminId);
      
      await apiRequest(API_ENDPOINTS.adminDeactivateAdmin(adminId), { method: 'POST' });
      
      setSuccessMessage('Your account has been deactivated.');
      
      // Refresh admins list
      const response = await apiRequest<{ admins: Array<{ id: number; name: string; email: string; isActive: boolean; passwordUpdatedAt: string | null; createdAt: string; profilePhotoFilePath?: string | null }> }>(API_ENDPOINTS.adminListAdmins);
      setAdmins(response.admins || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to deactivate account';
      setError(errorMsg);
    } finally {
      setProcessingAdminId(null);
    }
  };

  const handleReactivateAdmin = async (adminId: number) => {
    try {
      setError(null);
      setProcessingAdminId(adminId);
      
      await apiRequest(API_ENDPOINTS.adminReactivateAdmin(adminId), { method: 'POST' });
      
      setSuccessMessage('Admin account reactivated successfully.');
      
      // Refresh admins list
      const response = await apiRequest<{ admins: Array<{ id: number; name: string; email: string; isActive: boolean; passwordUpdatedAt: string | null; createdAt: string; profilePhotoFilePath?: string | null }> }>(API_ENDPOINTS.adminListAdmins);
      setAdmins(response.admins || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reactivate admin';
      setError(errorMsg);
    } finally {
      setProcessingAdminId(null);
    }
  };

  const handleDeleteVerificationCode = async (codeId: number) => {
    if (!window.confirm('Are you sure you want to delete this verification code?')) {
      return;
    }

    try {
      setError(null);
      await apiRequest(API_ENDPOINTS.adminDeleteVerificationCode(codeId), { method: 'DELETE' });

      // Optimistically remove, then re-fetch to ensure sync with backend filters
      setVerificationCodes(prev => prev.filter(code => code.id !== codeId));

      try {
        const refreshed = await apiRequest<{ codes: Array<{ id: number; email: string; code: string; purpose: string; expiresAt: string; usedAt: string | null; createdAt: string; status: 'active' | 'expired' | 'used' }> }>(API_ENDPOINTS.adminVerificationCodes);
        setVerificationCodes(refreshed.codes || []);
      } catch (refreshErr) {
        console.warn('Failed to refresh verification codes after delete:', refreshErr);
      }

      setSuccessMessage('Verification code deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete verification code');
    }
  };

  const handleUploadProfilePhoto = async (file: File) => {
    try {
      setProfilePhotoError(null);
      setUploadingProfilePhoto(true);

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setProfilePhotoError('Only JPEG, PNG, and WebP images are allowed');
        setUploadingProfilePhoto(false);
        return;
      }

      // Validate file size (2MB)
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
          headers: {}, // Let the browser set Content-Type for FormData
        }
      );

      // Update AuthContext with latest user from server
      setUserState(response.user);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      setProfilePhotoVersion((v) => v + 1); // cache-bust freshly uploaded photo

      setSuccessMessage('Profile photo uploaded successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload profile photo';
      setProfilePhotoError(errorMsg);
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const handleRemoveProfilePhoto = async () => {
    if (!window.confirm('Remove profile photo?')) {
      return;
    }

    try {
      setProfilePhotoError(null);
      setUploadingProfilePhoto(true);

      const response = await apiRequest<{ user: any }>(
        API_ENDPOINTS.deleteProfilePhoto,
        {
          method: 'DELETE',
        }
      );

      // Update AuthContext with latest user from server
      setUserState(response.user);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      setProfilePhotoVersion((v) => v + 1);
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      setSuccessMessage('Profile photo removed successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove profile photo';
      setProfilePhotoError(errorMsg);
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const handleOpenCreateMatchModal = async () => {
    try {
      setIsLoadingMatchOptions(true);
      setMatchOptionsError(null);
      setSelectedStudentForMatch(null);
      setSelectedAlumniForMatch(null);
      setMatchCoverLetter('');

      // Fetch students and alumni in parallel
      const [studentsResponse, alumniResponse] = await Promise.all([
        apiRequest<{ students: Student[] }>(API_ENDPOINTS.adminAllStudents).catch(() => ({ students: [] })),
        apiRequest<{ mentors: Alumni[] }>(API_ENDPOINTS.adminAllAlumni).catch(() => ({ mentors: [] }))
      ]);

      const students = (studentsResponse.students || []).map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        studentId: s.studentId
      }));

      const alumni = (alumniResponse.mentors || []).map(a => ({
        id: a.id,
        name: a.name,
        email: a.email,
        degree: a.currentCompany
      }));

      setMatchStudents(students);
      setMatchAlumni(alumni);
      setShowCreateMatchModal(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load students and alumni';
      setMatchOptionsError(errorMsg);
      setIsLoadingMatchOptions(false);
    } finally {
      setIsLoadingMatchOptions(false);
    }
  };

  const handleRetryLoadMatchOptions = async () => {
    await handleOpenCreateMatchModal();
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
              <button
                onClick={handleOpenProfile}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', color: '#111827', padding: '0.5rem 0.9rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 600 }}
              >
                <UserCircle size={16} />
                <span>Profile</span>
              </button>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#D50000', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showProfileModal && (
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
            padding: '1.75rem',
            maxWidth: '520px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>My Profile</h3>

            <ProfilePhotoUploader
              photoUrl={effectiveUser?.profilePhotoFilePath ? `${normalizedApiBaseUrl}${effectiveUser.profilePhotoFilePath}?v=${profilePhotoVersion}` : null}
              initials={effectiveUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
              onUpload={handleUploadProfilePhoto}
              onRemove={handleRemoveProfilePhoto}
              isUploading={uploadingProfilePhoto}
              errorMessage={profilePhotoError}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f9fafb' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Name</p>
                <p style={{ color: '#111827', fontWeight: 600 }}>{user?.name || 'Admin'}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</p>
                <p style={{ color: '#111827', fontWeight: 600 }}>{user?.email || 'N/A'}</p>
              </div>
              {user?.role && (
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Designation</p>
                  <p style={{ color: '#111827', fontWeight: 600 }}>{user.role}</p>
                </div>
              )}
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Last Password Change</p>
                <p style={{ color: '#111827', fontWeight: 600 }}>
                  {user?.passwordUpdatedAt ? new Date(user.passwordUpdatedAt).toLocaleString() : 'Not available'}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Change Password</h4>

              {passwordError && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#b91c1c', fontSize: '0.875rem' }}>
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem 1rem', backgroundColor: '#ecfdf3', border: '1px solid #bbf7d0', borderRadius: '0.5rem', color: '#166534', fontSize: '0.875rem' }}>
                  {passwordSuccess}
                </div>
              )}

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="currentPassword" style={{ display: 'block', color: '#374151', marginBottom: '0.35rem', fontWeight: 500 }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.95rem', outline: 'none', paddingRight: '3rem' }}
                      disabled={updatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      aria-label="Toggle password visibility"
                      disabled={updatingPassword}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#6b7280',
                        cursor: updatingPassword ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.25rem'
                      }}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" style={{ display: 'block', color: '#374151', marginBottom: '0.35rem', fontWeight: 500 }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.95rem', outline: 'none', paddingRight: '3rem' }}
                      disabled={updatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label="Toggle password visibility"
                      disabled={updatingPassword}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#6b7280',
                        cursor: updatingPassword ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.25rem'
                      }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" style={{ display: 'block', color: '#374151', marginBottom: '0.35rem', fontWeight: 500 }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.95rem', outline: 'none', paddingRight: '3rem' }}
                      disabled={updatingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label="Toggle password visibility"
                      disabled={updatingPassword}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#6b7280',
                        cursor: updatingPassword ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.25rem'
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleCloseProfile}
                    disabled={updatingPassword}
                    style={{
                      border: '1px solid #d1d5db',
                      color: '#374151',
                      padding: '0.6rem 1rem',
                      borderRadius: '0.5rem',
                      cursor: updatingPassword ? 'not-allowed' : 'pointer',
                      backgroundColor: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    style={{
                      backgroundColor: updatingPassword ? '#9ca3af' : '#D50000',
                      color: 'white',
                      padding: '0.6rem 1.1rem',
                      borderRadius: '0.5rem',
                      cursor: updatingPassword ? 'not-allowed' : 'pointer',
                      border: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#16a34a', fontSize: '0.875rem' }}>
            {successMessage}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {effectiveUser?.profilePhotoFilePath ? (
                    <img
                      src={`${normalizedApiBaseUrl}${effectiveUser.profilePhotoFilePath}?v=${profilePhotoVersion}`}
                      alt={effectiveUser?.name || 'Profile'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 'bold', color: '#6b7280', fontSize: '1rem' }}>
                      {(effectiveUser?.name || 'A').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
                  Welcome back, {effectiveUser?.name}!
                </h1>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Manage users, approvals, and invitations
              </p>
            </div>

            {/* Main Overview - 4 Core Sections in 2x2 Grid */}
            {viewMode === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
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
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>{activeMatchesNumber}</div>
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

                {/* Admins Section */}
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setViewMode('admins');
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
                        <div style={{ width: '56px', height: '56px', borderRadius: '0.75rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <UserCircle size={32} color="#4f46e5" />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Admins</h2>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manage admin accounts</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', alignItems: 'end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{admins.filter(a => a.isActive).length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Admins</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316', marginBottom: '0.5rem' }}>{admins.filter(a => !a.isActive).length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Inactive</div>
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
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                <div
                  onClick={() => setAlumniInviteExpanded(!alumniInviteExpanded)}
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Key size={20} color="#C8102E" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                      Alumni Invitation Code
                    </h2>
                  </div>
                  <ChevronDown
                    size={20}
                    color="#6b7280"
                    style={{
                      transform: alumniInviteExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </div>

                {alumniInviteExpanded && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
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
              </div>
            )}

            {/* Admin Invites (email-based) */}
            {viewMode === 'overview' && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                <div
                  onClick={() => setAdminInvitesExpanded(!adminInvitesExpanded)}
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Key size={20} color="#C8102E" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                      Admin Invites
                    </h2>
                  </div>
                  <ChevronDown
                    size={20}
                    color="#6b7280"
                    style={{
                      transform: adminInvitesExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </div>

                {adminInvitesExpanded && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
                      <input
                        type="email"
                        value={newAdminInviteEmail}
                        onChange={(e) => setNewAdminInviteEmail(e.target.value)}
                        placeholder="staff@waikato.ac.nz"
                        style={{
                          flex: 1,
                          minWidth: '240px',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#C8102E'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                      />
                      <button
                        onClick={handleCreateAdminInvite}
                        disabled={creatingAdminInvite}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: creatingAdminInvite ? '#9ca3af' : '#C8102E',
                      color: 'white',
                      padding: '0.65rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: creatingAdminInvite ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      opacity: creatingAdminInvite ? 0.85 : 1
                    }}
                  >
                    {creatingAdminInvite ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Generate Invite
                      </>
                    )}
                  </button>
                </div>

                {lastAdminInviteCode && (
                  <div style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>Generated Invite</p>
                    
                    <div style={{ marginBottom: '0.75rem' }}>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                      <p style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 500 }}>{lastAdminInviteEmail}</p>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Invite Code</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: '#111827', backgroundColor: 'white', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', flex: 1 }}>{lastAdminInviteCode}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(lastAdminInviteCode);
                            alert('Admin invite code copied to clipboard!');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'white',
                            color: '#374151',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #d1d5db',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Copy size={16} />
                          Copy
                        </button>
                      </div>
                    </div>

                    {lastAdminInviteExpiresAt && (
                      <div>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Valid Until</p>
                        <p style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 500 }}>{new Date(lastAdminInviteExpiresAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}
                  </div>
                )}
              </div>
            )}

            {/* Student Verification Codes */}
            {viewMode === 'overview' && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                <div
                  onClick={() => setVerificationCodesExpanded(!verificationCodesExpanded)}
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Key size={20} color="#C8102E" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                      Student Verification Codes
                    </h2>
                  </div>
                  <ChevronDown
                    size={20}
                    color="#6b7280"
                    style={{
                      transform: verificationCodesExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </div>

                {verificationCodesExpanded && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
                    {verificationCodes.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        <p>No verification codes generated yet.</p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ marginBottom: '1rem' }}>
                          <button
                            onClick={() => setShowVerificationCodes(!showVerificationCodes)}
                            style={{
                              backgroundColor: showVerificationCodes ? '#fee2e2' : '#f0f9ff',
                              color: showVerificationCodes ? '#991b1b' : '#0c4a6e',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.5rem',
                              border: `1px solid ${showVerificationCodes ? '#fecaca' : '#bae6fd'}`,
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: 500
                            }}
                          >
                            {showVerificationCodes ? 'Hide Codes' : 'Show Codes'}
                          </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Email</th>
                                {showVerificationCodes && (
                                  <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Code</th>
                                )}
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Expires At</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {verificationCodes.map(code => (
                                <tr key={code.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '0.75rem', color: '#111827' }}>{code.email}</td>
                                  {showVerificationCodes && (
                                    <td style={{ padding: '0.75rem', color: '#111827', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 500 }}>{code.code}</td>
                                  )}
                                  <td style={{ padding: '0.75rem' }}>
                                    <span style={{
                                      display: 'inline-block',
                                      padding: '0.25rem 0.75rem',
                                      borderRadius: '9999px',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      backgroundColor: code.status === 'active' ? '#d1fae5' : (code.status === 'used' ? '#fecaca' : '#fed7aa'),
                                      color: code.status === 'active' ? '#065f46' : (code.status === 'used' ? '#7f1d1d' : '#92400e')
                                    }}>
                                      {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
                                    </span>
                                  </td>
                                  <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>{new Date(code.expiresAt).toLocaleString()}</td>
                                  <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <button
                                      onClick={async () => {
                                        try {
                                          await navigator.clipboard.writeText(String(code.code));
                                          setSuccessMessage('Code copied to clipboard');
                                          setTimeout(() => setSuccessMessage(null), 2000);
                                        } catch (err) {
                                          try {
                                            const textarea = document.createElement('textarea');
                                            textarea.value = String(code.code);
                                            document.body.appendChild(textarea);
                                            textarea.select();
                                            document.execCommand('copy');
                                            document.body.removeChild(textarea);
                                            setSuccessMessage('Code copied to clipboard');
                                            setTimeout(() => setSuccessMessage(null), 2000);
                                          } catch (copyErr) {
                                            console.error('Copy failed:', copyErr);
                                            setError('Failed to copy code');
                                          }
                                        }
                                      }}
                                      style={{
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #d1d5db',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                      }}
                                    >
                                      Copy
                                    </button>
                                    <button
                                      onClick={() => handleDeleteVerificationCode(code.id)}
                                      style={{
                                        backgroundColor: '#fee2e2',
                                        color: '#991b1b',
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #fecaca',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Password Reset Requests */}
            {viewMode === 'overview' && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
                <div
                  onClick={() => setPasswordResetExpanded(!passwordResetExpanded)}
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Key size={20} color="#C8102E" />
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Password Reset Requests</h2>
                      <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                        Active reset requests: {passwordResetRequests.length}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    color="#6b7280"
                    style={{
                      transform: passwordResetExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </div>

                {passwordResetExpanded && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                      <button
                        onClick={fetchPasswordResetRequests}
                        disabled={passwordResetLoading}
                        style={{
                          backgroundColor: passwordResetLoading ? '#9ca3af' : '#C8102E',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: passwordResetLoading ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        {passwordResetLoading ? 'Refreshing...' : 'Refresh'}
                      </button>
                    </div>

                    {passwordResetError && (
                      <div style={{ marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', color: '#991b1b', fontSize: '0.9rem' }}>
                        {passwordResetError}
                      </div>
                    )}

                    {passwordResetLoading && passwordResetRequests.length === 0 ? (
                      <div style={{ padding: '1rem', color: '#6b7280' }}>Loading reset requests...</div>
                    ) : passwordResetRequests.length === 0 ? (
                      <div style={{ padding: '1rem', color: '#6b7280' }}>No active password reset requests.</div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Email</th>
                              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Code</th>
                              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Status</th>
                              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Created At</th>
                              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Expires At</th>
                              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#374151', fontWeight: 600 }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {passwordResetRequests.map((req) => (
                              <tr key={req.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem', color: '#111827' }}>{req.email}</td>
                                <td style={{ padding: '0.75rem', color: '#111827', fontFamily: 'monospace', fontWeight: 600 }}>{req.code}</td>
                                <td style={{ padding: '0.75rem' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: '#d1fae5',
                                    color: '#065f46'
                                  }}>
                                    Active
                                  </span>
                                </td>
                                <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>{new Date(req.createdAt).toLocaleString()}</td>
                                <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>{new Date(req.expiresAt).toLocaleString()}</td>
                                <td style={{ padding: '0.75rem' }}>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(req.code)}
                                    style={{
                                      backgroundColor: 'white',
                                      color: '#374151',
                                      padding: '0.4rem 0.75rem',
                                      borderRadius: '0.375rem',
                                      border: '1px solid #d1d5db',
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: 600
                                    }}
                                  >
                                    Copy
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
              // Note: This set was created for potential future use but is not currently referenced
              // const fullyMatchedStudentIds = new Set(
              //   allMatches
              //     .filter(m => m.status === 'accepted')
              //     .map(m => m.student.id)
              // );

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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Avatar name={student.name} photoPath={student.profilePhotoFilePath} size={32} />
                            <div>
                              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{student.name}</h3>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{student.email}</p>
                            </div>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                  {selectedStudent.id !== currentUserId && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {selectedStudent.isActive === false ? (
                        <button
                          onClick={() => handleReactivateUser(selectedStudent.id, 'student')}
                          style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeactivateUser(selectedStudent.id, 'student')}
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  )}
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
                        {selectedStudent.mentoringGoals.map((goal: string, index: number) => (
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
                        {selectedStudent.skillsWanted.map((skill: string, index: number) => (
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <Avatar name={alumni.name} photoPath={alumni.profilePhotoFilePath} size={32} />
                              <div>
                                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{alumni.name}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{alumni.email}</p>
                                {alumni.currentCompany && (
                                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                    {alumni.currentPosition ? `${alumni.currentPosition} at ` : ''}{alumni.currentCompany}
                                  </p>
                                )}
                              </div>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                  {selectedAlumni.id !== currentUserId && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {selectedAlumni.isActive === false ? (
                        <button
                          onClick={() => handleReactivateUser(selectedAlumni.id, 'alumni')}
                          style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeactivateUser(selectedAlumni.id, 'alumni')}
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  )}
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
                        {selectedAlumni.mentoringGoals.map((goal: string, index: number) => (
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
                        {selectedAlumni.skillsOffered.map((skill: string, index: number) => (
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
                    onClick={() => setViewMode('overview')}
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Avatar name={student.name} photoPath={student.profilePhotoFilePath} size={32} />
                            <div>
                              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{student.name}</h3>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{student.email}</p>
                            </div>
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

            {/* All Admins List */}
            {viewMode === 'admins' && (() => {
              // Sort admins by email
              const sortedAdmins = [...admins].sort((a, b) => a.email.localeCompare(b.email));

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
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Admins Management</h2>
                    </div>
                  </div>

                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      Loading...
                    </div>
                  ) : sortedAdmins.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ textAlign: 'left', backgroundColor: '#f9fafb' }}>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Email</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Last Password Change</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Registered</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedAdmins.map((admin) => {
                            const isCurrentUser = admin.id === currentUserId;
                            const isActive = admin.isActive;

                            return (
                              <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem', fontSize: '0.95rem', color: '#111827', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <Avatar name={admin.name} photoPath={admin.profilePhotoFilePath} size={32} />
                                  {admin.name}
                                </td>
                                <td style={{ padding: '0.75rem', fontSize: '0.95rem', color: '#374151' }}>{admin.email}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: isActive ? '#dcfce7' : '#fee2e2',
                                    color: isActive ? '#16a34a' : '#dc2626',
                                    fontWeight: 500
                                  }}>
                                    {isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#6b7280' }}>
                                  {admin.passwordUpdatedAt ? new Date(admin.passwordUpdatedAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#6b7280' }}>
                                  {new Date(admin.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                                  {(() => {
                                    const actionButtons: JSX.Element[] = [];

                                    if (isCurrentUser && isActive) {
                                      actionButtons.push(
                                        <button
                                          key="deactivate"
                                          onClick={() => handleDeactivateAdmin(admin.id)}
                                          disabled={processingAdminId === admin.id}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            backgroundColor: processingAdminId === admin.id ? '#9ca3af' : '#dc2626',
                                            color: 'white',
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            border: 'none',
                                            cursor: processingAdminId === admin.id ? 'not-allowed' : 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 500
                                          }}
                                          title="You can only deactivate your own account"
                                        >
                                          {processingAdminId === admin.id ? (
                                            <>
                                              <div style={{ width: '12px', height: '12px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                              Deactivating...
                                            </>
                                          ) : (
                                            <>
                                              <XCircle size={14} />
                                              Deactivate
                                            </>
                                          )}
                                        </button>
                                      );
                                    }

                                    if (!isCurrentUser && !isActive) {
                                      actionButtons.push(
                                        <button
                                          key="reactivate"
                                          onClick={() => handleReactivateAdmin(admin.id)}
                                          disabled={processingAdminId === admin.id}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            backgroundColor: processingAdminId === admin.id ? '#9ca3af' : '#16a34a',
                                            color: 'white',
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            border: 'none',
                                            cursor: processingAdminId === admin.id ? 'not-allowed' : 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 500
                                          }}
                                          title="Only another admin can reactivate this account"
                                        >
                                          {processingAdminId === admin.id ? (
                                            <>
                                              <div style={{ width: '12px', height: '12px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                              Reactivating...
                                            </>
                                          ) : (
                                            <>
                                              <CheckCircle size={14} />
                                              Reactivate
                                            </>
                                          )}
                                        </button>
                                      );
                                    }

                                    if (actionButtons.length === 0) {
                                      return (
                                        <span style={{
                                          display: 'inline-block',
                                          padding: '0.35rem 0.75rem',
                                          borderRadius: '0.375rem',
                                          backgroundColor: '#f3f4f6',
                                          color: '#9ca3af',
                                          fontSize: '0.8rem',
                                          fontWeight: 500,
                                          cursor: 'default'
                                        }}>
                                          {isCurrentUser && !isActive ? 'Account Inactive' : 'No Action'}
                                        </span>
                                      );
                                    }

                                    return (
                                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {actionButtons}
                                      </div>
                                    );
                                  })()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                      <p style={{ fontSize: '0.95rem' }}>No admins found</p>
                    </div>
                  )}
                </div>
              );
            })()}

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
                  <button
                    onClick={handleOpenCreateMatchModal}
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
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    <Plus size={16} />
                    Create Match
                  </button>
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
                              <div style={{ minWidth: 0, width: '100%', display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                <Avatar name={match.student.name} photoPath={match.student.profilePhotoFilePath} size={32} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', height: '1rem' }}>Student</p>
                                  <p style={{ fontWeight: 600, marginBottom: '0.25rem', wordBreak: 'break-word', minHeight: '1.5rem' }}>{match.student.name}</p>
                                  <p style={{ fontSize: '0.875rem', color: '#6b7280', wordBreak: 'break-all', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{match.student.email}</p>
                                </div>
                              </div>
                              <div style={{ minWidth: 0, width: '100%', display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                <Avatar name={match.alumni.name} photoPath={match.alumni.profilePhotoFilePath} size={32} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', height: '1rem' }}>Alumni Mentor</p>
                                  <p style={{ fontWeight: 600, marginBottom: '0.25rem', wordBreak: 'break-word', minHeight: '1.5rem' }}>{match.alumni.name}</p>
                                  <p style={{ fontSize: '0.875rem', color: '#6b7280', wordBreak: 'break-all', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{match.alumni.email}</p>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: match.status === 'confirmed' ? '#dcfce7' : match.status === 'pending' ? '#fef3c7' : match.status === 'cancelled' ? '#f3f4f6' : '#fee2e2',
                                color: match.status === 'confirmed' ? '#16a34a' : match.status === 'pending' ? '#d97706' : match.status === 'cancelled' ? '#6b7280' : '#dc2626',
                                fontWeight: 500
                              }}>
                                {match.status === 'confirmed' ? 'Awaiting Alumni' : match.status === 'cancelled' ? 'Cancelled' : match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                              </span>
                              {match.status !== 'cancelled' && match.status !== 'completed' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelMatch(match.id);
                                  }}
                                  style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fecaca';
                                    e.currentTarget.style.color = '#b91c1c';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                    e.currentTarget.style.color = '#dc2626';
                                  }}
                                >
                                  Cancel
                                </button>
                              )}
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

      {/* Create Admin Invitation Code Modal */}
      {showAdminInvitationModal && (
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
              Generate New Admin Invitation Code
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              Creating a new admin invitation code will automatically deactivate all previous admin codes. Only one admin code can be active at a time.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#374151' }}>
                Admin Invitation Code <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={newAdminInvitationCode}
                onChange={(e) => setNewAdminInvitationCode(e.target.value)}
                placeholder="Enter invitation code (e.g., ADMIN-2025)"
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
                  setShowAdminInvitationModal(false);
                  setNewAdminInvitationCode('');
                }}
                disabled={creatingAdminInvitationCode}
                style={{
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: creatingAdminInvitationCode ? 'not-allowed' : 'pointer',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: creatingAdminInvitationCode ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdminInvitationCode}
                disabled={creatingAdminInvitationCode || !newAdminInvitationCode.trim()}
                style={{
                  backgroundColor: creatingAdminInvitationCode || !newAdminInvitationCode.trim() ? '#9ca3af' : '#C8102E',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: creatingAdminInvitationCode || !newAdminInvitationCode.trim() ? 'not-allowed' : 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {creatingAdminInvitationCode ? (
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
                    {selectedStudent.mentoringGoals.map((goal: string, index: number) => (
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
                    {selectedStudent.skillsWanted.map((skill: string, index: number) => (
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
                    {selectedAlumni.mentoringGoals.map((goal: string, index: number) => (
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
                    {selectedAlumni.skillsOffered.map((skill: string, index: number) => (
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

      {/* Create Match Modal */}
      {showCreateMatchModal && (
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
              Create Manual Match
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              Manually connect a student with an alumni mentor. The match will be created in "confirmed" status.
            </p>

            {matchOptionsError && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#dc2626'
              }}>
                <p style={{ marginBottom: '0.5rem' }}>{matchOptionsError}</p>
                <button
                  onClick={handleRetryLoadMatchOptions}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            {/* Student Dropdown */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#374151' }}>
                Student <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={selectedStudentForMatch?.id || ''}
                onChange={(e) => {
                  const studentId = parseInt(e.target.value, 10);
                  const student = matchStudents.find(u => u.id === studentId);
                  setSelectedStudentForMatch(student ? { id: student.id, name: student.name, email: student.email, role: 'student', approvalStatus: 'approved', createdAt: '' } : null);
                }}
                disabled={isLoadingMatchOptions}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: isLoadingMatchOptions ? '#f3f4f6' : 'white',
                  cursor: isLoadingMatchOptions ? 'not-allowed' : 'pointer',
                  opacity: isLoadingMatchOptions ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!isLoadingMatchOptions) e.currentTarget.style.borderColor = '#C8102E';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                <option value="">{isLoadingMatchOptions ? 'Loading students…' : 'Select a student...'}</option>
                {matchStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.studentId ? `(${student.studentId})` : ''} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Alumni Dropdown */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#374151' }}>
                Alumni <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={selectedAlumniForMatch?.id || ''}
                onChange={(e) => {
                  const alumniId = parseInt(e.target.value, 10);
                  const alumni = matchAlumni.find(u => u.id === alumniId);
                  setSelectedAlumniForMatch(alumni ? { id: alumni.id, name: alumni.name, email: alumni.email, role: 'alumni', approvalStatus: 'approved', createdAt: '' } : null);
                }}
                disabled={isLoadingMatchOptions}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: isLoadingMatchOptions ? '#f3f4f6' : 'white',
                  cursor: isLoadingMatchOptions ? 'not-allowed' : 'pointer',
                  opacity: isLoadingMatchOptions ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!isLoadingMatchOptions) e.currentTarget.style.borderColor = '#C8102E';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                <option value="">{isLoadingMatchOptions ? 'Loading alumni…' : 'Select an alumni...'}</option>
                {matchAlumni.map((alumni) => (
                  <option key={alumni.id} value={alumni.id}>
                    {alumni.name} ({alumni.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Match Notes Textarea */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#374151' }}>
                Match Notes (Optional)
              </label>
              <textarea
                value={matchCoverLetter}
                onChange={(e) => setMatchCoverLetter(e.target.value)}
                placeholder="Add optional notes about why this match was created..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  resize: 'vertical'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C8102E';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCreateMatchModal(false);
                  setSelectedStudentForMatch(null);
                  setSelectedAlumniForMatch(null);
                  setMatchCoverLetter('');
                  setError(null);
                  setMatchOptionsError(null);
                }}
                disabled={creatingMatch || isLoadingMatchOptions}
                style={{
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: creatingMatch || isLoadingMatchOptions ? 'not-allowed' : 'pointer',
                  backgroundColor: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: creatingMatch || isLoadingMatchOptions ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateMatch()}
                disabled={creatingMatch || isLoadingMatchOptions || !selectedStudentForMatch || !selectedAlumniForMatch}
                style={{
                  backgroundColor: creatingMatch || isLoadingMatchOptions || !selectedStudentForMatch || !selectedAlumniForMatch ? '#9ca3af' : '#C8102E',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: creatingMatch || isLoadingMatchOptions || !selectedStudentForMatch || !selectedAlumniForMatch ? 'not-allowed' : 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {creatingMatch ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Match
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
