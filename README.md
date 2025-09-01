# Mosaic Paths - Portfolio & Blog Platform

A modern, full-stack portfolio and blog management system built with React, TypeScript, and Node.js. Features a responsive design, admin portal for content management, and a RESTful API backend.

## 🌟 Live Demo

- **Frontend**: [https://blog-management-ashen.vercel.app](https://blog-management-ashen.vercel.app)
- **Admin Portal**: [https://blog-management-ashen.vercel.app/admin](https://blog-management-ashen.vercel.app/admin)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### Frontend Features
- **Modern Portfolio Layout**: Clean, responsive design with hero section, about, and contact information
- **Dynamic Blog System**: Browse, search, and read blog posts with rich content
- **Project Showcase**: Display projects with detailed information, tech stacks, and live/GitHub links
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Theme toggle with system preference detection
- **SEO Optimized**: Proper meta tags and semantic HTML structure

### Admin Panel Features
- **Secure Authentication**: JWT-based admin login system
- **Content Management**: Full CRUD operations for blog posts and projects
- **File Upload**: Image upload functionality for blog posts and projects
- **Dashboard Analytics**: Overview of content statistics
- **Real-time Updates**: React Query for efficient data synchronization
- **Form Validation**: Comprehensive form validation with error handling

### Backend Features
- **RESTful API**: Clean API architecture with proper HTTP status codes
- **Database Integration**: Prisma ORM with SQLite database
- **Authentication & Authorization**: JWT tokens with role-based access
- **File Upload Handling**: Multer integration for image uploads
- **Security Features**: CORS, Helmet, Rate limiting, Input validation
- **Error Handling**: Comprehensive error handling and logging

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for authentication state
- **Data Fetching**: TanStack React Query for server state management
- **Routing**: React Router DOM for client-side routing
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with validation

### Backend
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) with bcrypt password hashing
- **File Upload**: Multer for handling multipart/form-data
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Express Validator for input validation

### Development Tools
- **Package Manager**: npm/bun
- **Code Quality**: ESLint for linting
- **Version Control**: Git with GitHub
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 📁 Project Structure

```
mosaic-paths/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   └── server.ts         # Express app configuration
│   ├── prisma/               # Database schema and migrations
│   │   ├── schema.prisma     # Prisma schema
│   │   └── seed.ts           # Database seeding
│   └── uploads/              # File upload storage
├── src/                       # React frontend
│   ├── components/           # React components
│   │   ├── admin/           # Admin panel components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components
│   └── types/               # TypeScript types
├── public/                   # Static assets
└── docs/                    # Documentation
```

## 🔌 API Routes

### Authentication Routes (`/api/auth`)
- `POST /login` - Admin login
- `POST /register` - User registration
- `POST /logout` - User logout

### Blog Routes (`/api/blog`)
- `GET /` - Get all published blog posts
- `GET /:slug` - Get single blog post by slug
- `POST /` - Create new blog post (Admin only)
- `PUT /:id` - Update blog post (Admin only)
- `DELETE /:id` - Delete blog post (Admin only)

### Project Routes (`/api/projects`)
- `GET /` - Get all projects
- `GET /:slug` - Get single project by slug
- `POST /` - Create new project (Admin only)
- `PUT /:id` - Update project (Admin only)
- `DELETE /:id` - Delete project (Admin only)

### Item Routes (`/api/items`)
- `GET /` - Get all content items
- `GET /:type` - Get items by type (blog/project)
- `POST /` - Create new item (Admin only)

### Upload Routes (`/api/upload`)
- `POST /image` - Upload image file (Admin only)
- `DELETE /:filename` - Delete uploaded file (Admin only)

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Aryaman129/Blog-management.git
cd Blog-management
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Apply database migrations
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. **Set up environment variables** (see below)

6. **Start development servers**

In the backend directory:
```bash
npm run dev
```

In the root directory (for frontend):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000

## 🔐 Environment Variables

### Backend (.env)
```env
# Environment
NODE_ENV=development
PORT=8000

# Database
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Upload Settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5000000

# CORS
CORS_ORIGIN=http://localhost:8080
```

### Frontend (.env.local)
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
```

### Production Environment Variables

For deployment, update the environment variables:

**Backend (Render):**
```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=file:./prod.db
PORT=8000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

**Frontend (Vercel):**
```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

## 📖 Usage

### Default Admin Account
- **Email**: admin@example.com
- **Password**: admin123

### Admin Panel Access
1. Navigate to `/admin`
2. Login with admin credentials
3. Access the dashboard to manage content

### Content Management
- **Blog Posts**: Create, edit, and publish blog posts with rich content
- **Projects**: Showcase projects with descriptions, tech stacks, and links
- **File Uploads**: Upload images for blog posts and projects
- **Analytics**: View content statistics and engagement

## 🌐 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set the environment variable: `VITE_API_URL`
3. Deploy automatically on git push

### Render (Backend)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set Root Directory to `backend`
4. Configure environment variables
5. Deploy with automatic builds

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [https://github.com/Aryaman129/Blog-management](https://github.com/Aryaman129/Blog-management)
- **Issues**: [https://github.com/Aryaman129/Blog-management/issues](https://github.com/Aryaman129/Blog-management/issues)
- **Lovable Project**: [https://lovable.dev/projects/773ff196-4a7e-4196-88bb-d037d3dcac9e](https://lovable.dev/projects/773ff196-4a7e-4196-88bb-d037d3dcac9e)

## ⚡ Quick Start for Developers

```bash
# Clone and setup
git clone https://github.com/Aryaman129/Blog-management.git
cd Blog-management

# Install all dependencies
npm install && cd backend && npm install && cd ..

# Setup database
cd backend && npm run db:generate && npm run db:push && npm run db:seed && cd ..

# Start development
npm run dev & cd backend && npm run dev
```

---

**Built with ❤️ by [Aryaman129](https://github.com/Aryaman129)**
