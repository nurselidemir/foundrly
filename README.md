# Foundrly

> **Turn ideas into teams.**

Foundrly is an AI-powered team formation platform built for founders, developers, designers, mentors, and startup enthusiasts.
It helps people build teams for startups, hackathons, university initiatives, and side projects by combining profile data, project intent, collaboration signals, and AI matching.

This repository currently includes:
- A Django + DRF backend
- A React + TypeScript + Tailwind frontend
- Dockerized local development setup
- Premium, verified talent, mentoring, messaging, project applications, and AI matching flows
- A redesigned premium landing experience and upgraded product surfaces inside the web app

---

## Product Overview

Foundrly is designed around one core idea:

**help serious builders find the right people faster.**

The platform matches people based on:
- technical skills
- interests
- project goals
- collaboration history
- profile quality and trust signals

Primary product flows currently implemented:
- authentication and registration
- public and private profile flows
- project creation and project discovery
- project applications
- messaging between matched collaborators
- premium subscription simulation
- verified talent request flow
- mentor marketplace and mentor requests
- admin moderation panel
- AI-powered match recommendations

---

## Current Status

The project is beyond a simple landing page demo.

Current web experience includes:
- premium futuristic marketing landing
- public discovery pages
- community and teammate discovery pages
- authenticated dashboard
- project management flows
- AI team builder flow
- profile and public profile flows
- mentoring flows
- admin/moderation flows

The frontend was recently upgraded with:
- a premium dark-mode marketing site
- improved discovery and community visuals
- onboarding signal capture in the dashboard
- richer profile presentation
- more polished AI match result cards

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 5 + Django REST Framework |
| Database | PostgreSQL 16 |
| Auth | JWT with `djangorestframework-simplejwt` |
| AI Matching | TF-IDF + cosine similarity + rule-based scoring |
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Motion | Framer Motion |
| App Server | Gunicorn |
| Containers | Docker + Docker Compose |

---

## Repository Structure

```text
foundrly-backend/
├── apps/
│   ├── users/
│   │   ├── management/commands/
│   │   ├── migrations/
│   │   └── ...
│   └── projects/
│       ├── migrations/
│       ├── services/
│       │   ├── matching.py
│       │   └── ai_matching.py
│       └── ...
├── config/
├── frontend/
│   ├── public/
│   └── src/
├── ios/
├── logo/
├── Dockerfile
├── docker-compose.yml
├── manage.py
├── proje.md
└── requirements.txt
```

Important directories:
- `apps/users/` → user model, auth, premium, verified talent, reviews, mentoring
- `apps/projects/` → projects, applications, messages, matching services
- `frontend/src/` → React app, public pages, dashboard flows
- `frontend/src/components/marketing/` → marketing landing components
- `ios/FoundrlyApp/` → SwiftUI source files for the iOS concept app

---

## Quick Start

### 1. Prepare environment

```bash
cp .env.example .env
```

### 2. Start the database

```bash
docker compose up -d db
```

### 3. Start backend

```bash
docker compose up -d web
```

When `web` starts, it automatically runs:
- `python manage.py migrate`
- `python manage.py collectstatic --noinput`

### 4. Start frontend

```bash
docker compose up -d frontend
```

### 5. Optional: seed demo data

```bash
docker compose exec web python manage.py seed_demo_data
```

---

## Service URLs

| Service | URL |
|---|---|
| Web App | http://localhost:3000 |
| Login | http://localhost:3000/#login |
| Register | http://localhost:3000/#register |
| Premium | http://localhost:3000/#premium |
| Django Admin | http://localhost:8000/admin/ |
| API Root | http://localhost:8000/api/ |
| Health Check | http://localhost:8000/api/health/ |
| PostgreSQL | `localhost:5433` |

---

## Docker Setup

This project uses three main services:
- `db` → PostgreSQL
- `web` → Django backend
- `frontend` → React frontend

### Docker Compose summary

- Backend runs on `8000`
- Frontend runs on `3000`
- PostgreSQL is exposed as `5433 -> 5432`

