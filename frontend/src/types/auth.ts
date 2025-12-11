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

