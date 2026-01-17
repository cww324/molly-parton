# Molly Parton

A festival-inspired clothing brand celebrating self-expression, freedom, and the feral joy of letting go.

## The Story

The name comes from a girl I met at a music festival years ago. She'd show up dressed like Dolly Parton, dance like a wild animal, and radiate pure unfiltered joy. She called herself "Molly Parton." Watching her completely release and enjoy every second of her life was genuinely inspiring.

This brand is for people who want to express that same energy - bold, free, unapologetically alive.

## Why Build This

1. **Validate a business idea** - Test if this brand resonates before investing heavily
2. **Portfolio piece** - Demonstrate full-stack e-commerce skills to potential employers
3. **Learn by doing** - Hands-on experience with payments, fulfillment APIs, and modern frameworks
4. **Keep costs low** - Use free tiers and only pay when sales happen

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js | React + SSR for SEO, hot skill in the job market |
| Hosting | Vercel | Free tier, zero-config deploys, perfect for Next.js |
| Database | Supabase | PostgreSQL with a generous free tier, auth built-in |
| Payments | Stripe | Industry standard, only pay per transaction |
| Fulfillment | Printify | Dropship t-shirts, no inventory, integrates via API |

## Roadmap

### Stage 1: MVP (Validate)
- [ ] Product catalog page
- [ ] Individual product pages
- [ ] Shopping cart
- [ ] Stripe Checkout integration
- [ ] Order confirmation + storage

### Stage 2: Real Fulfillment
- [ ] Printify API integration
- [ ] Order status tracking
- [ ] Email notifications

### Stage 3: Growth
- [ ] User accounts
- [ ] Order history
- [ ] Reviews
- [ ] Analytics

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
PRINTIFY_API_KEY=
```

## License

MIT
