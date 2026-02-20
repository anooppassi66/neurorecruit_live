# Neurocruit - Job Platform

A full-stack job platform built with Next.js (frontend) and Express.js + MongoDB (backend).

## Features

### Authentication & Authorization
- User registration and login with JWT tokens
- Private routes - my-profile page requires authentication
- Automatic redirects for authenticated/unauthenticated users
- Secure logout functionality
- Password hashing with bcrypt

### Profile Management
- Complete user profile with personal information, skills, experience, education, and projects
- Editable profile sections
- Resume upload functionality
- Job preferences management

## User Flow

1. **Landing Page**: Visitors see the main site, automatically redirected to profile if already logged in
2. **Authentication**: Users register or login via the /join-now page
3. **Profile Access**: After authentication, users are redirected to /my-profile
4. **Profile Management**: Users can view and edit their complete profile information
5. **Logout**: Users can logout from the header, clearing authentication

## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui components

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up environment variables

Create `.env` file in the `server` directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/neurocruit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start MongoDB (if running locally)
```bash
brew services start mongodb-community@7.0
```

5. Start the backend server
```bash
cd server
npm start
```

6. Start the frontend (in a new terminal)
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/resume` - Upload resume
- `DELETE /api/profile/resume` - Delete resume

### Request Examples

#### Register
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Update Profile
```bash
curl -X PUT http://localhost:5001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"fullName":"John Doe","headline":"Software Developer"}'
```

## Project Structure

```
neurocruit/
├── app/                    # Next.js app directory
│   ├── join-now/          # Authentication pages
│   ├── my-profile/        # Profile management page
│   └── ...
├── components/            # Reusable UI components
├── server/                # Express.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   └── server.js         # Main server file
├── public/                # Static assets
└── ...
```

## Database Schema

### User
- name: String
- email: String (unique)
- password: String (hashed)
- createdAt: Date

### Profile
- user: ObjectId (ref: User)
- fullName: String
- headline: String
- location: String
- email: String
- phone: String
- linkedin: String
- portfolio: String
- dateOfBirth: Date
- nationality: String
- professionalSummary: String
- languages: [{ language: String, proficiency: String }]
- designTools: [String]
- technicalSkills: [String]
- softSkills: [String]
- experience: [{ role, company, location, duration, summary, achievements }]
- education: [{ degree, institution, duration, gpa, coursework }]
- projects: [{ title, description, tags, githubLink, liveLink }]
- jobPreferences: { desiredRole, expectedSalary, preferredLocations, availability }
- resume: { filename, originalName, mimetype, size, uploadDate }
- activity: { applicationsSent, profileViews, interviewInvites, savedJobs }

## Development

### Running Tests
```bash
cd server
node test.js
```

### Building for Production
```bash
# Build frontend
npm run build

# Backend is ready for production as-is
cd server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.