# CLAUDE.md

Guidance for Claude Code when working on this repository.

## Project Overview

Molly Parton is a festival-inspired clothing e-commerce site. It's both a real business validation project and a portfolio piece to demonstrate full-stack skills.

**Core principle:** Keep it simple. Validate first, optimize later. Don't over-engineer.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (if needed, defer until Stage 3)
- **Payments:** Stripe Checkout
- **Fulfillment:** Printify API
- **Styling:** Tailwind CSS

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

Docker dev (preferred when available):
```bash
docker-compose up -d web
docker-compose up stripe
```

If using Docker locally, prefer the compose workflow above instead of running `npm run dev` directly.
Vercel production deploys run the Next.js app directly (no Docker in production).

## Syncing Design Images

Design images are created with Fooocus on Windows. To sync new images to the repo:

```bash
# Copy new images only (skip existing)
cp -n /mnt/d/Foocus/created_images/* ~/workspace/molly-parton/images/
```

When user says "sync photos" or similar, run this command.

## Project Structure

```
molly-parton/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home / product listing
│   ├── product/[id]/      # Product detail pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Stripe checkout
│   └── api/               # API routes
│       ├── stripe/        # Stripe webhooks
│       └── orders/        # Order management
├── components/            # React components
├── lib/                   # Utilities, API clients
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe utilities
│   └── printify.ts       # Printify API client
├── types/                 # TypeScript types
└── public/               # Static assets
```

## Database Schema (Supabase)

```sql
-- Products (can also sync from Printify)
create table products (
  id uuid primary key default gen_random_uuid(),
  printify_id text unique,
  title text not null,
  description text,
  price decimal(10,2) not null,
  images text[],
  variants jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  printify_order_id text,
  customer_email text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  total decimal(10,2) not null,
  status text default 'pending',
  created_at timestamptz default now()
);
```

## Key Implementation Notes

### Stripe Checkout Flow
1. User clicks "Buy" → create Stripe Checkout Session (server-side)
2. Redirect to Stripe's hosted checkout page
3. Stripe webhook confirms payment → save order to Supabase
4. Trigger Printify order via API

### Printify Integration
- Use Printify API to fetch product catalog
- Or manually add products if catalog is small
- On successful payment, POST to Printify to create order
- Printify handles printing + shipping

### Environment Variables
Never commit secrets. Use `.env.local` for development, Vercel environment variables for production.

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret (server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `PRINTIFY_API_KEY` - Printify API token
- `STRIPE_WEBHOOK_SECRET` - For verifying Stripe webhooks

## Coding Guidelines

1. **Keep components small** - Extract when a component does more than one thing
2. **Server Components by default** - Use 'use client' only when needed
3. **TypeScript strict mode** - No `any` types unless absolutely necessary
4. **Error handling** - Graceful failures, user-friendly error messages
5. **Mobile-first** - Design for mobile, scale up to desktop
6. **Commit often** - Use small, descriptive commits to highlight progress for portfolio/recruiting

## Branch Naming

Use feature branches for larger changes; direct commits to `develop` are fine for small fixes.

Format:
- `feature/<area>-<short-description>`
- `fix/<area>-<short-description>`
- `chore/<area>-<short-description>`
- `docs/<area>-<short-description>`

Examples:
- `feature/stripe-webhooks`
- `feature/printify-integration`
- `fix/checkout-validation`
- `docs/deploy-notes`

## Deployment

Push to `main` branch → Vercel auto-deploys.

Current status:
- Supabase + Stripe environment variables are configured.
- Stripe is still in test mode, so real charges/orders are not live yet.
- Printify keys are not set; fulfillment is not wired up.
- Google Analytics is wired in `app/layout.tsx` via `NEXT_PUBLIC_GA_ID`.
- Reminder: add `NEXT_PUBLIC_GA_ID=G-CLTTKEMTLF` in Vercel (Production) and redeploy.

For environment variables:
1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add all required variables
3. Redeploy if needed

## Testing Stripe

Use Stripe test mode and test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## External Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Checkout](https://stripe.com/docs/checkout)
- [Printify API](https://developers.printify.com/)

## Branch Naming

Use feature branches for larger changes; direct commits to `develop` are fine for small fixes.

Format:
- `feature/<area>-<short-description>`
- `fix/<area>-<short-description>`
- `chore/<area>-<short-description>`
- `docs/<area>-<short-description>`

Examples:
- `feature/stripe-webhooks`
- `feature/printify-integration`
- `fix/checkout-validation`
- `docs/deploy-notes`

## Next Session Start

Status:
- Stripe checkout + webhook endpoint implemented
- Supabase `orders` table created
- Stripe CLI listener runs via Docker (`stripe` service in `docker-compose.yml`)

Resume from here:
1. Ensure `.env.local` has `STRIPE_WEBHOOK_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`
2. Start dev stack: `docker-compose up -d web` and `docker-compose up stripe`
3. Trigger test event:
   `docker run --rm -v ~/.config/stripe:/root/.config/stripe stripe/stripe-cli:latest trigger checkout.session.completed`
4. Verify insert in Supabase `orders` table

Planned work:
- Cart + multi-item checkout flow
- Order confirmation page
- Printify product sync (later)
