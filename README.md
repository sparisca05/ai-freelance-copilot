# AI Freelance Copilot

## Market Niche

AI Freelance Copilot targets independent freelancers and solo agencies who apply to client projects on marketplaces such as Upwork, Fiverr, or direct inbound channels.

This niche has a repeated workflow problem:

- Evaluate many job posts quickly
- Decide if a project is worth pursuing
- Write personalized proposals under time pressure

The product's value proposition is speed plus consistency: it turns a raw job post into a structured opportunity assessment and a proposal draft tailored to the freelancer profile.

Main outcomes for this niche:

- Faster application turnaround
- More consistent proposal quality
- Better pre-sales discovery via suggested client questions
- Reusable proposal history for future opportunities

## Architecture

The application uses a client-server architecture with external AI and identity services.

### High-Level Components

- Frontend app (React + TypeScript): UI for authentication, profile, proposal generation, and history.
- Backend API (FastAPI): authentication enforcement, business logic, OpenAI orchestration, and persistence.
- PostgreSQL: stores jobs, proposals, and user profiles.
- Supabase Auth: identity provider issuing JWTs used for backend authorization.
- OpenAI API: generates proposal text and job analysis metadata.

### Request Flow

1. User signs in on the frontend through Supabase.
2. Frontend receives access token and calls backend endpoints using Bearer auth.
3. Backend validates JWT against Supabase JWKS.
4. User profile and job data are loaded from PostgreSQL.
5. Backend sends a structured prompt to OpenAI.
6. OpenAI returns JSON with proposal and analysis fields.
7. Backend stores proposal data and returns it to frontend.
8. Frontend renders proposal details and updates history.

### Data Model (Core Tables)

- profiles: freelancer identity and capabilities (headline, skills, role, bio).
- jobs: imported or pasted opportunities per user.
- proposals: generated outputs linked to user and job.

### Security and Controls

- JWT verification using Supabase JWKS.
- User-scoped data access by token subject.
- CORS restricted by configured frontend origin.
- Basic in-memory rate limit on generation endpoint.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Supabase client

### Backend

- Python
- FastAPI
- SQLAlchemy
- psycopg2 / PostgreSQL
- python-jose
- requests
- openai SDK

### Infrastructure and Integrations

- Supabase Auth (JWT issuing)
- PostgreSQL database
- OpenAI chat completions (JSON response format)

### Runtime and Tooling

- Node.js 18+
- Python 3.10+
- Uvicorn ASGI server

## AI Estimation Usage

Estimated AI-generated contribution in this project: 40% to 50%.