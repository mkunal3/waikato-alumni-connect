# Workflow Guide

## User Roles

The platform supports three user roles:

1. **Student** - Waikato students seeking mentorship
2. **Alumni** - Waikato alumni providing mentorship
3. **Admin** - Platform administrators managing the system

## Registration Workflow

### Student Registration

1. **Access Registration Page**
   - Navigate to `/student/register`

2. **Fill Registration Form**
   - First Name (required)
   - Last Name (required)
   - Student ID (required) - Unique identifier for students
   - Email (required) - Must be `@students.waikato.ac.nz`
   - Password (required) - Must meet requirements:
     - At least 8 characters
     - At least one uppercase letter
     - At least one special character
     - Cannot contain spaces, `<`, or `>`

3. **Submit Registration**
   - Account is created with `approvalStatus: "pending"`
   - Student can immediately log in
   - Student can access dashboard and edit profile
   - Student **cannot** browse mentors until admin approval

4. **Admin Approval Required**
   - Admin reviews student registration in Admin Dashboard
   - Admin can approve or reject the student
   - Once approved, student gains access to browse mentors and request matches

### Alumni Registration

1. **Access Registration Page**
   - Navigate to `/alumni/register`

2. **Fill Registration Form**
   - First Name (required)
   - Last Name (required)
   - Email (required)
   - Invitation Code (required) - Provided by admin
   - Password (required) - Same requirements as student

3. **Submit Registration**
   - Account is created with `approvalStatus: "approved"` (automatic)
   - Alumni can immediately log in and use all features
   - No admin approval needed for alumni

## Match Request Workflow

### Student Perspective

1. **Browse Available Mentors**
   - Student logs in (must be approved)
   - Navigates to "Browse Mentors" from dashboard
   - Views list of available alumni mentors
   - Can search and filter mentors

2. **Request Match**
   - Clicks "Request Match" on desired mentor
   - Writes a cover letter (minimum 100 characters)
   - Submits match request
   - Match status: `pending` (awaiting admin approval)

3. **Wait for Admin Approval**
   - Admin reviews the match request
   - Admin can see student info, alumni info, and cover letter
   - Admin approves or rejects the match

4. **Match Approved by Admin**
   - Match status changes to `confirmed`
   - Alumni receives notification in their dashboard
   - Match appears in alumni's "Pending Match Requests"

5. **Alumni Response**
   - Alumni reviews the match request
   - Alumni can accept or decline
   - If accepted: Match status becomes `accepted`, mentorship begins
   - If declined: Match is removed

### Alumni Perspective

1. **View Pending Requests**
   - Log in to Alumni Dashboard
   - Navigate to "Pending Match Requests"
   - See all matches approved by admin but not yet responded to

2. **Review Match Request**
   - Click on a pending request to see details:
     - Student information
     - Student profile
     - Cover letter from student
     - Match reasons (if any)

3. **Accept or Decline**
   - Accept: Match becomes active, student is notified
   - Decline: Match is removed, student is notified (future: email notification)

4. **View Active Mentees**
   - Access "My Mentees" section
   - See all students with active matches

### Admin Perspective

1. **Approve Student Registrations**
   - View "Pending Student Approvals" in dashboard
   - Review student information
   - Approve or reject student accounts

2. **Review Match Requests**
   - View "Pending Match Requests" in dashboard
   - See all student match requests awaiting approval
   - Review cover letters and student/alumni information
   - Approve or reject match requests

3. **View Active Matches**
   - See all confirmed and active matches
   - Monitor mentorship relationships

4. **Manage Invitation Codes**
   - Generate new invitation codes for alumni registration
   - View current active invitation code

## Account Approval Status Flow

### Students

- **Pending** → Can log in, can edit profile, **cannot** browse mentors
- **Approved** → Can log in, can edit profile, **can** browse mentors and request matches
- **Rejected** → Account is rejected (future: may restrict login)

### Alumni

- **Auto-approved** → No approval process needed
- Can use all features immediately after registration

## Feature Access Matrix

| Feature | Pending Student | Approved Student | Alumni | Admin |
|---------|----------------|------------------|--------|-------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Edit Profile | ✅ | ✅ | ✅ | ✅ |
| Browse Mentors | ❌ | ✅ | N/A | N/A |
| Request Match | ❌ | ✅ | N/A | N/A |
| View Match Requests | N/A | N/A | ✅ | ✅ |
| Accept/Decline Matches | N/A | N/A | ✅ | ✅ |
| Approve Students | N/A | N/A | N/A | ✅ |
| Approve Matches | N/A | N/A | N/A | ✅ |
| Manage Invitation Codes | N/A | N/A | N/A | ✅ |

## Data Flow Examples

### Example 1: Student Requests a Match

1. Student (approved) browses mentors
2. Student clicks "Request Match" on Alumni X
3. Student writes cover letter
4. Frontend: `POST /match/request` with `{ alumniId, coverLetter }`
5. Backend: Creates match with `status: "pending"`, stores cover letter
6. Admin sees match in "Pending Match Requests"
7. Admin approves match
8. Match status → `confirmed`
9. Alumni sees match in "Pending Match Requests"
10. Alumni accepts
11. Match status → `accepted`
12. Student and Alumni can now see each other in their dashboards

### Example 2: Student Registration and Approval

1. Student fills registration form
2. Frontend: `POST /auth/register` with `{ name, email, studentId, password, role: "student" }`
3. Backend: Creates user with `approvalStatus: "pending"`
4. Student can log in immediately
5. Student can access dashboard and edit profile
6. Student tries to browse mentors → Blocked with message
7. Admin reviews student in "Pending Student Approvals"
8. Admin approves student
9. Student's `approvalStatus` → `approved`
10. Student can now browse mentors and request matches

## Important Notes

1. **Student Registration**: No email verification required (simplified flow)
2. **Alumni Registration**: Requires invitation code from admin
3. **Cover Letter**: Required for all match requests, minimum 100 characters
4. **Match Approval**: Two-step process (admin approves, then alumni accepts)
5. **Profile Editing**: Available to all users regardless of approval status

