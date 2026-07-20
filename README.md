# Hearts by Charming — Referral Portal

A premium, production-ready referral management platform for Hearts by Charming, a youth development NGO.

## Features

- **Referral System** — Unique branded referral codes (HBC-XXXXX), links, and QR codes
- **Live Leaderboard** — Real-time rankings with animated podium
- **Rewards System** — Gold (₦10K), Silver (₦7K), Bronze (₦5K) tiers
- **Admin Dashboard** — Full management with analytics, verification, exports
- **Email Notifications** — Welcome, verification, leaderboard, and reward emails
- **Responsive Design** — Mobile-first, premium UI with Framer Motion animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js Server Actions, API Routes |
| Database | Neon PostgreSQL + Prisma ORM |
| Auth | NextAuth/Auth.js with JWT sessions |
| Email | Resend |
| Charts | Recharts |
| Animations | Framer Motion |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database
- Resend API key (for emails)

### Setup

```bash
# Clone the repository
git clone https://github.com/Johnfavour-maidu/hearts-by-charming.git
cd hearts-by-charming

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### Admin Credentials

After seeding:

- **Email:** admin@heartsbycharming.org
- **Password:** Admin@123

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, register, forgot-password)
│   ├── (dashboard)/     # Participant dashboard pages
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   ├── r/[code]/        # Referral redirect
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── landing/         # Landing page sections
│   ├── shared/          # Shared components
│   └── admin/           # Admin components
├── lib/                 # Utilities, auth, email, referral logic
├── types/               # TypeScript types
├── config/              # Site configuration
├── actions/             # Server actions
└── hooks/               # Custom React hooks
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
RESEND_API_KEY="re_..."
```

## License

MIT © Hearts by Charming
