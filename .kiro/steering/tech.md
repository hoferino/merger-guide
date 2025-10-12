# Technology Stack

## Core Technologies
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite (with SWC for fast compilation)
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM v6
- **State Management**: TanStack Query (React Query) for server state
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## Development Tools
- **Linting**: ESLint with TypeScript support
- **Package Manager**: npm (with Bun lockfile present)
- **Development Server**: Vite dev server on port 8080

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
- Use `@/` alias for src imports (configured in Vite and tsconfig)
- Components use `.tsx` extension
- Prefer named exports over default exports for components
- Use TypeScript strict mode

## Styling Conventions
- Use Tailwind utility classes
- Leverage CSS custom properties for theming
- Follow shadcn/ui component patterns
- Use `cn()` utility for conditional classes (from `@/lib/utils`)
- Responsive design with mobile-first approach

## Code Patterns
- Functional components with hooks
- Custom hooks for business logic (in `src/hooks/`)
- Mock data in `src/data/` for development
- Layout components for consistent page structure
- Supabase client configured with environment variables