# JobCenter 🚀

> A modern, production-ready job search and recruitment platform built with React, TypeScript, and Vite. Features comprehensive job search, application management, and company dashboards with enterprise-grade code quality and accessibility.

> **📚 New to the project?** Check out [DEVELOPER_GUIDELINES.md](./DEVELOPER_GUIDELINES.md) for architecture principles, coding standards, and best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.7-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Private-red.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture & Technical Decisions](#-architecture--technical-decisions)
- [Development Highlights](#-development-highlights)
- [Build & Deployment](#-build--deployment)
- [Developer Guidelines](#-developer-guidelines)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Job Seekers

- 🔍 **Advanced Job Search** - Search with filters (location, industry, experience level, job type)
- 📝 **Job Applications** - Streamlined application process with resume upload and cover letter
- 👤 **Profile Management** - Complete profile setup with CV management, portfolio, and media uploads
- ⭐ **Saved Jobs** - Bookmark interesting positions for later review
- 📊 **Application Tracking** - Track all applications with status updates (pending, reviewing, shortlisted, interview, accepted, rejected)
- 🎯 **User Dashboard** - Overview of applications, saved jobs, and profile completion status

### For Employers

- 🏢 **Company Dashboard** - Comprehensive dashboard with job posting management
- 📢 **Job Posting** - Create and manage job listings with detailed requirements and qualifications
- 📥 **Application Management** - View and manage job applications from candidates
- 📈 **Analytics** - Track job views and application statistics
- 🏛️ **Company Profile** - Showcase company information to potential candidates

### Technical Features

- ⚡ **Route-based Code Splitting** - Optimized bundle size with lazy loading
- 🎨 **Accessible UI** - WCAG AA compliant with keyboard navigation and screen reader support
- 🔒 **Production-Ready** - Error boundaries, request cancellation, and production-safe logging
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🎯 **Type-Safe** - Full TypeScript coverage with strict mode enabled
- ⚡ **Performance Optimized** - Memoization, code splitting, and optimized context providers

---

## 🛠️ Tech Stack

### Core Framework

- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.9.3** - Type-safe development with strict mode
- **Vite 7.2.7** - Next-generation frontend build tool

### UI & Styling

- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **shadcn/ui** - High-quality component library built on Radix UI
- **Lucide React** - Beautiful, customizable icons

### State Management & Data

- **React Context API** - Global state management (Auth, User, Job, Company contexts)
- **React Hook Form 7.65.0** - Performant forms with easy validation
- **Zod 4.1.12** - Schema validation with TypeScript inference

### Routing & Navigation

- **React Router DOM 7.10.1** - Declarative routing with protected routes

### HTTP Client

- **Axios 1.13.2** - Promise-based HTTP client with interceptors

### Notifications

- **Sonner 2.0.7** - Toast notifications

---

## 📸 Screenshots

> **Note:** Screenshots can be added here. Key pages to showcase:
>
> - Job search page with filters
> - User dashboard with applications
> - Company dashboard with job management
> - Profile management interface
> - Job application form

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm**, **yarn**, or **pnpm**
- A code editor (VS Code recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd JobCenterSite
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api

   # Google OAuth (Optional - only if using Google login)
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

   > **Note:** See `.env.example` for a template. The application works with mock data if no backend is available.

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The application will be available at `http://localhost:5173`

### Usage

#### Mock Authentication

The application currently uses mock authentication for demonstration. You can:

1. **Sign Up** - Create a new account (mock data stored in localStorage)
2. **Log In** - Use any email/password combination (mock authentication)
3. **Explore Features** - Navigate through job search, applications, and profile management

#### Navigation

- **Public Routes:** Job search (`/jobs`), Companies (`/companies`), Job details
- **User Routes:** Dashboard (`/user-dashboard`), Applications, Saved Jobs, Profile Management
- **Company Routes:** Company Dashboard (`/company-dashboard`), Job Posting, Application Management

#### Testing Features

1. **Job Search** - Browse jobs, apply filters, save jobs, view details
2. **Application Flow** - Apply to jobs, track application status
3. **Profile Management** - Complete profile, upload CV, manage portfolio
4. **Company Features** - Post jobs, manage applications (switch to company account)

---

## 📁 Project Structure

```
JobCenterSite/
├── src/
│   ├── assets/              # Static assets (images, fonts)
│   ├── components/          # React components
│   │   ├── common/         # Shared components (Header, Footer, Sidebar, ErrorBoundary)
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   └── [feature]/      # Feature-specific components
│   ├── constants/          # Application constants (API endpoints, storage keys)
│   ├── context/            # React Context providers (Auth, User, Job, Company)
│   ├── data/               # Mock data and TypeScript models
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library configurations and utilities
│   │   ├── validation/     # Zod validation schemas
│   │   └── logger.ts       # Production-safe logging utility
│   ├── pages/              # Page components (route-level)
│   │   ├── auth/          # Authentication pages
│   │   ├── user/          # User-specific pages
│   │   ├── company/       # Company-specific pages
│   │   └── public/        # Public pages
│   ├── routes/             # Route configuration
│   ├── services/           # API service layer
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
├── public/                 # Public assets
├── .env.example            # Environment variables template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.mjs     # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

---

## 🏗️ Architecture & Technical Decisions

### Architecture Overview

The application follows a **layered architecture** with clear separation of concerns:

1. **Presentation Layer** (`components/`, `pages/`)

   - React components organized by feature
   - Pages as route-level components
   - Reusable UI components from shadcn/ui

2. **State Management Layer** (`context/`)

   - React Context API for global state
   - Separate contexts for Auth, User, Job, and Company domains
   - Memoized context values for performance optimization

3. **Service Layer** (`services/`)

   - Centralized API client with interceptors
   - Service modules for each domain (auth, user, job, company)
   - Request cancellation support for cleanup

4. **Data Layer** (`data/`, `constants/`)
   - TypeScript models and interfaces
   - Mock data for development
   - Constants for API endpoints and configuration

### Key Technical Decisions

#### 1. **Mock Data Strategy**

- **Decision:** Use mock data stored in localStorage during development
- **Reasoning:** Allows frontend development to proceed independently of backend
- **Implementation:** All service methods are structured to easily switch from mock to real API calls
- **Future:** Service layer is ready for backend integration - simply uncomment API calls in service files

#### 2. **Context API over Redux**

- **Decision:** Use React Context API instead of Redux
- **Reasoning:**
  - Simpler state management for this application's needs
  - Less boilerplate code
  - Built-in React solution, no additional dependencies
  - Contexts memoized to prevent unnecessary re-renders

#### 3. **Route-based Code Splitting**

- **Decision:** Implement lazy loading for all routes
- **Reasoning:**
  - Reduces initial bundle size
  - Improves first load performance
  - Better user experience with faster page loads
- **Implementation:** All routes use `React.lazy()` with `Suspense` boundaries

#### 4. **React Hook Form + Zod Validation**

- **Decision:** Use React Hook Form with Zod schemas
- **Reasoning:**
  - Better performance than controlled components
  - Type-safe validation with Zod
  - Centralized validation schemas
  - Automatic error handling and accessibility

#### 5. **Production-Safe Logging**

- **Decision:** Custom logger utility that only logs in development
- **Reasoning:**
  - Prevents console pollution in production
  - Easy to integrate with error tracking services (Sentry, LogRocket)
  - Maintains debugging capability in development

#### 6. **Error Boundaries**

- **Decision:** Implement error boundaries at route group level
- **Reasoning:**
  - Prevents entire app crash from component errors
  - User-friendly error messages
  - Stack traces hidden in production for security

---

## 🎯 Development Highlights

### Phase 1: Code Splitting & Performance

- ✅ Route-based code splitting with `React.lazy()` and `Suspense`
- ✅ Custom `RouteLoader` component for loading states
- ✅ Optimized bundle size with lazy-loaded routes

### Phase 2: Forms, Error Handling & Loading

- ✅ Form validation refactor: All forms use React Hook Form + Zod
- ✅ Centralized validation schemas in `src/lib/validation/schemas.ts`
- ✅ Request cancellation with `AbortController` for cleanup
- ✅ Error boundaries for route groups (auth, user, company)
- ✅ Skeleton loaders replacing spinner-only loading states

### Phase 3: Accessibility & UX Polish

- ✅ Skip-to-content link for keyboard navigation
- ✅ Image lazy loading and proper alt text
- ✅ Form accessibility: proper labels, aria-describedby, keyboard navigation
- ✅ Keyboard navigation in modals/dialogs (via Radix UI)
- ✅ WCAG AA compliant color contrast

### Production Hardening

- ✅ Production-safe logging (no console pollution)
- ✅ Context providers optimized with `useMemo`
- ✅ Error boundaries hide stack traces in production
- ✅ Environment variables safely accessed with fallbacks
- ✅ Security: XSS prevention, safe dangerouslySetInnerHTML usage
- ✅ TypeScript strict mode enabled
- ✅ Build optimizations: tree-shaking, minification, hash-based file naming

### Technical Challenges & Solutions

1. **Challenge:** Preventing unnecessary re-renders in Context providers

   - **Solution:** Memoized context values with `useMemo`, wrapped callbacks with `useCallback`

2. **Challenge:** Handling form validation across many forms

   - **Solution:** Centralized Zod schemas, React Hook Form integration, reusable form components

3. **Challenge:** Request cleanup on component unmount

   - **Solution:** AbortController integration in service layer, cleanup in useEffect

4. **Challenge:** Production console pollution

   - **Solution:** Custom logger utility with environment-based logging

5. **Challenge:** Accessibility compliance
   - **Solution:** Comprehensive audit, proper ARIA attributes, keyboard navigation, skip links

---

## 🔨 Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

The production build output is in the `dist/` directory, optimized and ready for deployment.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

### Deployment

The application is a static SPA and can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**
- Any static file hosting service

**Environment Variables:** Make sure to set `VITE_API_BASE_URL` in your hosting platform's environment variables.

See `PRODUCTION_CHECKLIST.md` for detailed production deployment information.

---

## 💡 Interview Discussion Points

### Architecture & Design

- **Layered Architecture:** Explain the separation between presentation, state, service, and data layers
- **Context API Choice:** Discuss why Context API was chosen over Redux for this project
- **Service Layer Pattern:** Explain the centralized API client and service modules

### Performance Optimizations

- **Code Splitting:** Route-based lazy loading strategy and benefits
- **Memoization:** Context provider optimization and when to use `useMemo`/`useCallback`
- **Bundle Optimization:** Tree-shaking, minification, and chunk splitting

### Code Quality & Best Practices

- **TypeScript Strict Mode:** Benefits of strict typing and type safety
- **Form Validation:** React Hook Form + Zod pattern and centralized schemas
- **Error Handling:** Error boundaries strategy and production error management

### Accessibility

- **WCAG Compliance:** Accessibility features implemented (keyboard nav, ARIA, contrast)
- **Progressive Enhancement:** Ensuring functionality without JavaScript

### Production Readiness

- **Logging Strategy:** Production-safe logging and error tracking integration
- **Security Considerations:** XSS prevention, token handling, CSP readiness
- **Monitoring & Debugging:** Error boundaries, logging, and production debugging strategies

### Technical Decisions

- **Mock Data Strategy:** How frontend development proceeded independently
- **State Management:** Context API trade-offs and optimization strategies
- **Build Tool:** Why Vite over Create React App or Next.js

---

## 🤝 Contributing

This is a private project. For questions, suggestions, or issues, please contact the project maintainer.

---

## 📚 Developer Guidelines

This project follows strict architectural principles to ensure maintainability and scalability. All developers should familiarize themselves with our guidelines before contributing.

### Key Documents

- **[DEVELOPER_GUIDELINES.md](./DEVELOPER_GUIDELINES.md)** - Complete developer guide covering:
  - Architecture principles and separation of concerns
  - Directory structure rules
  - Coding standards and best practices
  - How to add new features
  - Code review checklist
  - Common patterns and anti-patterns

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed folder structure documentation

- **[PROJECT_MECHANISMS.md](./PROJECT_MECHANISMS.md)** - Technical mechanisms and patterns

- **[ARCHITECTURAL_COMPLIANCE_SUMMARY.md](./ARCHITECTURAL_COMPLIANCE_SUMMARY.md)** - Architecture audit results

### Backend Integration

- **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)** - Complete backend integration guide:
  - API endpoint requirements and specifications
  - Data transformation requirements
  - Migration checklist
  - Testing strategy
  - Error handling

- **[API_ENDPOINTS_REFERENCE.md](./API_ENDPOINTS_REFERENCE.md)** - Quick reference for backend developers:
  - All API endpoints in table format
  - Authentication requirements
  - Request/response examples

- **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** - Environment configuration guide:
  - `.env` file setup
  - Configuration options
  - Security notes

- **[BACKEND_INTEGRATION_SUMMARY.md](./BACKEND_INTEGRATION_SUMMARY.md)** - Quick summary and next steps

### Quick Start for Developers

1. **Read the Guidelines:** Start with [DEVELOPER_GUIDELINES.md](./DEVELOPER_GUIDELINES.md)
2. **Understand Architecture:** Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. **Follow Patterns:** Check [PROJECT_MECHANISMS.md](./PROJECT_MECHANISMS.md)
4. **Code Review:** Use the checklist in DEVELOPER_GUIDELINES.md

### Key Principles

- ✅ **Separation of Concerns:** Each directory has a single responsibility
- ✅ **Single Source of Truth:** Configuration → `constants/`, Models → `models/`, Data → `mocks/`
- ✅ **Type Safety:** All constants and data structures are properly typed
- ✅ **No Magic Strings:** Use constants instead of hardcoded strings
- ✅ **Data Flow:** Component → Hook → Service → Data Source

---

## 📄 License

Private project - All rights reserved

---

## 👤 Author

Built with ❤️ for modern job recruitment

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the excellent component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Vite](https://vitejs.dev/) for the amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Note:** This application is currently using mock data for demonstration purposes. The service layer is structured and ready for backend integration. See service files for commented API call examples.
