# Backend API Documentation

## Base URL
- Development: `http://localhost:4000`
- All API endpoints are prefixed with the base URL

## Authentication
All authenticated endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Authentication

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "alumni" | "admin"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "approvalStatus": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Missing required fields or invalid role
- `400`: User already exists
- `500`: Internal server error

---

#### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "approvalStatus": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Email and password are required
- `401`: Invalid email or password
- `500`: Authentication service unavailable

---

#### GET `/auth/me`
Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "approvalStatus": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized (missing or invalid token)
- `404`: User not found
- `500`: Internal server error

---

### 2. Matching

#### GET `/match/:menteeId`
Fetch a student mentee and return all approved alumni mentors as potential matches.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `menteeId`: Student user ID (integer)

**Response (200 OK):**
```json
{
  "mentee": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "approvalStatus": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "matches": [
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "alumni",
      "approvalStatus": "approved",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `400`: Invalid menteeId
- `400`: User is not a student
- `401`: Unauthorized
- `404`: Mentee not found
- `500`: Internal server error

---

### 3. Utility

#### GET `/`
Health check endpoint.

**Response (200 OK):**
```json
{
  "message": "Waikato Alumni Connect API is running"
}
```

---

#### GET `/users`
Debug endpoint to fetch all users (for development only).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "passwordHash": "...",
    "approvalStatus": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

## Data Models

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  role: "student" | "alumni" | "admin";
  passwordHash: string;  // Only in database, never returned in API responses
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
}
```

### JWT Token Payload
```typescript
{
  userId: number;
  email: string;
  role: string;
}
```

Token expires in 1 hour.

---

## Notes for Backend Team

### Current Implementation Status
- ✅ User registration with role selection
- ✅ User login with JWT token
- ✅ Authentication middleware
- ✅ User profile endpoint
- ✅ Matching endpoint for students

### Potential Future Enhancements (if needed)
- Token refresh endpoint
- Password reset functionality
- Email verification
- Role-based access control middleware for admin routes
- User profile update endpoint
- Logout endpoint (if needed for token blacklisting)

