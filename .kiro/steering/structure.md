# Project Structure

## Root Directory
```
├── src/                    # Main source code
├── public/                 # Static assets
├── supabase/              # Supabase configuration and functions
├── .kiro/                 # Kiro AI assistant configuration
└── config files           # Build and tooling configuration
```

## Source Structure (`src/`)

### Core Application
- `App.tsx` - Main app component with routing setup
- `main.tsx` - Application entry point
- `index.css` - Global styles and Tailwind imports
- `vite-env.d.ts` - Vite type definitions

### Components (`src/components/`)
- `ui/` - shadcn/ui components (accordion, button, card, etc.)
- `layouts/` - Layout components (ClientDashboardLayout, InternalDashboardLayout)
- `analysis/` - AI analysis related components
- `analysis-workflow/` - Multi-phase analysis workflow components
- Root level - Feature-specific components (DealOverview, DocumentManagement, etc.)

### Pages (`src/pages/`)
- Root level - Client-facing pages (Index, DocumentsPage, TimelinePage, etc.)
- `internal/` - Internal dashboard pages (InternalDashboard, AllDeals, DealDetail, etc.)

### Data & State (`src/`)
- `data/` - Mock data files (mockDeals.ts, mockClients.ts)
- `hooks/` - Custom React hooks for business logic
- `integrations/supabase/` - Supabase client and type definitions
- `lib/` - Utility functions (utils.ts with cn() helper)

## Routing Structure
- `/` - Redirects to internal dashboard
- `/client/*` - Client portal routes (wrapped in ClientDashboardLayout)
- `/internal/*` - Internal dashboard routes (wrapped in InternalDashboardLayout)

## Component Organization Patterns
- **Layout Components**: Provide consistent structure with sidebars and headers
- **Feature Components**: Business logic components (DealOverview, DocumentManagement)
- **UI Components**: Reusable shadcn/ui primitives
- **Page Components**: Route-level components that compose features

## File Naming Conventions
- Components: PascalCase (e.g., `DealOverview.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useDocumentManagement.tsx`)
- Data files: camelCase (e.g., `mockDeals.ts`)
- Pages: PascalCase (e.g., `InternalDashboard.tsx`)

## Import Patterns
- Use `@/` alias for all src imports
- Group imports: external libraries, then internal modules
- Prefer named imports over default imports for components