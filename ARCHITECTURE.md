# Visual Python Learning Platform - Architecture

## Tech Stack
- Frontend: Next.js 15, React, TypeScript, Tailwind CSS
- Editor: Monaco Editor
- Python: Pyodide (WebAssembly)
- Database: PostgreSQL (Neon) with Prisma ORM
- Auth: Custom JWT-based

## Project Structure
```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
│   ├── ui/        # Base UI (Button, Input, Card)
│   ├── layout/    # Header, Sidebar, Footer
│   ├── editor/    # Code editor components
│   └── visualization/  # Memory, stack visuals
├── lib/           # Utilities
│   ├── auth/      # Authentication
│   ├── db/        # Database (Prisma)
│   └── python/    # Pyodide integration
├── hooks/         # Custom React hooks
├── types/         # TypeScript definitions
└── config/        # App configuration
```

## Data Flow
User Action -> React Component -> API Route -> Prisma -> Database

## Key Features
- Interactive Python IDE
- Step-by-step execution
- Real-time memory visualization
- Progress tracking with XP
- 24-chapter curriculum
