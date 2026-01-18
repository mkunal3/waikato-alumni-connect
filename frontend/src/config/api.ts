// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  register: '/auth/register',
  login: '/auth/login',
  me: '/auth/me',
  sendVerificationCode: '/auth/send-verification-code',
  
  // Profile
  profile: '/profile',
  
  // CV
  uploadCV: '/student/cv',
  getCV: '/student/cv',
  downloadCV: '/student/cv/download',
  deleteCV: '/student/cv',
  adminDownloadStudentCV: (studentId: number) => `/admin/students/${studentId}/cv`,
  
  // Matching
  match: (menteeId: number) => `/match/${menteeId}`,
  myMatch: '/match/my',
  availableMentors: '/match/available',
  requestMatch: '/match/request',
  approveMatch: (matchId: number) => `/match/${matchId}/approve`,
  rejectMatch: (matchId: number) => `/match/${matchId}/reject`,
  
  // Messages/Chat
  getMessages: (matchId: number) => `/message/${matchId}`,
  
  // Mentor/Alumni specific
  myMentees: '/mentor/mentees',
  pendingRequests: '/mentor/pending-requests',
  acceptRequest: (requestId: number) => `/mentor/requests/${requestId}/accept`,
  declineRequest: (requestId: number) => `/mentor/requests/${requestId}/decline`,
  mentorDownloadStudentCV: (studentId: number) => `/mentor/students/${studentId}/cv`,
  
  // Admin specific
  adminStatistics: '/admin/statistics',
  adminPendingStudents: '/admin/students/pending',
  adminAllStudents: '/admin/students',
  adminAllAlumni: '/admin/mentors',
  adminPendingAlumni: '/admin/mentors/pending',
  adminAllMatches: '/admin/matches',
  adminApproveStudent: (userId: number) => `/admin/students/${userId}/approve`,
  adminRejectStudent: (userId: number) => `/admin/students/${userId}/reject`,
  adminApproveAlumni: (userId: number) => `/admin/mentors/${userId}/approve`,
  adminRejectAlumni: (userId: number) => `/admin/mentors/${userId}/reject`,
  adminGetInvitationCode: '/admin/invitation-code',
  adminCreateInvitationCode: '/admin/invitation-code',
  
  // Utility
  health: '/',
} as const;

// Helper function to handle 401 Unauthorized errors
function handleUnauthorized() {
  // Clear auth data
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  
  // Dispatch custom event to notify AuthContext
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  
  // Redirect to login page after a short delay to allow error handling to complete
  if (window.location.pathname !== '/login' && !window.location.pathname.includes('/login')) {
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }
}

// API Request Helper
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData (for file uploads) - don't set Content-Type header
  if (options.body instanceof FormData) {
    const headersWithoutContentType: Record<string, string> = {};
    if (token) {
      headersWithoutContentType['Authorization'] = `Bearer ${token}`;
    }
    // Copy other headers except Content-Type
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'content-type') {
          headersWithoutContentType[key] = value as string;
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: headersWithoutContentType,
    });

    if (!response.ok) {
      // Handle 401 Unauthorized (token expired)
      if (response.status === 401) {
        handleUnauthorized();
        throw new Error('Your session has expired. Please log in again.');
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      console.error(`API Error [${endpoint}]:`, { status: response.status, errorData, errorMessage });
      throw new Error(errorMessage);
    }

    return response.json();
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle 401 Unauthorized (token expired)
      if (response.status === 401) {
        handleUnauthorized();
        throw new Error('Your session has expired. Please log in again.');
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      console.error(`API Error [${endpoint}]:`, { status: response.status, errorData, errorMessage });
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Handle network errors (failed to fetch)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to server. Please check if the backend is running at ${API_BASE_URL}`);
    }
    throw error;
  }
}

