# Open Circle Frontend

Open Circle is a modern web application built with React, TypeScript, and a suite of powerful libraries to create a seamless user experience. This frontend project follows the Feature Sliced Design (FSD) architecture for better organization and maintainability.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Architecture](#architecture)
- [File Naming Conventions](#file-naming-conventions)

## 🛠️ Tech Stack

This project uses the following technologies:

- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router DOM 7** - Routing
- **TanStack React Query 5** - Data fetching and state management
- **Axios** - HTTP client
- **Zustand 5** - State management
- **React Hook Form 7** - Form handling
- **Zod 4** - Schema validation
- **React Toastify 11** - Toast notifications
- **Date-fns 4** - Date utilities
- **React Dropzone** - File upload
- **Vite 7** - Build tool and development server

## 🗂️ Project Structure

The project follows the Feature Sliced Design (FSD) architecture:

```
src/
├── app/                # Application entry point and global providers
│   ├── routes/         # Routing configuration
│   └── main.tsx        # Main entry point
├── assets/             # Static assets (images, icons, etc.)
├── features/           # Feature modules
│   ├── auth/           # Authentication feature
│   ├── calendar/       # Calendar feature
│   ├── comments/       # Comments feature
│   ├── home/           # Home feature
│   ├── landing/        # Landing page feature
│   └── main/           # Main application features
│   └── notification/   # Notification features
│   └── share/          # Share events/posts features
├── layouts/            # Layout components
├── pages/              # Page components
├── shared/             # Shared utilities, components, and hooks
│   ├── api/            # API configuration
│   ├── components/     # Shared UI components
│   ├── constants/      # Constants
│   ├── enums/          # Enumerations
│   ├── hooks/          # Custom hooks
│   ├── store/          # Global state management
│   └── utils/          # Utility functions
```

Each feature is organized into the following structure:

```
feature/
├── components/         # Feature-specific components
├── lib/                # API and utility functions
├── model/              # TanStack Query hooks and state management
├── schema/             # TypeScript types and Zod schemas
└── ui/                 # Main UI components for the feature
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/llwyd-bot123/opencircle-frontend.git
cd open-cicle-frontend
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on the `.env.example`

```bash
cp env.example .env
```

### Running the Application

1. Start the development server

```bash
npm run dev
# or
yarn dev
```

2. Build for production

```bash
npm run build
# or
yarn build
```

## 🏗️ Architecture

The project follows the Feature Sliced Design (FSD) architecture, which organizes code into slices based on features and layers:

- **Features**: Independent domains/modules (auth, comments, etc.)
- **Shared**: Global reusable utilities, hooks, UI, and constants
- **Layouts**: Parent layout components (auth, landing, main)
- **Pages**: Route-level page components

### API Payload Format

All API requests send data as FormData instead of JSON. A shared helper function (`objectToFormData`) is used to convert plain objects into FormData. This ensures backend compatibility while keeping higher layers (model/ui) decoupled from the payload format.

## 📝 File Naming Conventions

- **PascalCase** for React components (e.g., `LoanFormModal.tsx`)
- **camelCase** for utilities, hooks, and functions (e.g., `useLoanQuery.ts`, `fetchLoans.ts`)
- **Feature-prefixed filenames** when imported across features (e.g., `loan.api.ts`, `employee.queries.ts`)
- **index.ts** for re-exports inside components/ and ui/ folders
