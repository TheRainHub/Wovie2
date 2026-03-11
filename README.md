# 🎬 Wovie v2

A modern movie discovery and social platform built with **Next.js 16**, **React 19**, **TypeScript**, **Prisma**, and **PostgreSQL**.

> Rewrite of [Wovie v1](https://github.com/TheRainHub/Wovie) — rebuilt from the ground up with modern architecture, security, and design.

## Features

- 🔐 **Authentication** — secure login/register with NextAuth.js + OAuth
- 🎥 **Movie Catalog** — browse, filter by genre, SSR for SEO
- 🔍 **Search** — full-text search with filters (genre, year, rating)
- ⭐ **Ratings & Reviews** — rate movies 1-10, write reviews
- ❤️ **Favorites & Watchlists** — save movies, create custom lists
- 👤 **User Profiles** — avatar, stats, activity history
- 🌙 **Dark Mode** — glassmorphism UI with smooth animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | NextAuth.js |
| API | TMDB (The Movie Database) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database ([Neon](https://neon.tech) free tier recommended)
- [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/TheRainHub/wovie-v2.git
cd wovie-v2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, TMDB_API_KEY, etc.

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
TMDB_API_KEY="your_tmdb_api_key"
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema

```
User ──< Favorite >── Movie ──< MovieGenre >── Genre
  │                     │
  ├──< Review          ├──< MovieActor >── Actor
  │
  └──< Watchlist ──< WatchlistItem >── Movie
```

10 models: `User`, `Movie`, `Genre`, `Actor`, `MovieGenre`, `MovieActor`, `Favorite`, `Review`, `Watchlist`, `WatchlistItem`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Apply migrations |

## Project Structure

```
wovie-v2/
├── app/
│   ├── api/            # API routes
│   ├── lib/            # Utilities (db.ts, tmdb.ts)
│   ├── generated/      # Prisma client (gitignored)
│   ├── globals.css     # Design tokens
│   ├── layout.tsx      # Root layout (fonts, metadata)
│   └── page.tsx        # Home page
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Migration history
├── public/             # Static assets
├── tailwind.config.ts  # Design system (colors, fonts)
└── .env                # Secrets (gitignored)
```

## License

This project is part of a university semester project (MIW).