### Useful commands

```bash
docker compose ps
docker compose logs web
docker compose logs frontend
docker compose logs db
```

Full startup from scratch:

```bash
docker compose up --build
```

---

## Local Database Access

If you want to connect with DBeaver or another DB client:

### PostgreSQL connection settings

- Host: `localhost`
- Port: `5433`
- Database: `foundrly`
- Username: `foundrly`
- Password: `foundrly`

JDBC URL:

```text
jdbc:postgresql://localhost:5433/foundrly
```

If you see `connection refused`, it usually means the `db` container is not running yet.

---

## Demo Accounts

After running demo seed data:

```bash
docker compose exec web python manage.py seed_demo_data
```

You can use these accounts:

- Admin: `nurselidemiir@gmail.com` / `Nurseli1`
- Founder: `founder@joinfoundrly.com` / `Founder123!`
- Builder: `builder@joinfoundrly.com` / `Builder123!`
- Designer: `designer@joinfoundrly.com` / `Designer123!`
- Mentor: `mentor@joinfoundrly.com` / `Mentor123!`

---

## Suggested Demo Flow

A practical presentation flow:

1. Open the landing page and show the premium marketing experience.
2. Log in with the founder account.
3. Show dashboard KPIs, onboarding signal, and open project opportunities.
4. Open the AI Team Builder and run a match analysis.
5. Show the public profile and collaboration review area.
6. Show messages and accepted collaboration flow.
7. Switch to admin and show moderation / verified talent review.

---

## Frontend Experience

### Public routes

- `/#` → premium landing page
- `/#discover` → premium project discovery experience
- `/#teammates` → teammate showcase
- `/#community` → community feed experience
- `/#mentors` → public mentors list
- `/#login` → login screen
- `/#register` → registration screen
- `/#premium` → premium experience page
- `/#about`
- `/#privacy`
- `/#careers`
- `/#faq`
- `/#contact`

### App routes

- `/#app-home`
- `/#app-create`
- `/#app-messages`
- `/#app-profile`
- `/#app-ai-builder`
- `/#app-networking`
- `/#app-mentors`
- `/#app-mentor-panel`
- `/#app-admin`
- `/#app-member-<id>`

### Recently improved UX areas

- premium marketing landing
- premium discovery and teammate presentation
- founder dashboard hero / onboarding layer
- richer profile and public profile design
- improved AI match result presentation
- stronger startup-product visual language across app surfaces

---

## Backend Features

### Authentication
- register
- login with JWT
- refresh token support
- current user endpoint

### Profiles
- current user profile
- public user profiles
- profile picture upload
- verified talent flag
- premium flag
- mentor status
- collaboration reviews

### Projects
- create project
- list projects
- update/delete own project
- discover public projects
- premium project visibility signals

### Applications
- apply to project
- prevent duplicate applications
- review received applications
- accept/reject applications

### Messaging
- thread list
- thread detail
- send messages inside application threads

### Mentors
- mentor listing
- mentor request flow
- mentor request management
- mentor pricing

### Premium
- premium subscription simulation
- premium-only features and filters

### Admin / Moderation
- user search
- role updates
- premium moderation
- verified talent moderation
- project moderation
- user deletion

---

## AI Team Builder

The AI layer does not require a paid external AI API.

Current matching combines:
- TF-IDF based semantic analysis
- cosine similarity
- role and skills logic
- recommendation summaries

### AI outputs include
- `score`
- `match_label`
- `recommended_role`
- `ai_summary`
- `matched_skills`
- `missing_skills`

### Main AI endpoints
- `GET /api/dashboard/recommended-projects/`
- `GET /api/projects/<id>/matches/`

---

## API Reference

### Auth
```text
POST  /api/auth/register/
POST  /api/auth/token/
POST  /api/auth/token/refresh/
```

### Users
```text
GET   /api/users/
GET   /api/users/me/
PATCH /api/users/me/
GET   /api/users/<id>/
GET   /api/users/<id>/reviews/
POST  /api/users/<id>/reviews/
POST  /api/users/me/profile-picture/
```

