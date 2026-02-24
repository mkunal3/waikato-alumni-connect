// User types matching backend schema
export type UserRole = 'student' | 'alumni' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  passwordUpdatedAt?: string | null;
  profilePhotoFilePath?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface ProfileResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    approvalStatus: ApprovalStatus;
    createdAt: string;
    passwordUpdatedAt?: string | null;
    studentId?: string;
    degree?: string;
    yearOfStudy?: number;
    graduationYear?: number;
    currentCompany?: string;
    currentPosition?: string;
    mentoringGoals?: string[];
    skillsOffered?: string[];
    skillsWanted?: string[];
    profileComplete?: number;
  };
}export interface MatchResponse {
  match: {
    id: number;
    status: string;
    matchScore?: number;
    matchReasons?: string[];
    confirmedAt?: string;
    student: {
      id: number;
      name: string;
      email: string;
    };
    alumni: {
      id: number;
      name: string;
      email: string;
      currentCompany?: string;
      currentPosition?: string;
    };
  };
}
