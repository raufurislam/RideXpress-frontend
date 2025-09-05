# 🚗 RideExpress Frontend

<div align="center">

![RideExpress Logo](https://img.shields.io/badge/RideExpress-Frontend-orange?style=for-the-badge&logo=react)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-green?style=for-the-badge&logo=vercel)](https://rideexpress-frontend.vercel.app)

**A modern, secure ride-sharing platform for companies and universities**

[![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-cyan?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [🚀 Live Demo](#-live-demo)
- [📖 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#-technology-stack)
- [🏗️ Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔧 Development Setup](#-development-setup)
- [📱 User Roles & Permissions](#-user-roles--permissions)
- [🎨 UI/UX Features](#-uiux-features)
- [🔐 Authentication](#-authentication)
- [📊 State Management](#-state-management)
- [🌐 API Integration](#-api-integration)
- [📦 Build & Deployment](#-build--deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Live Demo

**🌐 [Visit Live Application](https://rideexpress-frontend.vercel.app)**

Experience the full ride-sharing platform with real-time features, secure authentication, and responsive design.

---

## 📖 Project Overview

RideExpress is a comprehensive ride-sharing platform designed specifically for companies and universities. It provides a secure, efficient, and user-friendly solution for connecting riders with drivers, featuring real-time ride tracking, fare calculation, and comprehensive admin management.

### 🎯 Key Objectives

- **Secure Transportation**: Provide safe ride-sharing for organizational communities
- **Cost Efficiency**: Enable cost-sharing among colleagues and students
- **Real-time Tracking**: Live ride monitoring and status updates
- **Multi-role Support**: Separate interfaces for riders, drivers, and administrators
- **Modern UX**: Intuitive, responsive design with dark/light theme support

---

## ✨ Features

### 🚗 **Rider Features**

- **Smart Ride Request**: Location-based pickup and destination selection with autocomplete
- **Real-time Fare Calculation**: Dynamic pricing based on distance and vehicle type
- **Live Ride Tracking**: Monitor active rides with real-time status updates
- **Ride History**: Complete history of past rides with detailed information
- **Driver Matching**: Automatic driver assignment based on availability and location
- **Payment Options**: Support for both online and cash payments

### 🛣️ **Driver Features**

- **Availability Management**: Toggle online/offline status with real-time updates
- **Ride Discovery**: Browse and filter available ride requests
- **Earnings Dashboard**: Track daily, weekly, and monthly earnings with analytics
- **Active Ride Management**: Accept, complete, and manage ongoing rides
- **Profile Management**: Update driver information and vehicle details
- **Performance Analytics**: Detailed insights into driving performance

### 👨‍💼 **Admin Features**

- **Analytics Dashboard**: Comprehensive platform statistics and insights
- **User Management**: Manage riders, drivers, and admin accounts
- **Ride Monitoring**: Oversee all rides with filtering and search capabilities
- **Driver Management**: Approve driver applications and manage driver status
- **Financial Reports**: Revenue tracking and financial analytics
- **System Configuration**: Platform settings and configuration management

### 🎨 **UI/UX Features**

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme switching with user preference persistence
- **Modern Components**: Built with Radix UI and custom design system
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Loading States**: Comprehensive loading indicators and skeleton screens

---

## 🛠️ Technology Stack

### **Frontend Core**

- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.2** - Lightning-fast build tool and dev server

### **Styling & UI**

- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Beautiful, customizable icons
- **Framer Motion** - Production-ready motion library
- **Next Themes** - Theme management and persistence

### **State Management**

- **Redux Toolkit 2.8.2** - Predictable state container
- **RTK Query** - Data fetching and caching solution
- **React Hook Form** - Performant forms with easy validation

### **Routing & Navigation**

- **React Router 7.8.0** - Declarative routing for React
- **Protected Routes** - Role-based access control

### **Form Handling & Validation**

- **React Hook Form 7.62.0** - Performant, flexible forms
- **Zod 4.0.17** - TypeScript-first schema validation
- **Hookform Resolvers** - Validation library integration

### **Data Visualization**

- **Recharts 3.1.2** - Composable charting library
- **Custom Tooltips** - Interactive data visualization

### **Development Tools**

- **ESLint** - Code linting and quality assurance
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite Plugin React** - React support for Vite

---

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (Navbar, Sidebar, etc.)
│   ├── modules/         # Feature-specific components
│   │   ├── Authentication/  # Login, Register, Google OAuth
│   │   ├── Driver/         # Driver-specific components
│   │   ├── homepage/       # Landing page sections
│   │   └── Profile/        # User profile components
│   └── ui/              # Base UI components (shadcn/ui)
├── pages/               # Route components
│   ├── Admin/           # Admin dashboard pages
│   ├── Driver/          # Driver dashboard pages
│   ├── Rider/           # Rider dashboard pages
│   └── public/          # Public pages (Home, About, etc.)
├── redux/               # State management
│   ├── features/        # Feature-specific API slices
│   └── store.ts         # Redux store configuration
├── routes/              # Route definitions and sidebar items
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── constants/           # Application constants
└── lib/                 # Third-party library configurations
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rideexpress-frontend.git
cd rideexpress-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun (recommended)
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=your_backend_api_url
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun dev
```

The application will be available at `http://localhost:3000`

---

## 🔧 Development Setup

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Using bun (faster)
bun dev              # Start development server
bun build            # Build for production
bun preview          # Preview production build
```

### Code Quality

- **ESLint**: Configured with React and TypeScript rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for pre-commit checks (if configured)

### Development Guidelines

1. **Component Structure**: Use functional components with TypeScript
2. **State Management**: Use Redux Toolkit for global state, local state for UI
3. **Styling**: Follow Tailwind CSS utility-first approach
4. **API Integration**: Use RTK Query for data fetching
5. **Type Safety**: Define proper TypeScript interfaces for all data

---

## 📱 User Roles & Permissions

### **Rider (RIDER)**

- Request rides with location selection
- View active rides and history
- Manage profile and settings
- Access to rider-specific dashboard

### **Driver (DRIVER)**

- Accept/reject ride requests
- Manage availability status
- View earnings and analytics
- Access to driver-specific dashboard

### **Admin (ADMIN)**

- Manage all users and rides
- View platform analytics
- Configure system settings
- Access to admin dashboard

### **Super Admin (SUPER_ADMIN)**

- Full system access
- User role management
- System configuration
- Advanced analytics

---

## 🎨 UI/UX Features

### **Design System**

- **Color Palette**: Consistent color scheme with dark/light mode support
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: 8px grid system for consistent spacing
- **Components**: Reusable component library with variants

### **Responsive Design**

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Proper touch targets and gestures

### **Accessibility**

- **WCAG 2.1 AA**: Compliant accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: Sufficient contrast ratios

---

## 🔐 Authentication

### **Authentication Methods**

- **Email/Password**: Traditional login with validation
- **Google OAuth**: Social login integration
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Protected routes based on user roles

### **Security Features**

- **Protected Routes**: Role-based route protection
- **Token Management**: Automatic token refresh
- **Form Validation**: Client-side and server-side validation
- **Input Sanitization**: XSS protection

---

## 📊 State Management

### **Redux Toolkit Setup**

- **Store Configuration**: Centralized state management
- **RTK Query**: Efficient data fetching and caching
- **Feature Slices**: Organized by feature modules
- **Type Safety**: Full TypeScript integration

### **State Structure**

```typescript
{
  auth: AuthState,           // Authentication state
  driver: DriverState,       // Driver-specific state
  ride: RideState,          // Ride management state
  admin: AdminState,        // Admin dashboard state
  api: ApiState            // RTK Query cache
}
```

---

## 🌐 API Integration

### **API Architecture**

- **Base Query**: Centralized API configuration
- **Error Handling**: Global error handling and retry logic
- **Caching**: Intelligent caching with RTK Query
- **Optimistic Updates**: Immediate UI updates

### **API Endpoints**

- **Authentication**: Login, register, OAuth callbacks
- **Rides**: Request, accept, complete, history
- **Drivers**: Profile, availability, earnings
- **Admin**: Analytics, user management, system config

---

## 📦 Build & Deployment

### **Production Build**

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

### **Deployment Options**

#### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### **Netlify**

```bash
# Build command
npm run build

# Publish directory
dist
```

#### **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### **Environment Variables**

```env
# Production
VITE_API_BASE_URL=https://api.rideexpress.com
VITE_GOOGLE_CLIENT_ID=your_production_client_id

# Development
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_dev_client_id
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### **1. Fork the Repository**

```bash
git fork https://github.com/your-username/rideexpress-frontend.git
```

### **2. Create a Feature Branch**

```bash
git checkout -b feature/amazing-feature
```

### **3. Make Your Changes**

- Follow the coding standards
- Add tests for new features
- Update documentation

### **4. Commit Your Changes**

```bash
git commit -m "Add amazing feature"
```

### **5. Push to Your Branch**

```bash
git push origin feature/amazing-feature
```

### **6. Open a Pull Request**

- Provide a clear description
- Link any related issues
- Request reviews from maintainers

### **Contribution Guidelines**

- **Code Style**: Follow ESLint configuration
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update README for significant changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives
- **Redux Team** - For predictable state management

---

<div align="center">

**Made with ❤️ by the RideExpress Team**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github)](https://github.com/your-username/rideexpress-frontend)
[![Issues](https://img.shields.io/badge/Issues-Report%20Bug-red?style=flat-square&logo=github)](https://github.com/your-username/rideexpress-frontend/issues)
[![Discussions](https://img.shields.io/badge/Discussions-Ask%20Question-blue?style=flat-square&logo=github)](https://github.com/your-username/rideexpress-frontend/discussions)

</div>
