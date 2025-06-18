# Contact Management System - Frontend

A comprehensive admin dashboard built with React, TypeScript, and Vite for managing contacts, users, roles, and permissions.

## Features

- **User Management**: Create, view, update, and delete users
- **Role-Based Access Control**: Assign permissions via roles
- **Contact Management**: Full CRUD operations for contacts
- **Audit Logs**: Track changes across the system
- **Responsive UI**: Works on desktop and mobile devices
- **Authentication**: Secure login and protected routes

## Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Components**: Custom component library with:
  - Data tables
  - Forms
  - Modals
  - Navigation
- **State Management**: React Context + Custom Hooks
- **Styling**: CSS Modules
- **API Client**: Axios

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature modules
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── public/               # Static assets
└── tests/                # Test files
```

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development Conventions

1. **File Naming Patterns**:
   - Component hooks: `ComponentName.hooks.tsx`
   - Component types: `ComponentName.types.ts`
   - Constants: `ComponentName.constants.ts`
   - Feature-specific files follow same pattern (e.g., `ContactList.hooks.tsx`)

2. **Code Organization**:
   - Keep business logic in custom hooks
   - Separate UI from logic where possible
   - Types should be colocated with components when component-specific
   - Shared types go in `src/types/`

3. **Development Notes**:
   - The frontend expects a running backend server (see backend/README.md)
   - Environment variables should be configured in `.env` file
   - Follow the component structure pattern for new features
   - Use the existing hooks for data fetching and mutations

## Available Scripts

- `dev`: Start development server
- `build`: Build for production
- `preview`: Preview production build
- `lint`: Run ESLint
- `format`: Format code with Prettier