### Projects
```text
GET    /api/projects/
POST   /api/projects/
GET    /api/projects/<id>/
PATCH  /api/projects/<id>/
DELETE /api/projects/<id>/
GET    /api/projects/<id>/matches/
```

### Applications
```text
GET   /api/applications/
POST  /api/applications/
PATCH /api/applications/<id>/status/
```

### Messages
```text
GET  /api/messages/threads/
GET  /api/messages/threads/<id>/
POST /api/messages/threads/<id>/messages/
```

### Dashboard
```text
GET /api/dashboard/summary/
GET /api/dashboard/recommended-projects/
```

### Premium
```text
GET  /api/premium/subscription/
POST /api/premium/subscription/
```

### Verification Requests
```text
GET   /api/verification-requests/
POST  /api/verification-requests/
PATCH /api/verification-requests/<id>/review/
```

### Mentors
```text
GET   /api/mentors/
POST  /api/mentors/requests/
GET   /api/mentors/my-requests/
PATCH /api/mentors/requests/<id>/status/
```

### Admin
```text
GET    /api/admin/dashboard/
GET    /api/admin/users/
GET    /api/admin/users/<id>/
PATCH  /api/admin/users/<id>/role/
PATCH  /api/admin/users/<id>/moderation/
DELETE /api/admin/users/<id>/moderation/
GET    /api/admin/projects/
GET    /api/admin/projects/<id>/
DELETE /api/admin/projects/<id>/
```

### Health
```text
GET /api/health/
```

---

## Filter Examples

```text
/api/projects/?mine=true
/api/projects/?joined=true
/api/projects/?premium_only=true
/api/projects/?search=ai

/api/users/?skill=django
/api/users/?interest=startup
/api/users/?verified_only=true

/api/applications/?mine=true
/api/applications/?received=true
/api/applications/?status=pending
/api/applications/?project=<id>
```

---

## Authorization Rules

Current important permission rules:
- only project owner can update/delete a project
- only project owner can change application status
- users cannot apply to their own project
- users cannot apply twice to the same project
- premium-only filters are protected
- AI matching endpoints are premium-only
- some project detail fields are restricted to project owner and accepted collaborators
- admin moderation endpoints require elevated roles

---

## Frontend Development

### Install frontend dependencies locally

```bash
npm --prefix frontend install
```

### Run frontend locally

```bash
npm --prefix frontend run dev
```

### Build frontend

```bash
npm --prefix frontend run build
```

Current frontend includes:
- React
- TypeScript
- Tailwind CSS
- Vite
- Framer Motion

---

## iOS Status

`ios/FoundrlyApp/` contains SwiftUI source files for the iOS concept app.

Included screens and flows:
- auth
- home
- discover
- messages
- mentors
- profile
- AI builder
- community

Important note:
- there is no ready `.xcodeproj` file in this repository
- to run it, create a new iOS App in Xcode and add these Swift files manually

So the iOS side is source-ready, but not yet packaged as a fully runnable Xcode project.

---

## Assets and Delivery Notes

Included delivery assets:
- `logo/` files
- `frontend/public/logo.png`
- `frontend/public/favicon.png`
- `mentörler/` story visuals

Repository notes:
- `proje.md` contains the project summary / delivery-oriented notes
- some delivery screenshots like domain purchase evidence may still need to be added manually if required for submission

---

## Verification Checklist

To verify the full stack quickly:

```bash
docker compose ps
docker compose exec web python manage.py check
docker compose exec web python manage.py seed_demo_data
npm --prefix frontend run build
```

Check manually:
- `http://localhost:3000`
- `http://localhost:8000/admin/`
- `http://localhost:8000/api/health/`

---

## Notes

- The project is designed for demoability as well as coursework delivery.
- Premium and billing flows are simulated product flows, not a live Stripe integration.
- AI matching is local and deterministic enough for demo use.
- Docker is the recommended development path for backend + frontend + database together.

---

## License / Credits

© 2026 Foundrly  
Nurseli Demir (22253042)
