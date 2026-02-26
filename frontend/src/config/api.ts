// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  register: '/auth/register',
  registerAdmin: '/auth/register-admin',
  login: '/auth/login',
  me: '/auth/me',
  sendVerificationCode: '/auth/send-verification-code',
  changePassword: '/auth/change-password',
  registerAdminInvite: '/auth/register-admin',
  
  // Profile
  profile: '/profile',
  uploadProfilePhoto: '/users/me/profile-photo',
  deleteProfilePhoto: '/users/me/profile-photo',
  
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
  adminGetAdminInvitationCode: '/admin/admin-invitation-code',
  adminCreateAdminInvitationCode: '/admin/admin-invitation-code',
  adminCreateAdminInvite: '/admin/admin-invites',
  adminListPendingAdminInvites: '/admin/admin-invites/pending',
  adminCreateMatch: '/admin/matches/create',
  adminCancelMatch: (matchId: number) => `/admin/matches/${matchId}/cancel`,
  adminListAdmins: '/admin/admins',
  adminDeactivateAdmin: (adminId: number) => `/admin/admins/${adminId}/deactivate`,
  adminReactivateAdmin: (adminId: number) => `/admin/admins/${adminId}/reactivate`,
  adminDeactivateUser: (userId: number) => `/admin/users/${userId}/deactivate`,
  adminReactivateUser: (userId: number) => `/admin/users/${userId}/reactivate`,
  adminVerificationCodes: '/admin/verification-codes',
  adminDeleteVerificationCode: (id: number) => `/admin/verification-codes/${id}`,
  adminPasswordResetRequests: '/admin/password-reset-requests',
  adminDevPasswordResetCode: (email: string) => `/admin/dev/password-reset-code?email=${encodeURIComponent(email)}`,
  
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
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      
      // Handle 403 Forbidden - Account Inactive (forced logout)
      if (response.status === 403 && errorData.error === 'ACCOUNT_INACTIVE') {
        handleUnauthorized();
        throw new Error(errorData.message || 'Your account has been deactivated. Please log in again.');
      }
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        // For login endpoint, show the actual error message (e.g., "Invalid email or password")
        // For other endpoints, it's a session expiration
        if (endpoint === API_ENDPOINTS.login) {
          console.error(`API Error [${endpoint}]:`, { status: response.status, errorData, errorMessage });
          throw new Error(errorMessage);
        } else {
          // Token expired for authenticated endpoints
          handleUnauthorized();
          throw new Error('Your session has expired. Please log in again.');
        }
      }
      
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
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      
      // Handle 403 Forbidden - Account Inactive (forced logout)
      if (response.status === 403 && errorData.error === 'ACCOUNT_INACTIVE') {
        handleUnauthorized();
        throw new Error(errorData.message || 'Your account has been deactivated. Please log in again.');
      }
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        // For login endpoint, show the actual error message (e.g., "Invalid email or password")
        // For other endpoints, it's a session expiration
        if (endpoint === API_ENDPOINTS.login) {
          console.error(`API Error [${endpoint}]:`, { status: response.status, errorData, errorMessage });
          throw new Error(errorMessage);
        } else {
          // Token expired for authenticated endpoints
          handleUnauthorized();
          throw new Error('Your session has expired. Please log in again.');
        }
      }
      
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

