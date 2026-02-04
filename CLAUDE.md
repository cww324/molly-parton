# CLAUDE.md

Guidance for Claude Code when working on this repository.

## Project Overview

Molly Parton is a festival-inspired clothing e-commerce site. It's both a real business validation project and a portfolio piece to demonstrate full-stack skills.

**Core principle:** Keep it simple. Validate first, optimize later. Don't over-engineer.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
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
│   ├── page.tsx           # Home / landing page
│   ├── shop/              # Product listing (fetches from DB)
│   ├── product/[slug]/    # Product detail pages (by slug)
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Stripe checkout
│   └── api/               # API routes
│       ├── admin/         # Admin endpoints (shops, sync-products)
│       ├── products/      # Product lookup by ID
│       ├── stripe/        # Stripe webhooks
│       └── checkout/      # Checkout session creation
├── components/            # React components
│   ├── cart-provider.tsx  # Cart context (supports variants)
│   ├── product-card.tsx   # Product card with images
│   ├── product-purchase.tsx # Add to cart with variant selection
│   └── variant-selector.tsx # Size/variant dropdown
├── lib/                   # Utilities, API clients
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe utilities
│   ├── printify.ts       # Printify API client
│   └── products-db.ts    # Product database queries
├── types/                 # TypeScript types
│   └── product.ts        # Product types for Printify + DB
└── public/               # Static assets
```

## Database Schema (Supabase)

**Products table** (for Printify sync):
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  printify_id text unique not null,
  slug text unique not null,
  title text not null,
  description text,
  tags text[] default '{}',
  images jsonb default '[]',
  variants jsonb default '[]',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index products_slug_idx on products(slug);
create index products_active_idx on products(active) where active = true;
```

**Orders table** (already created):
```sql
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

### Stripe + Printify Payment Flow
1. User selects product + variant (size) → adds to cart
2. User clicks checkout → create Stripe Checkout Session (server-side)
3. Redirect to Stripe's hosted checkout page
4. Stripe webhook confirms payment → save order to Supabase
5. (TODO) Trigger Printify order via API
6. Printify handles printing + shipping

### Printify Integration
- `lib/printify.ts` - API client with `getShops()`, `getProducts()`, `getProduct()`
- `app/api/admin/shops` - GET endpoint to find Shop ID
- `app/api/admin/sync-products` - POST endpoint to sync Printify → Supabase
- Shop ID: `26168397` (configured in `.env.local`)

### Cart System
- Cart now tracks `{ productId, variantId, quantity }` for variant support
- Cart context provides safe defaults for SSR (no throwing during build)
- Prices come from selected variant, not hardcoded

### Environment Variables
Never commit secrets. Use `.env.local` for development, Vercel environment variables for production.

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `STRIPE_SECRET_KEY` - Stripe secret (server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - For verifying Stripe webhooks
- `PRINTIFY_API_KEY` - Printify API token
- `PRINTIFY_SHOP_ID` - Printify shop ID (`26168397`)

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

## Deployment

Push to `main` branch → Vercel auto-deploys.

Current status:
- Supabase + Stripe environment variables are configured
- Stripe is still in test mode
- Printify API key and Shop ID are configured
- Google Analytics is wired in `app/layout.tsx` via `NEXT_PUBLIC_GA_ID`

For environment variables:
1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add all required variables (including `PRINTIFY_API_KEY` and `PRINTIFY_SHOP_ID`)
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

---

## Known Issues

### Docker Build Error (Static Generation)
The production build (`npm run build`) fails during static page generation with this error:
```
Error: <Html> should not be imported outside of pages/_document.
```

This error occurs on:
- `/_error: /404`
- `/_error: /500`
- `/_not-found/page`
- `/cart/page`
- `/checkout/confirmation/page`
- `/page` (home)

**What we know:**
- This is NOT caused by the Printify integration changes
- The error occurred even on the original code before changes
- Upgrading from Next.js 14.2.5 to 15.1.6 did not fix it
- The dev server (`npm run dev`) works fine
- May work differently on Vercel since Vercel handles builds differently

**Workaround:**
- The dev server works - use `docker-compose up -d web` for local development
- Try deploying to Vercel to see if production builds work there

---

## Next Session Start

**Current branch:** `feature/printify-integration`

### What was completed:
1. Created Printify API client (`lib/printify.ts`)
2. Created admin endpoints for shop lookup and product sync
3. Created product types (`types/product.ts`) and DB access layer (`lib/products-db.ts`)
4. Updated shop page to fetch products from database
5. Created new `[slug]` product route with variant support
6. Updated cart provider to track variants (`productId`, `variantId`, `quantity`)
7. Updated checkout API to look up products from database
8. Created variant selector component
9. Updated product card to show real images
10. Added Printify image domains to next.config.js
11. Upgraded to Next.js 15 and React 19
12. Fixed webhook route for Next.js 15 async headers

### What still needs to be done:
1. **Create the products table in Supabase** - Run the SQL from "Database Schema" section above
2. **Sync products from Printify** - Call `POST /api/admin/sync-products` after creating the table
3. **Test the full flow** - Add product to cart, checkout, verify order in Supabase
4. **Fix the build error** - Investigate the `<Html>` error or test if Vercel handles it differently
5. **Wire up Printify order creation** - After successful payment, create order in Printify
6. **Delete old files** - `lib/products.ts` (old hardcoded products) can be deleted after verification

### To resume:
1. Start dev server: `docker-compose up -d web`
2. Create products table in Supabase dashboard (run SQL above)
3. Sync products: `curl -X POST http://localhost:3000/api/admin/sync-products`
4. Visit `http://localhost:3000/shop` to see real products
5. Test add to cart and checkout flow
