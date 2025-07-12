# ReWear - Sustainable Fashion Marketplace

## Overview

ReWear is a sustainable fashion marketplace built as a full-stack web application that enables users to buy, sell, and exchange pre-loved clothing. The platform focuses on reducing fashion waste while providing a user-friendly interface for conscious consumers to discover unique styles and monetize their unused clothing items.

## Recent Changes (January 12, 2025)

✓ **Complete Product Management System**: Added comprehensive product creation page with form validation, image URL support, and category selection
✓ **Enhanced Admin Panel**: Built full admin interface with user management, product moderation, and platform analytics
✓ **API Expansion**: Added complete CRUD operations for products, users, and admin functions
✓ **Sample Data Integration**: Populated platform with realistic sample users and products for demonstration
✓ **Navigation Enhancement**: Updated navigation to include product creation and dashboard links
✓ **Responsive Admin Interface**: Created tabbed admin sections for users, listings, reports, and settings management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints under `/api` prefix

### Development Setup
- **Monorepo Structure**: Client, server, and shared code in separate directories
- **Hot Reload**: Vite middleware integrated with Express in development
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`)

## Key Components

### Database Schema (`shared/schema.ts`)
- **Users**: Authentication, profiles, ratings, and admin flags
- **Products**: Clothing items with detailed metadata (size, condition, brand, etc.)
- **Categories**: Product categorization system
- **Orders**: Transaction management between buyers and sellers
- **Messages**: Communication system between users
- **Favorites**: User wishlist functionality
- **Reviews**: Rating and feedback system

### Authentication System
- Email/password based authentication
- User registration with profile information
- Admin role management
- Session-based authentication with PostgreSQL storage

### Product Management
- Comprehensive product listing with image support
- Advanced filtering (category, condition, price, size)
- Search functionality
- View tracking and featured items
- Status management (active, sold, pending)

### User Interface
- Responsive design with mobile-first approach
- Dark/light theme support via CSS variables
- Accessible components using Radix UI primitives
- Toast notifications for user feedback
- Loading states and error handling

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle authentication, validation, and business logic
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Flow**: JSON responses with proper error handling and status codes
5. **State Updates**: TanStack Query manages cache invalidation and optimistic updates

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

### UI and Styling
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production
- **@replit/***: Replit-specific development plugins

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle Kit handles schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment flag (development/production)
- **REPL_ID**: Replit-specific environment detection

### Production Setup
- Single Node.js process serving both API and static files
- Express serves built React app for non-API routes
- PostgreSQL database with connection pooling
- Session store configured for production persistence

### Development Features
- Hot module replacement via Vite
- TypeScript compilation checking
- Database schema push without migrations
- Replit integration for seamless development experience

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation between frontend and backend concerns. The shared schema ensures consistency across the full stack, and the monorepo structure facilitates rapid development and deployment.